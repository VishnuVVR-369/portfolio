import type { ReactNode } from "react";

type PillTone = "muted" | "signal" | "accent";

interface PillProps {
  tone?: PillTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
  as?: "span" | "a" | "button";
  href?: string;
  title?: string;
}

const toneClass: Record<PillTone, string> = {
  muted: "",
  signal: "pill-signal",
  accent: "pill-accent",
};

export function Pill({
  tone = "muted",
  dot = false,
  children,
  className = "",
  as = "span",
  href,
  title,
}: PillProps) {
  const merged = `pill ${toneClass[tone]} ${className}`.trim();
  const inner = (
    <>
      {dot && <span aria-hidden className="pill-dot" />}
      <span className="leading-none">{children}</span>
    </>
  );

  if (as === "a" && href) {
    return (
      <a href={href} title={title} className={merged}>
        {inner}
      </a>
    );
  }
  if (as === "button") {
    return (
      <button type="button" title={title} className={merged}>
        {inner}
      </button>
    );
  }
  return (
    <span title={title} className={merged}>
      {inner}
    </span>
  );
}
