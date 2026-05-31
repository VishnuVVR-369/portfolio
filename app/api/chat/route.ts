// POST /api/chat — streaming chat backend for the FloatingChat widget.
//
// Required env vars:
//   OPENAI_API_KEY              — secret key for the Chat Completions API
//   UPSTASH_REDIS_REST_URL      — IP rate limiter (optional in dev; warns if absent)
//   UPSTASH_REDIS_REST_TOKEN    — IP rate limiter (optional in dev; warns if absent)
//
// Wire protocol: SSE (`text/event-stream`). The client receives a sequence
// of `data: {…json…}\n\n` frames, one of these types:
//   { type: "text",      delta: string }   — incremental assistant text
//   { type: "actions",   items: Action[] }  — sanitized structured actions, at most one frame
//   { type: "followups", items: string[] }  — visitor-voice next questions, at most one frame
//   { type: "done"   }                       — terminal frame, server is finished
//   { type: "error", code: string }          — terminal error frame

import {
  ChatRequestSchema,
  sanitizeActions,
  sanitizeFollowups,
} from "@/lib/server/chat-schema";
import {
  ACTIONS_MARKER,
  FOLLOWUPS_MARKER,
  buildSystemPrompt,
} from "@/lib/server/chat-prompt";
import { checkRateLimit, rateLimitConfigured } from "@/lib/server/rate-limit";

export const runtime = "edge";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-5.4-nano-2026-03-17";

async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(`vvr:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .slice(0, 6)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request): Promise<Response> {
  const startedAt = Date.now();

  // 1. Validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "bad_json");
  }
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "bad_shape");

  // 2. Rate-limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const limit = await checkRateLimit(ip);
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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return jsonError(500, "openai_unconfigured");

  // 4. Build the model request
  const upstream = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      stream_options: { include_usage: true },
      temperature: 0.6,
      // GPT-5 / o-series reasoning models renamed this param.
      // Older chat-completions models accept either, so this is safe across the line.
      max_completion_tokens: 400,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...parsed.data.messages,
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    // Surface the upstream failure to server logs so misconfigurations
    // (wrong model id, expired key, missing scope) are debuggable instead
    // of just landing as an opaque 502 for the client.
    const detail = await upstream.text().catch(() => "");
    console.error(
      JSON.stringify({
        type: "chat_upstream_error",
        status: upstream.status,
        model: MODEL,
        detail: detail.slice(0, 500),
      }),
    );
    return jsonError(502, "upstream_error");
  }

  // 5. Transform the OpenAI SSE stream into our SSE protocol while watching
  //    for the trailing markers. Everything before the first marker is
  //    forwarded as `text` deltas; from the first marker on, the remainder
  //    accumulates into `tail` and is parsed once at the end into the
  //    structured `actions` / `followups` blocks (emitted in any order).
  const TAIL_MARKERS = [ACTIONS_MARKER, FOLLOWUPS_MARKER];
  const MAX_MARKER_LEN = Math.max(
    ACTIONS_MARKER.length,
    FOLLOWUPS_MARKER.length,
  );
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };

      let inTail = false;
      let tail = ""; // raw text from the first marker onward (markers included)
      let pending = ""; // text buffer holding back a possible split marker
      let inputTokens = 0;
      let outputTokens = 0;
      let finishReason: string | undefined;

      const flushText = (chunk: string) => {
        if (chunk) send({ type: "text", delta: chunk });
      };

      try {
        const reader = upstream.body!.getReader();
        const decoder = new TextDecoder();
        let sseBuf = "";

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          sseBuf += decoder.decode(value, { stream: true });

          let lineEnd: number;
          while ((lineEnd = sseBuf.indexOf("\n")) >= 0) {
            const line = sseBuf.slice(0, lineEnd).trimEnd();
            sseBuf = sseBuf.slice(lineEnd + 1);
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;

            let evt: {
              choices?: { delta?: { content?: string }; finish_reason?: string }[];
              usage?: { prompt_tokens?: number; completion_tokens?: number };
            };
            try {
              evt = JSON.parse(payload);
            } catch {
              continue;
            }

            if (evt.usage) {
              inputTokens = evt.usage.prompt_tokens ?? 0;
              outputTokens = evt.usage.completion_tokens ?? 0;
            }
            if (evt.choices?.[0]?.finish_reason) {
              finishReason = evt.choices[0].finish_reason;
            }

            const delta = evt.choices?.[0]?.delta?.content;
            if (!delta) continue;

            if (inTail) {
              tail += delta;
              continue;
            }

            pending += delta;
            // First occurrence of EITHER trailing marker ends the prose.
            const markerIdx = TAIL_MARKERS.reduce((earliest, m) => {
              const i = pending.indexOf(m);
              return i >= 0 && (earliest < 0 || i < earliest) ? i : earliest;
            }, -1);
            if (markerIdx >= 0) {
              // Anything before the marker is final visible text.
              flushText(pending.slice(0, markerIdx));
              // Everything from the marker on belongs to the tail.
              tail = pending.slice(markerIdx);
              pending = "";
              inTail = true;
              continue;
            }

            // No marker yet — emit everything except a window the size of the
            // longest marker so one split across deltas isn't missed.
            const safeUntil = pending.length - (MAX_MARKER_LEN - 1);
            if (safeUntil > 0) {
              flushText(pending.slice(0, safeUntil));
              pending = pending.slice(safeUntil);
            }

            if (finishReason) break outer;
          }
        }

        // Final flush
        if (!inTail && pending) flushText(pending);
        if (inTail) {
          const actions = sanitizeActions(blockAfter(tail, ACTIONS_MARKER));
          if (actions.length) send({ type: "actions", items: actions });
          const followups = sanitizeFollowups(
            blockAfter(tail, FOLLOWUPS_MARKER),
          );
          if (followups.length) send({ type: "followups", items: followups });
        }
        send({ type: "done" });
      } catch {
        send({ type: "error", code: "stream_error" });
      } finally {
        controller.close();
        const ipHash = await hashIp(ip);
        // Structured log line — visible in Vercel logs. No raw prompts.
        console.log(
          JSON.stringify({
            type: "chat_completion",
            ip_hash: ipHash,
            turns: parsed.data.messages.length,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            finish_reason: finishReason ?? null,
            latency_ms: Date.now() - startedAt,
            rate_limit_configured: rateLimitConfigured,
          }),
        );
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    },
  });
}

// Returns the slice of `tail` that follows `marker`, up to the start of the
// other trailing marker (or end of string). Empty string if `marker` is
// absent. Lets the two structured blocks appear in any order.
function blockAfter(tail: string, marker: string): string {
  const start = tail.indexOf(marker);
  if (start < 0) return "";
  const from = start + marker.length;
  let end = tail.length;
  for (const other of [ACTIONS_MARKER, FOLLOWUPS_MARKER]) {
    if (other === marker) continue;
    const j = tail.indexOf(other, from);
    if (j >= 0 && j < end) end = j;
  }
  return tail.slice(from, end);
}

function jsonError(status: number, code: string): Response {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
