import Link from "next/link";
import {
  COMPANY,
  LEETCODE_PROBLEMS,
  LEETCODE_RATING,
  LEETCODE_STREAK,
  LEETCODE_TIER,
  LEETCODE_URL,
  PRODUCT_CHATWITHPDF_URL,
  PRODUCT_CHATWITHPDF_USERS,
  ROLE_NOW,
  TENURE_LINE,
} from "@/lib/identity";

// Hero status panel — the right-aside counterweight to the big type.
// Five readouts that collectively encode the Tier S signals in 200px:
//   role / tenure / live · A / live · B / leetcode
//
// Built like an instrument cluster — labels in mono, values in display,
// amber accents on the highest-signal cells. Hidden on mobile (the
// info is in the eyebrow + bio).
export function HeroProofCard() {
  return (
    <aside
      aria-label="At-a-glance status"
      className="surface lit-edge relative hidden min-w-0 overflow-hidden p-5 lg:block"
    >
      {/* Bezel header */}
      <div className="-mx-5 -mt-5 mb-4 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-canvas-deep)] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
            style={{ boxShadow: "0 0 6px rgba(74,222,128,0.55)" }}
          />
          status
        </span>
        <span className="text-[var(--color-accent)]">live</span>
      </div>

      <dl className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-2.5 font-mono text-[12px]">
        <dt className="text-[var(--color-text-subtle)]">role</dt>
        <dd className="text-[var(--color-text)]">
          {ROLE_NOW} · {COMPANY}
        </dd>

        <dt className="text-[var(--color-text-subtle)]">tenure</dt>
        <dd className="text-[var(--color-text)]">{TENURE_LINE}</dd>

        <dt className="text-[var(--color-text-subtle)]">shipped</dt>
        <dd className="text-[var(--color-text)]">
          <a
            href={PRODUCT_CHATWITHPDF_URL}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            chatwithpdf.pro
          </a>{" "}
          <span className="text-[var(--color-text-subtle)]">
            · {PRODUCT_CHATWITHPDF_USERS}
          </span>
        </dd>

        <dt className="text-[var(--color-text-subtle)]">·</dt>
        <dd className="text-[var(--color-text)]">
          voiceflow{" "}
          <span className="text-[var(--color-text-subtle)]">· 3 platforms</span>
        </dd>

        <dt className="text-[var(--color-accent)]">solved</dt>
        <dd>
          <Link
            href={LEETCODE_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex flex-col gap-0.5"
          >
            <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
              leetcode {LEETCODE_TIER.toLowerCase()} ·{" "}
              <span className="tabular">{LEETCODE_RATING}</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--color-text-subtle)]">
              {LEETCODE_STREAK}-day streak · {LEETCODE_PROBLEMS} problems
            </span>
          </Link>
        </dd>
      </dl>

      {/* Foot strip — version marker */}
      <div className="-mx-5 -mb-5 mt-5 flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-canvas-deep)] px-5 py-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
        <span>v2.0 · 2026</span>
        <span className="text-[var(--color-accent-dim)]">hyderabad / ist</span>
      </div>
    </aside>
  );
}
