"use client";

import { useSyncExternalStore } from "react";

// Detects whether the current platform uses the Command key (macOS/iOS) or the
// Control key (Windows/Linux/everything else), so keyboard-shortcut labels read
// correctly per-OS. The actual handlers already accept both metaKey and ctrlKey
// (see command-palette.tsx) — this only fixes the *displayed* hint.
//
// Modeled on use-now.ts: useSyncExternalStore gives us a server snapshot ("⌘",
// so SSR markup stays stable) that reconciles to the real client value on
// hydration, without a setState-in-effect.

let cached: string | null = null;

function detect(): string {
  if (cached !== null) return cached;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent ||
    "";
  cached = /mac|iphone|ipad|ipod/i.test(platform) ? "⌘" : "Ctrl";
  return cached;
}

// The value never changes after load, so there is nothing to subscribe to.
function subscribe(): () => void {
  return () => {};
}

export function useModKey(): string {
  return useSyncExternalStore(subscribe, detect, () => "⌘");
}

// Renders the platform-appropriate modifier label as text, so it can be dropped
// into otherwise-server components (the "use client" boundary lives here).
export function ModKey() {
  return <>{useModKey()}</>;
}
