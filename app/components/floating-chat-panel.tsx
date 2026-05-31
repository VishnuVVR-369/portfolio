"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { track } from "@vercel/analytics";
import type {
  ChatAction,
  ChatMessage,
  ChatStreamEvent,
} from "@/lib/chat-types";

interface PanelProps {
  onClose: () => void;
  // Drives the exit animation. When `open` flips to false, the parent
  // keeps us mounted briefly so the closing transition can play.
  open: boolean;
}

interface UiMessage extends ChatMessage {
  id: string;
  actions?: ChatAction[];
  followups?: string[];
  pending?: boolean;
  // True for messages already in localStorage on hydrate — used to skip
  // the entrance animation for historical messages so the panel doesn't
  // explode with motion on open.
  historical?: boolean;
}

const STORAGE_KEY = "vvr:chat";
const MAX_INPUT_LEN = 500;
const NEAR_BOTTOM_PX = 96;
// Match the panel exit-animation duration in CSS (ms).
const EXIT_MS = 200;

function hydrateFromStorage(): UiMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as UiMessage[]).map((m) => ({ ...m, historical: true }));
  } catch {
    return [];
  }
}

type Starter = { id: string; label: string; prompt: string };

// Grouped so the empty state reads as a curated menu — "here's what I'm worth
// asking about" — instead of a flat list of bot prompts. Each group opens a
// different conversational lane; the last one carries the personality.
const STARTER_GROUPS: { group: string; items: Starter[] }[] = [
  {
    group: "work",
    items: [
      {
        id: "build",
        label: "what are you building right now?",
        prompt: "What are you building right now?",
      },
      {
        id: "factset",
        label: "why factset?",
        prompt: "Why did you join FactSet, and why have you stayed?",
      },
    ],
  },
  {
    group: "projects",
    items: [
      {
        id: "pdf",
        label: "how does chat with pdf work?",
        prompt: "Tell me about Chat with PDF — what's the architecture?",
      },
      {
        id: "proud",
        label: "what are you most proud of?",
        prompt: "Which project are you most proud of, and why?",
      },
    ],
  },
  {
    group: "the rest",
    items: [
      {
        id: "hire",
        label: "are you open to roles?",
        prompt: "Are you open to new roles? What are you looking for?",
      },
      {
        id: "surprise",
        label: "tell me something surprising",
        prompt:
          "Tell me something surprising about you that isn't obvious from the rest of the site.",
      },
    ],
  },
];

// Cycled through the composer placeholder to keep the input feeling alive.
const PLACEHOLDER_HINTS = [
  "ask about a project...",
  "what's your stack?",
  "are you open to roles?",
  "what are you building?",
  "tell me something surprising...",
];

// Types out the placeholder hints one character at a time, pausing on a full
// phrase before deleting and moving to the next. Only runs while `active`
// (input empty, not busy); collapses to a static hint under reduced motion.
function useRotatingPlaceholder(active: boolean): string {
  const [text, setText] = useState(PLACEHOLDER_HINTS[0]);
  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Initial state is already the first hint — leave it static.
      return;
    }
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: number;
    const tick = () => {
      const full = PLACEHOLDER_HINTS[phrase];
      if (!deleting) {
        char += 1;
        setText(full.slice(0, char));
        if (char >= full.length) {
          deleting = true;
          timer = window.setTimeout(tick, 2000);
          return;
        }
        timer = window.setTimeout(tick, 42 + Math.random() * 38);
      } else {
        char -= 1;
        setText(full.slice(0, char));
        if (char <= 0) {
          deleting = false;
          phrase = (phrase + 1) % PLACEHOLDER_HINTS.length;
          timer = window.setTimeout(tick, 320);
          return;
        }
        timer = window.setTimeout(tick, 22);
      }
    };
    timer = window.setTimeout(tick, 1100);
    return () => window.clearTimeout(timer);
  }, [active]);
  return text;
}

