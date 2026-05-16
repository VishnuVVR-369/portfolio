import type { Metadata } from "next";
import Link from "next/link";
import { featuredProjects } from "@/lib/projects";
import {
  COMPANY,
  HERO_PROOF,
  HERO_SUBPROOF,
  LEETCODE_PROBLEMS,
  LEETCODE_RATING,
  LEETCODE_STREAK,
  LEETCODE_TIER,
  LEETCODE_URL,
  LOCATION,
  NAME,
  ROLE_NOW,
  ROLE_TAGLINE,
} from "@/lib/identity";
import {
  DEFAULT_DESCRIPTION,
  JsonLd,
  personJsonLd,
  routeMetadata,
  websiteJsonLd,
} from "@/lib/seo";
import { Reveal } from "./components/reveal";
import { HeroClock } from "./components/hero-clock";
import { GuardianBadge } from "./components/guardian-badge";
import { ResumeButton } from "./components/resume-button";
import { HeroProofCard } from "./components/hero-proof-card";
import { FeaturedProjectCard } from "./components/featured-project-card";
import { CopyButton } from "./components/copy-button";
import { LeetCodeIcon } from "./components/social-icons";

export const metadata: Metadata = routeMetadata({
  title: `${NAME} — ${ROLE_NOW}`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

const TIMELINE = [
  {
    period: "apr 2026 — present",
    title: "swe iii",
    company: "factset",
    note:
      "Starting to lead architecture conversations on data-intensive pipeline components. Mentoring engineers who joined after me.",
  },
  {
    period: "aug 2024 — apr 2026",
    title: "swe ii",
    company: "factset",
    note:
      "Owned and scaled critical pipeline components. Made the system-design calls that improved throughput and cut on-call pages.",
  },
  {
    period: "jun 2023 — aug 2024",
    title: "swe i",
    company: "factset",
    note:
      "Shipped production features across the core platform. Developed deep expertise in financial-data systems and API design.",
  },
  {
    period: "jan 2023 — jun 2023",
    title: "intern",
    company: "factset",
    note:
      "Delivered production-ready features within the first month. Converted to full-time.",
  },
];

export default function Home() {
  const projects = featuredProjects();
  // Pair each featured project with the visualization variant that
  // best matches its data shape (pipeline-flow vs. input/process/output).
  const featuredPairs = projects.map((p, i) => ({
    project: p,
    variant: (i === 0 ? "pipeline" : "rack") as "pipeline" | "rack",
  }));

  return (
    <>
      <JsonLd data={[personJsonLd(), websiteJsonLd()]} />

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-12 pb-10 md:pt-20 md:pb-28">
        {/* Atmospheric sweep — single ambient motion above the fold */}
        <div className="sweep" aria-hidden />

        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          {/* Eyebrow — status pills */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              <span className="inline-flex items-center gap-2 text-[var(--color-signal)]">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
                  style={{ boxShadow: "0 0 6px rgba(74,222,128,0.6)" }}
                />
                available for inbound
              </span>
              <span aria-hidden className="text-[var(--color-text-subtle)]">
                ·
              </span>
              <span>{LOCATION.toLowerCase()}</span>
              <span aria-hidden className="text-[var(--color-text-subtle)]">
                ·
              </span>
              <HeroClock />
              {/* Guardian badge mirrors the header — visible on mobile too */}
              <span className="ml-auto md:hidden">
                <GuardianBadge variant="compact" />
              </span>
            </div>
          </Reveal>

          {/* Title + status panel grid */}
          <div className="mt-9 grid gap-x-12 gap-y-10 md:mt-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div>
              {/* NAME — the first specific signal a skimmer hits */}
              <Reveal delay={40}>
                <h1 className="font-display text-[2.4rem] font-medium leading-[0.98] tracking-[-0.035em] text-[var(--color-text)] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem]">
                  {NAME}
                  <span className="text-[var(--color-accent)]">.</span>
                </h1>
              </Reveal>

              {/* TAGLINE — concrete, not abstract */}
              <Reveal delay={100}>
                <p className="mt-5 max-w-xl text-pretty font-display text-[1.1rem] font-medium tracking-[-0.01em] text-[var(--color-text-muted)] sm:text-[1.25rem] md:text-[1.4rem] md:leading-snug">
                  {ROLE_TAGLINE}
                </p>
              </Reveal>

              {/* PROOF — promotion velocity stated as fact */}
              <Reveal delay={160}>
                <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 text-[var(--color-text-muted)] sm:gap-x-5">
                  <dt className="font-mono text-[13px] text-[var(--color-text-subtle)]">
                    now ›
                  </dt>
                  <dd className="space-y-1">
                    <p>
                      <span className="text-[var(--color-text)]">
                        {ROLE_NOW}
                      </span>{" "}
                      <span className="text-[var(--color-text-subtle)]">
                        at
                      </span>{" "}
                      <span className="text-[var(--color-text)]">
                        {COMPANY}
                      </span>
                    </p>
                    <p>
                      <span className="text-[var(--color-text-subtle)]">
                        intern → swe III in
                      </span>{" "}
                      <span className="text-[var(--color-text)]">3 years</span>
                      <span className="text-[var(--color-text-subtle)]">.</span>
                    </p>
                  </dd>

                  <dt className="font-mono text-[13px] text-[var(--color-text-subtle)]">
                    live ›
                  </dt>
                  <dd className="space-y-1">
                    <p>
                      <a
                        href="https://chatwithpdf.pro"
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        chatwithpdf.pro
                      </a>{" "}
                      <span className="text-[var(--color-text-subtle)]">·</span>{" "}
                      <span className="text-[var(--color-text)]">
                        100+ users
                      </span>
                    </p>
                    <p>
                      <Link href="/projects/voiceflow" className="link">
                        voiceflow
                      </Link>{" "}
                      <span className="text-[var(--color-text-subtle)]">·</span>{" "}
                      <span className="text-[var(--color-text)]">
                        3 platforms
                      </span>
                    </p>
                  </dd>

                  <dd className="sr-only col-span-2">{HERO_SUBPROOF}</dd>
                </dl>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={220}>
                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
                  <Link
                    href="/projects"
                    className="cta-accent min-h-[44px] px-5 text-[13px]"
                  >
                    <span>view projects</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <ResumeButton
                    variant="ghost"
                    size="md"
                    label="resume"
                    className="!min-h-[44px]"
                  />
                  <Link
                    href="/about"
                    className="hidden font-mono text-[12px] text-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline sm:inline"
                  >
                    more about me →
                  </Link>
                  <span className="ml-auto hidden font-mono text-[11px] text-[var(--color-text-subtle)] sm:inline">
                    or press{" "}
                    <span className="kbd" style={{ minWidth: "auto" }}>
                      ⌘
                    </span>{" "}
                    <span className="kbd" style={{ minWidth: "auto" }}>
                      k
                    </span>
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right column — proof card */}
            <Reveal delay={280}>
              <HeroProofCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED WORK ══════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  §01 · selected work
                </p>
                <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.75rem]">
                  Two products live.
                  <br />
                  <span className="text-[var(--color-text-muted)]">
                    Both with real users.
                  </span>
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden font-mono text-[12px] text-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline md:inline"
              >
                full case studies →
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
            {featuredPairs.map(({ project, variant }, i) => (
              <Reveal key={project.slug} delay={120 + i * 80}>
                <FeaturedProjectCard
                  project={project}
                  visualVariant={variant}
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={300} className="md:hidden">
            <div className="mt-8 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-mono text-[12px] text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
              >
                full case studies →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ABOUT-STRIP ═══════════════════════════════════════════════ */}
      <section className="relative border-t border-[var(--color-border)] py-20 md:py-28">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            {/* Left — quick bio */}
            <div>
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  §02 · who
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.5rem]">
                  Three years in,
                  <br />
                  still curious.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <div className="mt-5 max-w-lg space-y-4 text-pretty text-[var(--color-text-muted)] md:text-[1.05rem] md:leading-relaxed">
                  <p>
                    Software engineer at {COMPANY}, working on data-intensive
                    systems financial professionals use to do their actual
                    jobs. Intern to {ROLE_NOW.split(" ").pop()} in three
                    years — each rung earned, not gifted.
                  </p>
                  <p>
                    I build the version of the system I can still defend a
                    year later. Side projects (
                    <a
                      href="https://chatwithpdf.pro"
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                    >
                      Chat with PDF
                    </a>
                    ,{" "}
                    <Link href="/projects/voiceflow" className="link">
                      VoiceFlow
                    </Link>
                    ) are where I test the version of myself I want at work.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Link
                    href="/about"
                    className="cta-ghost min-h-[40px] px-4"
                  >
                    <span>about · stack · leetcode</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href={LEETCODE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[12px] text-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline"
                  >
                    leetcode {LEETCODE_TIER.toLowerCase()} ·{" "}
                    <span className="tabular">{LEETCODE_RATING}</span> ↗
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right — micro-timeline */}
            <div>
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  the path
                </p>
              </Reveal>
              <Reveal delay={60}>
                <div className="mt-3 surface overflow-hidden">
                  <ol className="divide-y divide-[var(--color-border)]">
                    {TIMELINE.map((item) => (
                      <li
                        key={item.period}
                        className="grid gap-1 px-5 py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-5 md:px-6 md:py-5"
                      >
                        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)] sm:w-[10.5rem]">
                          {item.period}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display text-[1.05rem] font-medium tracking-tight text-[var(--color-text)]">
                              {item.title}
                            </span>
                            <span className="font-mono text-[11px] text-[var(--color-accent-dim)]">
                              · {item.company}
                            </span>
                          </div>
                          <p className="mt-1 text-pretty text-[13.5px] leading-relaxed text-[var(--color-text-muted)]">
                            {item.note}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              {/* LeetCode micro-card under the timeline */}
              <Reveal delay={140}>
                <a
                  href={LEETCODE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group surface mt-4 flex items-center justify-between gap-4 p-4 transition-colors hover:bg-[var(--color-surface-2)] md:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-accent-dim)] bg-[var(--color-canvas-deep)] text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]"
                    >
                      <LeetCodeIcon size={21} />
                    </span>
                    <div>
                      <div className="font-display text-[15px] font-medium text-[var(--color-text)]">
                        {LEETCODE_TIER}{" "}
                        <span className="text-[var(--color-accent)] tabular">
                          {LEETCODE_RATING}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                        {LEETCODE_STREAK}-day streak · {LEETCODE_PROBLEMS}{" "}
                        problems
                      </div>
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent)]"
                  >
                    verify ↗
                  </span>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT-STRIP ═══════════════════════════════════════════════ */}
      <section className="relative pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-[76rem] px-5 md:px-6">
          <Reveal>
            <div className="surface lit-edge relative grid items-center gap-8 overflow-hidden p-6 md:grid-cols-[1.5fr_1fr] md:gap-12 md:p-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  §03 · contact
                </p>
                <h2 className="mt-3 font-display text-[1.8rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.25rem]">
                  Building something where judgment matters?
                </h2>
                <p className="mt-3 max-w-xl text-[var(--color-text-muted)]">
                  Best way to reach me — email gets a reply within a day.
                  Use the form for a longer pitch.
                </p>
                <div className="mt-6">
                  <CopyButton value="vishnuvardhanganji@gmail.com" />
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 md:items-end">
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
      </section>
    </>
  );
}
