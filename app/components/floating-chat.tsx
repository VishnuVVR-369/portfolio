"use client";

import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { track } from "@vercel/analytics";

const FloatingChatPanel = lazy(() =>
  import("./floating-chat-panel").then((mod) => ({
    default: mod.FloatingChatPanel,
  })),
);

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  // Holds the panel mounted briefly after `open` flips to false so the
  // exit animation can play before the tree unmounts.
  const [mounted, setMounted] = useState(false);
  // Delays the bubble's entrance one tick so it doesn't fight the page's
  // initial reveal — feels like a separate, polite arrival.
  const [bubbleReady, setBubbleReady] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const openFresh = useCallback(() => {
    setOpen(true);
    setMounted(true);
    track("chat_opened", { source: "bubble" });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setBubbleReady(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  // When the panel closes, hold the mount for the exit animation duration.
  useEffect(() => {
    if (open) return;
    if (!mounted) return;
    const t = window.setTimeout(() => setMounted(false), 220);
    return () => window.clearTimeout(t);
  }, [open, mounted]);

  // ESC closes the panel — keypress is captured in the panel itself when
  // focus is trapped, but a global handler covers the edge case of focus
  // briefly escaping the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={openFresh}
        aria-label="Ask Vishnu"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Ask Vishnu"
        className={`group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-accent)] transition-[opacity,transform,border-color,background-color] duration-300 ease-out will-change-transform hover:border-[var(--color-accent-dim)] hover:bg-[var(--color-surface-2)] hover:scale-[1.06] active:scale-95 ${
          open
            ? "opacity-0 pointer-events-none scale-75"
            : bubbleReady
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50 pointer-events-none"
        }`}
        style={{
          animation:
            bubbleReady && !open
              ? "vvr-bubble-in 480ms cubic-bezier(0.34, 1.56, 0.64, 1) both, vvr-bubble-breathe 4.5s ease-in-out 600ms infinite"
              : undefined,
          boxShadow:
            "0 8px 24px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Inner amber glow — strengthens on hover */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(245,180,84,0.22), transparent 70%)",
          }}
        />
        <ChatIcon />
        {/* Signal dot + concentric ping */}
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 items-center justify-center"
        >
          <span
            className="absolute inset-0 rounded-full bg-[var(--color-signal)]"
            style={{
              animation: "vvr-signal-ping 2.4s ease-out infinite",
            }}
          />
          <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-signal)] shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
        </span>
      </button>

      {mounted && (
        <Suspense fallback={null}>
          <FloatingChatPanel onClose={close} open={open} />
        </Suspense>
      )}
    </>
  );
}

function ChatIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="relative transition-transform duration-300 ease-out group-hover:rotate-[-6deg]"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