export function FloatingChatPanel({ onClose, open }: PanelProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<UiMessage[]>(hydrateFromStorage);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Persist on every change. Drop transient flags so a reload mid-stream
  // doesn't leave a permanent "typing…" indicator.
  useEffect(() => {
    try {
      const serializable = messages.map((m) => {
        const { pending: _p, historical: _h, ...rest } = m;
        void _p;
        void _h;
        return rest;
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      /* quota or private mode — ignore */
    }
  }, [messages]);

  const updateScrollStickiness = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    stickToBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
  }, []);

  // Autoscroll while the visitor is already near the latest turn. If they
  // scroll upward to reread context, keep their place instead of fighting it.
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el || messages.length === 0) return;
    if (!stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Focus the input on open, restore previously focused element on unmount.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => previouslyFocused?.focus?.();
  }, []);

  // Cancel any in-flight stream when the panel unmounts.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 112); // 7rem cap
    el.style.height = `${next}px`;
  }, [input]);

  // Trap focus within the panel.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const send = useCallback(
    async (text: string, options?: { appendUser?: boolean }) => {
      const trimmed = text.trim().slice(0, MAX_INPUT_LEN);
      if (!trimmed || busy) return;
      const appendUser = options?.appendUser ?? true;
      const baseHistory: ChatMessage[] = messages.map(({ role, content }) => ({
        role,
        content,
      }));
      const lastHistoryMessage = baseHistory.at(-1);
      const shouldAppendUser =
        appendUser ||
        lastHistoryMessage?.role !== "user" ||
        lastHistoryMessage.content !== trimmed;

      setError(null);
      setLastFailedPrompt(null);
      setInput("");
      stickToBottomRef.current = true;

      const userMsg: UiMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      const assistantId = `a-${Date.now()}`;
      const placeholder: UiMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        pending: true,
      };
      // Capture history at send time so the request reflects what the user
      // saw, not what's in state after the placeholder is appended.
      const history: ChatMessage[] = shouldAppendUser
        ? [...baseHistory, { role: "user", content: trimmed }]
        : baseHistory;
      setMessages((prev) =>
        shouldAppendUser ? [...prev, userMsg, placeholder] : [...prev, placeholder],
      );
      setBusy(true);

      track(appendUser ? "chat_message_sent" : "chat_retry_sent", {
        chars: trimmed.length,
        turn: history.length,
      });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-16) }),
          signal: controller.signal,
        });

        if (res.status === 429) {
          throw new Error(
            "That's a lot of questions fast — give it a minute and try again.",
          );
        }
        if (!res.ok || !res.body) {
          throw new Error("Something went wrong on my end. Try again?");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let sep: number;
          while ((sep = buf.indexOf("\n\n")) >= 0) {
            const frame = buf.slice(0, sep);
            buf = buf.slice(sep + 2);
            const line = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!line) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            let evt: ChatStreamEvent;
            try {
              evt = JSON.parse(payload) as ChatStreamEvent;
            } catch {
              continue;
            }
            if (evt.type === "text") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + evt.delta }
                    : m,
                ),
              );
            } else if (evt.type === "actions") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, actions: evt.items } : m,
                ),
              );
            } else if (evt.type === "followups") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, followups: evt.items } : m,
                ),
              );
            } else if (evt.type === "error") {
              throw new Error("That reply got cut off — mind trying again?");
            }
          }
        }
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") {
          // User-initiated stop: keep whatever text already streamed through.
          // If nothing arrived yet, drop the empty turn entirely rather than
          // leaving a stray "(stopped)" bubble behind.
          setMessages((prev) =>
            prev.flatMap((m) =>
              m.id !== assistantId
                ? [m]
                : m.content
                  ? [{ ...m, pending: false }]
                  : [],
            ),
          );
          return;
        }
        const msg = err instanceof Error ? err.message : "Unknown error.";
        setError(msg);
        setLastFailedPrompt(trimmed);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, pending: false } : m,
          ),
        );
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onInputKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const onSuggestion = (s: { id: string; prompt: string }) => {
    track("chat_suggestion_clicked", { prompt: s.id });
    void send(s.prompt);
  };

  const onFollowup = (question: string) => {
    track("chat_followup_clicked", { chars: question.length });
    void send(question);
  };

  const retryLast = () => {
    if (!lastFailedPrompt || busy) return;
    track("chat_retry_clicked", { chars: lastFailedPrompt.length });
    void send(lastFailedPrompt, { appendUser: false });
  };

  const onAction = (action: ChatAction) => {
    track("chat_action_clicked", {
      kind: action.kind,
      href:
        action.kind === "route" || action.kind === "link" ? action.href : "",
    });
    if (action.kind === "route") {
      router.push(action.href);
      onClose();
    } else if (action.kind === "link") {
      window.open(action.href, "_blank", "noopener,noreferrer");
    } else if (action.kind === "email") {
      const qs = action.subject
        ? `?subject=${encodeURIComponent(action.subject)}`
        : "";
      window.location.href = `mailto:${action.to}${qs}`;
    } else if (action.kind === "copy") {
      navigator.clipboard?.writeText(action.value).catch(() => {});
    }
  };

  const clear = () => {
    track("chat_cleared", { turns: messages.length });
    setMessages([]);
    setError(null);
    setLastFailedPrompt(null);
    stickToBottomRef.current = true;
  };

  const empty = messages.length === 0;
  const inputLen = input.length;
  const overLimit = inputLen > MAX_INPUT_LEN;
  const showCounter = inputLen > MAX_INPUT_LEN * 0.75;
  const streaming = busy;
  const placeholder = useRotatingPlaceholder(open && !busy && inputLen === 0);

  const headerSub = useMemo(
    () => (
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
        ask away
      </span>
    ),
    [],
  );

  // Pick the right entrance animation per viewport.
  const enterAnim = isMobile
    ? "vvr-chat-sheet-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both"
    : "vvr-chat-panel-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Vishnu"
      className="fixed inset-0 z-50 sm:inset-auto sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:right-[calc(1.25rem+env(safe-area-inset-right))] sm:flex sm:items-end sm:justify-end"
    >
      {/* Backdrop — mobile only. Tap to dismiss. */}
      <button
        type="button"
        aria-label="Dismiss chat backdrop"
        onClick={onClose}
        className={`absolute inset-0 bg-[color:rgba(6,6,7,0.55)] backdrop-blur-[2px] transition-opacity duration-200 sm:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          animation: open ? "vvr-chat-backdrop-in 200ms ease-out" : undefined,
        }}
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        className={`surface relative flex h-[100dvh] w-full flex-col overflow-hidden sm:h-[min(660px,calc(100dvh-2.5rem))] sm:w-[min(420px,calc(100vw-2.5rem))] sm:rounded-[16px] sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(245,180,84,0.04)] ${
          streaming ? "chat-streaming-edge" : ""
        }`}
        style={{
          animation: open
            ? enterAnim
            : isMobile
              ? `vvr-chat-sheet-in ${EXIT_MS}ms cubic-bezier(0.4, 0, 1, 1) reverse both`
              : `vvr-chat-panel-in ${EXIT_MS}ms cubic-bezier(0.4, 0, 1, 1) reverse both`,
          transformOrigin: isMobile ? "center bottom" : "bottom right",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:pt-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden
              className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-accent-dim)] bg-[var(--color-surface-inset)] text-[var(--color-accent)]"
            >
              <AvatarMark />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="flex items-center gap-1.5 font-mono text-[12px] font-medium text-[var(--color-text)]">
                chat with vishnu
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)] shadow-[0_0_6px_rgba(74,222,128,0.7)]"
                />
              </span>
              {headerSub}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-surface-inset)] hover:text-[var(--color-accent)]"
                aria-label="Start a new chat"
                title="Start a new chat"
              >
                <NewChatIcon />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-surface-inset)] hover:text-[var(--color-accent)]"
              aria-label="Close chat"
              title="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="chat-scroll flex-1 overflow-y-auto px-4 py-4"
          onScroll={updateScrollStickiness}
          aria-live="polite"
        >
          {empty ? (
            <EmptyState onPick={onSuggestion} />
          ) : (
            <ul className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onAction={onAction}
                  onFollowup={onFollowup}
                  // Follow-ups only hang off the latest assistant turn, and
                  // only once it's finished streaming — otherwise the panel
                  // fills with stale chips from earlier answers.
                  showFollowups={i === messages.length - 1 && !streaming}
                  // Stagger entry for any new messages — historical ones
                  // get zero delay because they appear instantly on open.
                  delayMs={m.historical ? 0 : Math.min(i * 20, 80)}
                />
              ))}
            </ul>
          )}
          {error && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-md border border-[var(--color-danger)]/30 bg-[var(--color-surface-inset)] px-3 py-2 font-mono text-[11px] text-[var(--color-danger)]"
              style={{ animation: "vvr-msg-in 220ms ease-out both" }}
            >
              <span aria-hidden className="mt-px">!</span>
              <span className="leading-relaxed">{error}</span>
              {lastFailedPrompt && (
                <button
                  type="button"
                  onClick={retryLast}
                  disabled={busy}
                  className="ml-auto shrink-0 rounded-[5px] border border-[var(--color-danger)]/35 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] transition-colors hover:bg-[var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={onSubmit}
          className="relative border-t border-[var(--color-border)] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:pb-3"
        >
          <div className="group relative flex items-end gap-2 rounded-[10px] border border-[var(--color-border-strong)] bg-[var(--color-surface-inset)] px-2 py-1.5 transition-colors focus-within:border-[var(--color-accent-dim)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              placeholder={busy ? "hang tight..." : placeholder}
              rows={1}
              maxLength={MAX_INPUT_LEN + 50}
              spellCheck
              className="!min-h-[2rem] !max-h-[7rem] !flex-1 !resize-none !border-0 !bg-transparent !px-1.5 !py-1 !text-[14px] !leading-relaxed !outline-none focus:!outline-none"
              style={{ boxShadow: "none" }}
              disabled={busy}
            />
            {streaming ? (
              <button
                type="button"
                onClick={stop}
                className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md border border-[var(--color-accent-dim)] bg-[var(--color-surface)] text-[var(--color-accent)] transition-all hover:bg-[var(--color-surface-2)] active:scale-95"
                aria-label="Stop reply"
                title="Stop"
              >
                <StopIcon />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || overLimit}
                className="send-btn inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md text-[var(--color-canvas)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:scale-[1.05] enabled:active:scale-95"
                aria-label="Send message"
                style={{
                  background:
                    "linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-soft) 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.18), 0 4px 14px -6px rgba(245,180,84,0.5)",
                }}
              >
                <SendIcon />
              </button>
            )}
          </div>
          {/* Counter stays hidden until you're close to the cap — an empty
              "0/500" is just noise. Surfaces in amber near the limit, red over. */}
          {showCounter && (
            <div className="mt-1.5 flex items-center justify-end px-1 font-mono text-[10px] text-[var(--color-text-subtle)]">
              {overLimit && (
                <span className="mr-auto text-[var(--color-danger)]">
                  trim message to send
                </span>
              )}
              <span
                className={`tabular transition-colors ${
                  overLimit
                    ? "text-[var(--color-danger)]"
                    : "text-[var(--color-accent)]"
                }`}
              >
                {inputLen}/{MAX_INPUT_LEN}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: Starter) => void }) {
  // Cumulative chip count before each group, so the entrance stagger keeps
  // flowing across group boundaries instead of resetting per group.
  const groupOffsets = STARTER_GROUPS.reduce<number[]>((acc, _g, idx) => {
    acc.push(idx === 0 ? 0 : acc[idx - 1] + STARTER_GROUPS[idx - 1].items.length);
    return acc;
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex flex-col gap-2.5"
        style={{ animation: "vvr-msg-in 320ms ease-out 60ms both" }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          <WaveHand />
          <span>hey there</span>
        </span>
        <p className="font-body text-[14.5px] leading-relaxed text-[var(--color-text)]">
          Ask about my projects, how I built them, or what I&apos;m up to now —
          pick a thread below, or just type.{" "}
          <span className="text-[var(--color-text-muted)]">
            I&apos;ll open the right pages whenever something&apos;s worth a
            look.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {STARTER_GROUPS.map((grp, gi) => (
          <div
            key={grp.group}
            className="flex flex-col gap-1.5"
            style={{
              animation: `vvr-msg-in 320ms ease-out ${140 + gi * 70}ms both`,
            }}
          >
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              ▸ {grp.group}
            </span>
            <div className="flex flex-col gap-1.5">
              {grp.items.map((s, ii) => {
                const delay = 200 + (groupOffsets[gi] + ii) * 55;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onPick(s)}
                    className="group flex items-center justify-between gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-inset)] px-3 py-2 text-left font-body text-[13px] text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-accent-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] active:scale-[0.99]"
                    style={{
                      animation: `vvr-chip-in 380ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
                    }}
                  >
                    <span>{s.label}</span>
                    <span
                      aria-hidden
                      className="font-mono text-[10px] text-[var(--color-text-subtle)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Little stroke-hand that waves once when the empty state mounts — a single
