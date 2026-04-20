import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "../components/reveal";
import { DiffRow } from "../components/diff";
import { CopyButton } from "../components/copy-button";

const EMAIL = "vishnuvardhanganji@gmail.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vishnuvardhan Reddy — software engineer at FactSet, building systems with explicit tradeoffs.",
};

const BELIEFS = [
  {
    add: "the tradeoff is the work",
    remove: "shipping == done",
  },
  {
    add: "boring tech where it counts",
    remove: "framework-of-the-month",
  },
  {
    add: "type the system, not the code",
    remove: "ts as decoration",
  },
  {
    add: "small interfaces, deep modules",
    remove: "wide apis, fragile boundaries",
  },
  {
    add: "name what you don't know",
    remove: "confident-sounding ignorance",
  },
  {
    add: "the prod incident is the curriculum",
    remove: "blameless without learning",
  },
];

const JOURNEY = [
  {
    period: "2023",
    label: "intern → engineer i",
    note:
      "Joined FactSet as an intern. Found that I cared less about being right than about being honest about what I didn't know yet. Converted to full-time within six months.",
  },
  {
    period: "2024",
    label: "engineer i → engineer ii",
    note:
      "Took ownership of a critical pipeline. Cut a recurring on-call page by chasing the actual root cause instead of papering it over. Learned that the boring fix is usually the right one.",
  },
  {
    period: "2025",
    label: "ships side projects",
    note:
      "Built Chat with PDF and VoiceFlow on weekends — both shipped to real users. Side projects are where I test the version of myself I want at work.",
  },
  {
    period: "2026",
    label: "engineer ii → engineer iii",
    note:
      "Promoted to SWE III. Started leading architecture conversations rather than just executing on them. Mentoring engineers who joined after me.",
  },
];

