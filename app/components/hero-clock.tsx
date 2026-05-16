"use client";

import { useNow } from "./use-now";

export function HeroClock() {
  const time = useNow();
  return (
    <span suppressHydrationWarning className="tabular-nums">
      {time || "··:·· ist"}
    </span>
  );
}
