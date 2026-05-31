import "server-only";

import { z } from "zod";
import type { ChatAction } from "@/lib/chat-types";
import {
  getAllowedEmail,
  getAllowedExternalHosts,
  getAllowedInternalRoutes,
} from "./chat-knowledge";

// Conversation envelope the /api/chat route accepts.
// Caps enforce both cost and abuse limits:
//   - 16 messages: enough for a substantive back-and-forth, not unbounded
//   - 500 chars / user message: a real question, not a pasted document
//   - 4000 chars / assistant message: replies the model itself produced,
//     echoed back to provide conversational context on follow-ups

const UserMessageSchema = z.object({
  role: z.literal("user"),
  content: z.string().min(1).max(500),
});
const AssistantMessageSchema = z.object({
  role: z.literal("assistant"),
  content: z.string().min(1).max(4000),
});

export const ChatMessageSchema = z.discriminatedUnion("role", [
  UserMessageSchema,
  AssistantMessageSchema,
]);

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(16),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ─── Actions ───────────────────────────────────────────────────────

const RouteAction = z.object({
  kind: z.literal("route"),
  label: z.string().min(1).max(40),
  href: z.string(),
});
const LinkAction = z.object({
  kind: z.literal("link"),
  label: z.string().min(1).max(40),
  href: z.string(),
});
const EmailAction = z.object({
  kind: z.literal("email"),
  label: z.string().min(1).max(40),
  to: z.string(),
  subject: z.string().max(80).optional(),
});
const CopyAction = z.object({
  kind: z.literal("copy"),
  label: z.string().min(1).max(40),
  value: z.string().max(200),
});

export const ChatActionSchema: z.ZodType<ChatAction> = z.discriminatedUnion(
  "kind",
  [RouteAction, LinkAction, EmailAction, CopyAction],
);

// Parses + validates the raw text the model emitted after the ACTIONS marker
// and filters out anything the visitor shouldn't see (off-allowlist URLs,
// wrong email addresses, malformed shapes). Returns at most 3 actions.
export function sanitizeActions(raw: string): ChatAction[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const allowedRoutes = new Set(getAllowedInternalRoutes());
  const allowedHosts = new Set(getAllowedExternalHosts());
  const allowedEmail = getAllowedEmail();

  const out: ChatAction[] = [];
  for (const item of parsed) {
    const candidate = ChatActionSchema.safeParse(item);
    if (!candidate.success) continue;
    const action = candidate.data;

    if (action.kind === "route") {
      if (!allowedRoutes.has(action.href)) continue;
    } else if (action.kind === "link") {
      let host: string;
      try {
        host = new URL(action.href).host.toLowerCase();
      } catch {
        continue;
      }
      const apex = host.startsWith("www.") ? host.slice(4) : host;
      const ok = [...allowedHosts].some(
        (allowed) => apex === allowed || apex.endsWith(`.${allowed}`),
      );
      if (!ok) continue;
    } else if (action.kind === "email") {
      if (action.to.toLowerCase() !== allowedEmail.toLowerCase()) continue;
    } else if (action.kind === "copy") {
      // free-form, capped by schema
    }
    out.push(action);
    if (out.length >= 3) break;
  }
  return out;
}

// Parses the raw text the model emitted after the FOLLOWUPS marker into a
// short list of visitor-voice next questions. Defensive: the model controls
// this string, so cap count, length, and strip anything non-string.
export function sanitizeFollowups(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    if (typeof item !== "string") continue;
    const q = item.trim().replace(/\s+/g, " ").slice(0, 80);
    if (q.length < 4) continue;
    const key = q.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
    if (out.length >= 3) break;
  }
  return out;
}
