"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({
  value,
  label,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard API blocked — fall through silently
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={value}
      className={`group inline-flex max-w-full items-center gap-2 overflow-hidden font-mono text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] ${className}`}
      aria-label={`Copy ${label ?? value}`}
    >
      <span className="min-w-0 truncate">{label ?? value}</span>
      <span
        aria-hidden
        className={`inline-flex h-5 flex-shrink-0 items-center rounded border px-1.5 text-[10px] uppercase tracking-wider transition-all ${
          copied
            ? "border-[var(--color-signal)] text-[var(--color-signal)]"
            : "border-[var(--color-border-strong)] text-[var(--color-text-subtle)] group-hover:border-[var(--color-accent-dim)] group-hover:text-[var(--color-accent)]"
        }`}
      >
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
