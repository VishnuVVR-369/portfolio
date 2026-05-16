import { LEETCODE_URL, LEETCODE_RATING } from "@/lib/identity";
import { LeetCodeIcon } from "./social-icons";

interface GuardianBadgeProps {
  variant?: "full" | "compact";
  className?: string;
}

// Instrument-readout badge for the LeetCode Guardian claim.
// Three regions:
//   [ label ]  ▌▌▌▌▌▌▌▌▌▌▒▒  [ rating ]
// The 10-cell tick visualization shows position in the rating distribution
// (Guardian = top ~1% by rating, so 9 of 10 cells filled).
//
// `full` includes label + ticks + rating; `compact` drops the ticks for
// tight header layouts.
export function GuardianBadge({
  variant = "full",
  className = "",
}: GuardianBadgeProps) {
  const filled = 9;
  return (
    <a
      href={LEETCODE_URL}
      target="_blank"
      rel="noreferrer"
      title="LeetCode Guardian — top 1% by contest rating. Opens leetcode.com profile."
      className={`group inline-flex h-[26px] items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] pr-2 pl-1.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] ${className}`}
      style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)" }}
    >
      {/* LeetCode mark chip */}
      <span
        aria-hidden
        className="inline-flex h-[18px] w-[22px] items-center justify-center rounded-[3px] border border-[var(--color-accent-dim)] bg-[var(--color-canvas-deep)] text-[var(--color-accent)]"
      >
        <LeetCodeIcon size={14} />
      </span>
      <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
        guardian
      </span>

      {variant === "full" && (
        <span
          aria-hidden
          className="flex items-center gap-[1.5px]"
          title={`top ${10 - filled}0% rating tier`}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`inline-block h-[8px] w-[2px] rounded-[1px] ${
                i < filled
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--color-border-strong)]"
              }`}
            />
          ))}
        </span>
      )}

      <span className="tabular text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
        {LEETCODE_RATING}
      </span>
    </a>
  );
}
