// Type-only definitions shared between the server route handler and the
// client chat UI. NO runtime exports here — keep this file importable
// from both sides. The Zod schemas that produce these types live in
// lib/server/chat-schema.ts and are server-only.

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type ChatAction =
  | { kind: "route"; label: string; href: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "email"; label: string; to: string; subject?: string }
  | { kind: "copy"; label: string; value: string };

// SSE frame shapes emitted by /api/chat. The client switches on `type`.
// `followups` carries 0–3 visitor-voice next questions the visitor can tap to
// keep the conversation moving — emitted at most once, after the prose.
export type ChatStreamEvent =
  | { type: "text"; delta: string }
  | { type: "actions"; items: ChatAction[] }
  | { type: "followups"; items: string[] }
  | { type: "done" }
  | { type: "error"; code: string };
