import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { routeMetadata } from "@/lib/seo";
import {
  COMPANY,
  EMAIL,
  LEETCODE_PROBLEMS,
  LEETCODE_RATING,
  LEETCODE_STREAK,
  LEETCODE_TIER,
  LEETCODE_URL,
  LOCATION,
  NAME,
  NAME_SHORT,
  ROLE_NOW,
} from "@/lib/identity";
import { Reveal } from "../components/reveal";
import { DiffRow } from "../components/diff";
import { CopyButton } from "../components/copy-button";
import { ResumeButton } from "../components/resume-button";
import { StackGrid } from "../components/stack-grid";
import { GuardianBadge } from "../components/guardian-badge";

export const metadata: Metadata = routeMetadata({
  title: "About",
  description:
    "About Vishnuvardhan Reddy, a software engineer at FactSet building data-intensive systems, AI products, and shipping side projects to real users.",
  path: "/about",
});

// Compressed beliefs — single calmer paragraph in the bio, then a
// short list of opinionated diff pairs. Reduced from 6 to 4 pairs;
// retired the most polemic ones ("'we'll fix it later'", "silent
// compromises") in favor of judgment-flavor ones that read as
// thinking, not posturing.
const BELIEFS = [
  { add: "name the tradeoff out loud", remove: "silent compromises" },
  { add: "boring tech where it counts", remove: "framework-of-the-month" },
  { add: "small interfaces, deep modules", remove: "wide apis, fragile boundaries" },
  { add: "the prod incident is the curriculum", remove: "blameless without learning" },
];

const JOURNEY = [
  {
    period: "2023",
    label: "intern → engineer i",
    note:
      "Joined FactSet as an intern. Cared less about being right than about being honest about what I didn't know yet. Converted to full-time within six months.",
  },
  {
    period: "2024",
    label: "engineer i → engineer ii",
    note:
      "Took ownership of a critical pipeline. Cut a recurring on-call page by chasing the actual root cause instead of papering it over. Learned that the boring fix is usually the right one.",
  },
  {
    period: "2026",
    label: "engineer ii → engineer iii",
    note:
      "Promoted. Starting to lead architecture conversations rather than just executing on them. Mentoring engineers who joined after me.",
  },
];

const OPEN_TO = [
  "software engineering at product-based companies",
  "senior IC roles at AI-first companies",
  "infra / devtools companies",
  "early-stage startups (series A–B) building real systems",
  "remote-first or bay area teams",
];