// beat of warmth, then it rests. Matches the site's line-icon language.
function WaveHand() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="inline-block origin-[60%_85%] [animation:vvr-wave_1.6s_ease-in-out_400ms_1]"
    >
      <path d="M18 11V6a2 2 0 0 0-4 0" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-7.4-5l-.7-1.8a2 2 0 1 1 3.6-1.7l.6 1.5" />
    </svg>
  );
}

function MessageBubble({
  message,
  onAction,
  onFollowup,
  showFollowups,
  delayMs,
}: {
  message: UiMessage;
  onAction: (a: ChatAction) => void;
  onFollowup: (q: string) => void;
  showFollowups: boolean;
  delayMs: number;
}) {
  const isUser = message.role === "user";
  return (
    <li
      className={`flex flex-col gap-1.5 ${
        isUser ? "items-end" : "items-start"
      }`}
      style={{
        animation: message.historical
          ? undefined
          : `vvr-msg-in 280ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms both`,
      }}
    >
      {!isUser && (
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-[var(--color-accent)]"
          />
          vishnu
        </span>
      )}
      <div
        className={`max-w-[88%] break-words rounded-[12px] px-3.5 py-2.5 font-body text-[14px] leading-relaxed ${
          isUser
            ? "border border-[var(--color-accent-dim)]/60 bg-[linear-gradient(180deg,rgba(245,180,84,0.08)_0%,rgba(245,180,84,0.02)_100%)] text-[var(--color-text)]"
            : "border border-[var(--color-border)] bg-[var(--color-surface-inset)] text-[var(--color-text)]"
        }`}
      >
        {message.content ? (
          <FormattedText
            text={message.content}
            caret={Boolean(message.pending)}
          />
        ) : message.pending ? (
          <TypingDots />
        ) : null}
      </div>
      {message.actions && message.actions.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 pt-0.5"
          style={{
            animation: "vvr-msg-in 280ms ease-out 80ms both",
          }}
        >
          {message.actions.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAction(a)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent-dim)] bg-[var(--color-surface-inset)] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-accent)] transition-all duration-200 hover:scale-[1.03] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] active:scale-95"
            >
              <span>{a.label}</span>
              <span
                aria-hidden
                className="text-[10px] opacity-70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
              >
                {a.kind === "route"
                  ? "→"
                  : a.kind === "link"
                    ? "↗"
                    : a.kind === "email"
                      ? "✉"
                      : "⧉"}
              </span>
            </button>
          ))}
        </div>
      )}
      {!isUser &&
        showFollowups &&
        message.followups &&
        message.followups.length > 0 && (
          <Followups items={message.followups} onPick={onFollowup} />
        )}
    </li>
  );
}

