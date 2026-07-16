// POST /api/contact — delivers contact-form submissions to my inbox via Resend.
//
// Required env vars:
//   RESEND_API_KEY              — secret key for the Resend REST API
//   UPSTASH_REDIS_REST_URL      — IP rate limiter (optional in dev; warns if absent)
//   UPSTASH_REDIS_REST_TOKEN    — IP rate limiter (optional in dev; warns if absent)
//
// Delivery: one notification email to TO, with the visitor's address set as
// Reply-To so a reply from the inbox goes straight back to them. No copy is
// sent to the visitor.

import { EMAIL } from "@/lib/identity";
import { roleTypeLabel } from "@/lib/contact";
import { ContactRequestSchema } from "@/lib/server/contact-schema";
import {
  checkContactRateLimit,
  rateLimitConfigured,
} from "@/lib/server/rate-limit";

export const runtime = "edge";

const RESEND_URL = "https://api.resend.com/emails";
// Must be an address on a domain verified in the Resend dashboard.
const FROM = "Portfolio <contact@vvr.dev>";
const TO = EMAIL;

export async function POST(req: Request): Promise<Response> {
  const startedAt = Date.now();

  // 1. Validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "bad_json");
  }
  const parsed = ContactRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "bad_shape");
  const data = parsed.data;

  // Honeypot tripped: pretend success so the bot moves on, but send nothing.
  if (data.website) {
    return Response.json({ ok: true });
  }

  // 2. Rate-limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const limit = await checkContactRateLimit(ip);
  if (!limit.success) {
    return new Response(
      JSON.stringify({ error: "rate_limited", reason: limit.reason }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(limit.retryAfterSec ?? 60),
        },
      },
    );
  }

  // 3. Verify upstream is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return jsonError(500, "resend_unconfigured");

  // 4. Build and send the email
  const kind = roleTypeLabel(data["role-type"]);
  const subject = `Portfolio contact — ${data.name} · ${kind}`;

  const upstream = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: data.email,
      subject,
      text: renderText(data),
      html: renderHtml(data),
    }),
  });

  if (!upstream.ok) {
    // Surface the upstream failure to server logs so misconfigurations
    // (unverified domain, expired key) are debuggable instead of an opaque 502.
    const detail = await upstream.text().catch(() => "");
    console.error(
      JSON.stringify({
        type: "contact_upstream_error",
        status: upstream.status,
        detail: detail.slice(0, 500),
      }),
    );
    return jsonError(502, "upstream_error");
  }

  console.log(
    JSON.stringify({
      type: "contact_submission",
      role_type: data["role-type"],
      has_company: !!data.company,
      latency_ms: Date.now() - startedAt,
      rate_limit_configured: rateLimitConfigured,
    }),
  );

  return Response.json({ ok: true });
}

type ContactData = {
  name: string;
  email: string;
  "role-type": string;
  company: string;
  message: string;
};

function renderText(d: ContactData): string {
  return [
    `Name:    ${d.name}`,
    `Email:   ${d.email}`,
    `Kind:    ${roleTypeLabel(d["role-type"])}`,
    `Company: ${d.company || "—"}`,
    "",
    "Message:",
    d.message,
  ].join("\n");
}

function renderHtml(d: ContactData): string {
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", `<a href="mailto:${escapeAttr(d.email)}">${esc(d.email)}</a>`],
    ["Kind", roleTypeLabel(d["role-type"])],
    ["Company", d.company || "—"],
  ];
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6b7280;font:13px system-ui;vertical-align:top">${k}</td>` +
        `<td style="padding:4px 0;color:#111827;font:13px system-ui">${k === "Email" ? v : esc(v)}</td></tr>`,
    )
    .join("");
  return [
    `<div style="max-width:560px;margin:0 auto;font:14px system-ui;color:#111827">`,
    `<h2 style="font:600 16px system-ui;margin:0 0 16px">New portfolio contact</h2>`,
    `<table style="border-collapse:collapse;margin-bottom:16px">${rowHtml}</table>`,
    `<div style="white-space:pre-wrap;border-top:1px solid #e5e7eb;padding-top:16px;line-height:1.6">${esc(
      d.message,
    )}</div>`,
    `</div>`,
  ].join("");
}

// Escape user text before interpolating into the HTML email body.
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return esc(s).replace(/'/g, "&#39;");
}

function jsonError(status: number, code: string): Response {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