const NOT_LOOKING_FOR = [
  ""
];

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero: portrait + intro ─────────────────────────────── */}
      <section
        data-source="app/about/page.tsx › Hero"
        className="container-page pt-20 pb-16 md:pt-32 md:pb-20"
      >
        <div className="grid gap-8 md:grid-cols-[16rem_1fr] md:gap-14">
          {/* Portrait placeholder. Swap for the real photo when ready. */}
          <Reveal>
            <figure className="flex max-w-[10rem] flex-col gap-3 sm:max-w-[12rem] md:max-w-none">
              <div
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-strong)] bg-[var(--color-surface-inset)]"
                aria-label="Portrait placeholder"
              >
                <Image
                  src="/image.png"
                  alt="Vishnuvardhan Reddy"
                  fill
                  sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, 16rem"
                  loading="eager"
                  className="object-cover"
                />
                {/* <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-[3.5rem] font-medium leading-none tracking-tight text-[var(--color-text-muted)] md:text-[6rem]">
                    vvr
                  </span>
                </div> */}
                {/* <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-canvas)]/60 via-transparent to-transparent" /> */}
                {/* <span className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)]">
                  portrait · placeholder
                </span> */}
              </div>
              <figcaption className="font-mono text-[10px] text-[var(--color-text-subtle)] md:text-[11px]">
                bangalore · ist
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                /about
              </p>
              <h1 className="mt-4 font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.025em] text-[var(--color-text)] sm:text-5xl md:text-6xl">
                Hi, I&apos;m Vishnu.
              </h1>
              <div className="mt-7 max-w-xl space-y-5 text-pretty text-[var(--color-text-muted)] md:text-lg md:leading-relaxed">
                <p>
                  I&apos;m a software engineer at FactSet, where I work on
                  data-intensive systems that financial professionals lean on
                  to do their actual jobs. The work pays the rent. The
                  obsession is the part that doesn&apos;t — building things,
                  breaking them on purpose, and figuring out what&apos;s
                  really load-bearing about a design.
                </p>
                <p>
                  I think a lot about <em className="not-italic text-[var(--color-text)]">judgment</em>
                  — the unglamorous part of engineering that doesn&apos;t fit
                  on a resume. Most decisions in software have a defensible
                  version and a careless version. The career is the practice
                  of choosing the first one when nobody&apos;s looking.
                </p>
                <p>
                  Outside of code: long walks, slow reading, the kind of
                  coffee that takes too long to make. In another life, I
                  would have taught — and I think the best engineers
                  secretly do.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-3 font-mono text-[13px] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-text)] sm:py-2.5"
                >
                  reach out →
                </Link>
                <a
                  // TODO(vishnu): drop your resume PDF in /public and update this href.
                  href="/resume.pdf"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--color-border-strong)] px-4 py-3 font-mono text-[13px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] sm:py-2.5"
                >
                  download resume (pdf)
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="border-t border-[var(--color-border)]" />

      {/* ─── Beliefs (diff pairs) ───────────────────────────────── */}
      <section
        data-source="app/about/page.tsx › Beliefs"
        className="container-page py-20 md:py-28"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §01 · what i believe
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
            The short version of
            <br />
            <span className="text-[var(--color-accent)]">how I read code.</span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-12 grid gap-x-12 gap-y-7 md:grid-cols-2">
            {BELIEFS.map((b, i) => (
              <div key={i} className="space-y-1.5">
                <DiffRow type="add">
                  <span>{b.add}</span>
                </DiffRow>
                <DiffRow type="remove">
                  <span>{b.remove}</span>
                </DiffRow>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="border-t border-[var(--color-border)]" />

      {/* ─── Practice (algorithms, daily) ───────────────────────── */}
      <section
        data-source="app/about/page.tsx › Practice"
        className="container-page py-20 md:py-28"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §02 · the practice
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
            The obsession,
            <br />
            <span className="text-[var(--color-accent)]">in numbers.</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-6 max-w-2xl text-pretty text-[var(--color-text-muted)] md:text-lg md:leading-relaxed">
            Daily reps. For a year. Unbroken. Algorithms aren&apos;t the work
            — but a year of uninterrupted daily practice is the kind of
            evidence I can&apos;t fake, and it shows up in the work that is.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
              <div className="font-display text-5xl font-medium tracking-tight text-[var(--color-accent)] md:text-6xl">
                365
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                days of consecutive practice
              </div>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
              <div className="font-display text-5xl font-medium tracking-tight text-[var(--color-accent)] md:text-6xl">
                guardian
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                top 1% · 2150+ contest rating
              </div>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
              <div className="font-display text-5xl font-medium tracking-tight text-[var(--color-accent)] md:text-6xl">
                1,200+
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                problems solved across difficulties
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              last verified · apr 2026
            </span>
            <a
              href="https://leetcode.com/u/vishnuvardhanganji"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--color-border-strong)] px-4 py-3 font-mono text-[13px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] sm:py-2.5"
            >
              verify on leetcode →
            </a>
          </div>
        </Reveal>
      </section>

      <div className="border-t border-[var(--color-border)]" />

      {/* ─── Journey ────────────────────────────────────────────── */}
      <section
        data-source="app/about/page.tsx › Journey"
        className="container-page py-20 md:py-28"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §03 · the path
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
            Three years, four titles,
            <br />
            <span className="text-[var(--color-text-muted)]">
              one practice.
            </span>
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {JOURNEY.map((j, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="grid gap-3 py-7 md:grid-cols-[6rem_18rem_1fr] md:gap-8">
                <div className="font-mono text-[12px] uppercase tracking-wider text-[var(--color-text-subtle)]">
                  {j.period}
                </div>
                <div className="font-display text-lg font-medium text-[var(--color-text)]">
                  {j.label}
                </div>
                <p className="text-pretty text-[var(--color-text-muted)]">
                  {j.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The journey-anchoring quote */}
        <Reveal delay={120}>
          <figure className="mx-auto mt-16 max-w-2xl text-center">
            <div className="mx-auto mb-6 h-px w-12 bg-[var(--color-accent-dim)]" />
            <blockquote className="font-display text-2xl font-medium leading-[1.2] tracking-tight text-[var(--color-text)] md:text-4xl">
              <span className="text-[var(--color-accent)]">&ldquo;</span>
              The best way to learn is to build, break, and rebuild.
              <span className="text-[var(--color-accent)]">&rdquo;</span>
            </blockquote>
            <figcaption className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              — the only career advice that aged well
            </figcaption>
          </figure>
        </Reveal>
      </section>

      <div className="border-t border-[var(--color-border)]" />

      {/* ─── Filter / Not looking for ───────────────────────────── */}
      <section
        data-source="app/about/page.tsx › Filter"
        className="container-page py-20 md:py-28"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §04 · the bar
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
            What I&apos;m looking for.
            <br />
            <span className="text-[var(--color-text-muted)]">
              And what I&apos;m not.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                open to
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "software engineering roles at product based companies",
                  "senior IC roles at AI-first companies",
                  "infra / devtools companies",
                  "early-stage startups (series A–B) building real systems",
                  "remote-first or bay area teams",
                ].map((line) => (
                  <li key={line}>
                    <DiffRow type="add">
                      <span>{line}</span>
                    </DiffRow>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                not looking for
              </p>
              <ul className="mt-5 space-y-2.5">
                {NOT_LOOKING_FOR.map((line) => (
                  <li key={line}>
                    <DiffRow type="remove">
                      <span>{line}</span>
                    </DiffRow>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-14 grid gap-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-9">
            <div>
              <p className="font-display text-xl font-medium text-[var(--color-text)] md:text-2xl">
                Cleared the bar?
              </p>
              <p className="mt-2 text-[var(--color-text-muted)]">
                Short emails get short replies. Use the form for context, or
                copy the address and write me directly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <CopyButton value={EMAIL} />
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-3 font-mono text-[13px] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-text)] sm:py-2.5"
              >
                contact form →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