// Tappable "keep going" chips beneath the latest answer — the engine that
// turns one question into a conversation. Visually distinct from action pills
// (which leave the chat) so visitors read them as "ask this next".
function Followups({
  items,
  onPick,
}: {
  items: string[];
  onPick: (q: string) => void;
}) {
  return (
    <div className="mt-1.5 flex w-full flex-col gap-1.5 pt-1">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
        ▸ ask next
      </span>
      <div className="flex flex-col gap-1.5">
        {items.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(q)}
            className="group flex items-center gap-2 rounded-[9px] border border-[var(--color-border)] bg-[var(--color-surface-inset)]/60 px-2.5 py-1.5 text-left font-body text-[12.5px] leading-snug text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-accent-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] active:scale-[0.99]"
            style={{
              animation: `vvr-chip-in 360ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms both`,
            }}
          >
            <span
              aria-hidden
              className="font-mono text-[11px] text-[var(--color-text-subtle)] transition-colors duration-200 group-hover:text-[var(--color-accent)]"
            >
              ↳
            </span>
            <span className="flex-1">{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Renders the assistant's text with a small, safe Markdown subset:
// paragraphs, "- " bullet lists, **bold**, and `inline code`. Anything the
// model emits beyond that (links, headings, italics) falls through as plain
// text rather than raw artifacts — the system prompt steers it away from
// those. Streaming-safe: only closed **/` pairs render, so a half-typed
// token shows literally until it completes rather than swallowing text.
type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] };

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) {
      blocks.push({ kind: "p", text: para.join("\n") });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ kind: "ul", items: list });
      list = [];
    }
  };
  for (const line of text.split("\n")) {
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      flushPara();
      list.push(bullet[1]);
      continue;
    }
    flushList();
    if (line.trim() === "") {
      flushPara();
      continue;
    }
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*\n]+?\*\*|`[^`\n]+?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong
          key={`${keyPrefix}-${i}`}
          className="font-medium text-[var(--color-text)]"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={`${keyPrefix}-${i}`}
          className="rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-1 py-px font-mono text-[12px] text-[var(--color-accent)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function StreamCaret() {
  // The leading word-joiner (U+2060) glues the caret to the preceding word so
  // an inline-block box can't wrap onto its own line mid-stream — without it
  // the caret flickers down and back each time a token nudges the last word
  // against the wrap boundary.
  return (
    <>
      {"⁠"}
      <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-px bg-[var(--color-accent)] align-middle [animation:vvr-caret_1s_steps(2,end)_infinite]" />
    </>
  );
}

