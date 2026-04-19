"use client";

import { useEffect, useState } from "react";

// Tiny live clock for the hero status panel. IST (the user's locale).
// Re-renders every minute — enough granularity for a portfolio.
export function HeroClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()) + " ist"
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span suppressHydrationWarning className="tabular-nums">
      {time || "··:·· ist"}
    </span>
  );
}