export default function AboutPage() {
  return (
    <>
      {/* ═══ HERO: portrait + intro + Tier-S quick credentials ════════ */}
      <section className="relative border-b border-[var(--color-border)] pt-12 pb-16 md:pt-20 md:pb-20">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <div className="grid gap-8 md:grid-cols-[14rem_1fr] md:gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <Reveal>
              <figure className="flex max-w-[10rem] flex-col gap-3 sm:max-w-[12rem] md:max-w-none">
                <div
                  className="surface lit-edge relative aspect-[4/5] w-full overflow-hidden"
                  aria-label="Portrait"
                >
                  <Image
                    src="/image.png"
                    alt={`${NAME} portrait`}
                    fill
                    sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, 16rem"
                    loading="eager"
                    className="object-cover"
                  />
                  {/* Bottom corner badge — instrument-bureau detail */}
                  <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)] mix-blend-difference">
                    /portrait
                  </span>
                </div>
                <figcaption className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
                  {LOCATION.toLowerCase()} · ist
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={80}>
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  /about
                </p>
                <h1 className="mt-3 font-display text-[2.4rem] font-medium leading-[1.02] tracking-[-0.03em] text-[var(--color-text)] sm:text-[3rem] md:text-[3.5rem]">
                  Hi, I&apos;m {NAME_SHORT}.
                </h1>

                {/* Inline credentials strip */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="pill pill-signal">
                    <span aria-hidden className="pill-dot" />
                    <span>available for inbound</span>
                  </span>
                  <GuardianBadge variant="full" />
                </div>

                <div className="mt-7 max-w-xl space-y-4 text-pretty text-[var(--color-text-muted)] md:text-[1.05rem] md:leading-relaxed">
                  <p>
                    {ROLE_NOW} at {COMPANY}, working on data-intensive systems
                    financial professionals lean on to do their actual jobs.
                    Three years in: intern to {ROLE_NOW.split(" ").pop()}, each
                    rung earned, not gifted. The work pays the rent. The
                    obsession — the version that gets shipped on weekends — is
                    the part that doesn&apos;t.
                  </p>
                  <p>
                    I build the version of the system I can still defend a
                    year later, when the constraints have changed and the
                    alternative looks tempting. The unglamorous part of
                    engineering, judgment, doesn&apos;t fit on a resume but it
                    decides everything that does.
                  </p>
                  <p>
                    Outside of code: long walks, slow reading, coffee that
                    takes too long to make. In another life I&apos;d have
                    taught, and I think the best engineers secretly do.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
                  <Link
                    href="/contact"
                    className="cta-accent min-h-[44px] px-5 text-[13px]"
                  >
                    <span>reach out</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <ResumeButton
                    variant="ghost"
                    size="md"
                    className="!min-h-[44px]"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ §01 STACK ═════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              §01 · the stack
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.5rem]">
              Tools I reach for —
              <br />
              <span className="text-[var(--color-text-muted)]">
                and the opinion behind each.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-2xl text-[var(--color-text-muted)] md:text-[1.05rem] md:leading-relaxed">
              Amber-bordered chips are tools I use daily. The rest are tools
              I&apos;ve shipped real work with — not ones I&apos;ve heard of.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-10">
              <StackGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ §02 PRACTICE (LeetCode) ═══════════════════════════════════ */}
      <section className="relative border-t border-[var(--color-border)] py-16 md:py-24">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  §02 · the practice
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.5rem]">
                  The obsession,
                  <br />
                  <span className="text-[var(--color-accent)]">
                    in numbers.
                  </span>
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-md text-pretty text-[var(--color-text-muted)] md:text-[1.05rem] md:leading-relaxed">
                  Daily reps. For a year. Unbroken. Algorithms aren&apos;t the
                  work — but a year of uninterrupted daily practice is the
                  kind of evidence I can&apos;t fake. It shows up in the work
                  that is.
                </p>
              </Reveal>
            </div>

            <Reveal delay={180}>
              <div className="grid gap-3 sm:grid-cols-3">
                <PracticeStat
                  metric={String(LEETCODE_STREAK)}
                  label="days consecutive"
                />
                <PracticeStat
                  metric={LEETCODE_TIER.toLowerCase()}
                  label={`top 1% · ${LEETCODE_RATING}`}
                  accent
                />
                <PracticeStat
                  metric={LEETCODE_PROBLEMS}
                  label="problems solved"
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  last verified · {new Date().toISOString().slice(0, 7)}
                </span>
                <a
                  href={LEETCODE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-ghost min-h-[40px] px-4"
                >
                  <span>verify on leetcode</span>
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ §03 BELIEFS ═══════════════════════════════════════════════ */}
      <section className="relative border-t border-[var(--color-border)] py-16 md:py-24">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              §03 · how i read code
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.5rem]">
              A short list of
              <br />
              <span className="text-[var(--color-accent)]">
                load-bearing beliefs.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 grid gap-x-12 gap-y-6 md:grid-cols-2">
              {BELIEFS.map((b, i) => (
                <div
                  key={i}
                  className="surface-recess space-y-1.5 p-4 md:p-5"
                >
                  <DiffRow type="add">{b.add}</DiffRow>
                  <DiffRow type="remove">{b.remove}</DiffRow>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ §04 JOURNEY ═══════════════════════════════════════════════ */}
      <section className="relative border-t border-[var(--color-border)] py-16 md:py-24">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              §04 · the path
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.5rem]">
              Three years, four titles,
              <br />
              <span className="text-[var(--color-text-muted)]">
                one practice.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="surface mt-10 overflow-hidden">
              <ol className="divide-y divide-[var(--color-border)]">
                {JOURNEY.map((j) => (
                  <li
                    key={j.period}
                    className="grid gap-1 px-5 py-5 sm:grid-cols-[5rem_15rem_1fr] sm:items-baseline sm:gap-8 md:px-7 md:py-6"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                      {j.period}
                    </div>
                    <div className="font-display text-[1.05rem] font-medium tracking-tight text-[var(--color-text)]">
                      {j.label}
                    </div>
                    <p className="text-pretty text-[14px] leading-relaxed text-[var(--color-text-muted)]">
                      {j.note}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ §05 OPEN TO + CONTACT ═══════════════════════════════════════ */}
      <section className="relative border-t border-[var(--color-border)] py-16 md:py-24">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  §05 · open to
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.5rem]">
                  What I&apos;m
                  <br />
                  <span className="text-[var(--color-text-muted)]">
                    looking for.
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={140}>
                <ul className="surface-recess mt-7 space-y-2 p-4 md:p-5">
                  {OPEN_TO.map((line) => (
                    <li key={line}>
                      <DiffRow type="add">{line}</DiffRow>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={180}>
              <div className="surface lit-edge relative flex flex-col gap-5 overflow-hidden p-6 md:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  contact
                </p>
                <h3 className="font-display text-[1.5rem] font-medium leading-tight tracking-tight text-[var(--color-text)] md:text-[1.75rem]">
                  Short emails get short replies fast.
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  Best way to reach me — email gets a reply within a day. Use
                  the form for a longer pitch.
                </p>
                <div className="mt-1">
                  <CopyButton value={EMAIL} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="cta-accent min-h-[44px] px-5 text-[13px]"
                  >
                    <span>open contact form</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <ResumeButton
                    variant="ghost"
                    size="md"
                    className="!min-h-[44px]"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function PracticeStat({
  metric,
  label,
  accent = false,
}: {
  metric: string;
  label: string;
  accent?: boolean;
}) {
  const isLongMetric = metric.length > 7;

  return (
    <div
      className={`surface flex flex-col gap-3 p-5 md:p-6 ${
        accent ? "lit-edge relative overflow-hidden" : ""
      }`}
    >
      <div
        className={`font-display font-medium leading-none ${
          isLongMetric
            ? "text-[1.85rem] tracking-[-0.04em] md:text-[2.4rem]"
            : "text-[2.25rem] tracking-tight md:text-[3rem]"
        } ${
          accent ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
        }`}
      >
        {metric}
      </div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
        {label}
      </div>
    </div>
  );
}