function FormattedText({ text, caret }: { text: string; caret?: boolean }) {
  const blocks = parseBlocks(text);
  const lastIdx = blocks.length - 1;
  return (
    <>
      {blocks.map((block, i) => {
        const isLast = i === lastIdx;
        if (block.kind === "ul") {
          const lastItem = block.items.length - 1;
          return (
            <ul key={i} className="my-1 flex flex-col gap-1 first:mt-0 last:mb-0">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]"
                  />
                  <span className="flex-1">
                    {renderInline(item, `${i}-${j}`)}
                    {caret && isLast && j === lastItem && <StreamCaret />}
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap [&:not(:first-child)]:mt-2">
            {renderInline(block.text, `${i}`)}
            {caret && isLast && <StreamCaret />}
          </p>
        );
      })}
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 text-[var(--color-text-subtle)]">
      <span className="h-1.5 w-1.5 rounded-full bg-current [animation:vvr-dot_1.2s_ease-in-out_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current [animation:vvr-dot_1.2s_ease-in-out_0.2s_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current [animation:vvr-dot_1.2s_ease-in-out_0.4s_infinite]" />
    </span>
  );
}

function NewChatIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5 8.3 8.3 0 0 1-3.7-.9L4 21l1.4-4.4A8.4 8.4 0 0 1 4 12a8.5 8.5 0 0 1 13.7-6.7" />
      <path d="M18 3v6" />
      <path d="M15 6h6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

function AvatarMark() {
  // Compact "V" monogram in mono — matches the site's lockup language.
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 5l8 14L20 5" />
    </svg>
  );
}
