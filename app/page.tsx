import Link from "next/link";
import { featuredProjects, tagLabels } from "@/lib/projects";
import { Reveal } from "./components/reveal";
import { DiffRow } from "./components/diff";
import { CopyButton } from "./components/copy-button";
import { HeroClock } from "./components/hero-clock";

const EMAIL = "vishnuvardhanganji@gmail.com";

// Hero thesis. Three drafts; pick one and remove the others.
// TODO(vishnu): choose the thesis line that sounds most like you.
const THESIS_OPTIONS = [
  "I build systems where every decision can be defended.",
  // "I build software the way I'd want to inherit it: opinionated and explained.",
  // "Every tool here, I can defend. Every tradeoff, I can name.",
];

// TODO(vishnu): replace with your actual filter.
const OPEN_TO = "senior IC roles at AI-first product companies";

const TIMELINE = [
  {
    period: "apr 2026 — present",
    title: "software engineer iii",
    company: "factset",
    note:
      "Leading architecture for data-intensive systems. Mentoring across the team. Owning the long-term shape of the platform.",
  },
  {
    period: "aug 2024 — apr 2026",
    title: "software engineer ii",
    company: "factset",
    note:
      "Owned and scaled critical pipeline components. Made the system-design calls that improved throughput and cut on-call pages.",
  },
  {
    period: "jun 2023 — aug 2024",
    title: "software engineer i",
    company: "factset",
    note:
      "Shipped production features across the core platform. Developed deep expertise in financial-data systems and API design.",
  },
  {
    period: "jan 2023 — jun 2023",
    title: "software engineer intern",
    company: "factset",
    note:
      "Rapid ramp on enterprise systems. Delivered production-ready features within the first month and converted to a full-time offer.",
  },
];

export default function Home() {
  const projects = featuredProjects();

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section
        data-source="app/page.tsx › Hero"
        className="relative overflow-hidden border-b border-[var(--color-border)] pt-20 pb-20 md:pt-28 md:pb-24"
      >
        <div className="container-page">
          {/* Eyebrow */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              <span className="inline-flex items-center gap-2 text-[var(--color-signal)]">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
                />
                available for inbound
              </span>
              <span aria-hidden>·</span>
              <span>bangalore</span>
              <span aria-hidden>·</span>
              <HeroClock />
            </div>
          </Reveal>

          {/* Title + status panel */}
          <div className="mt-8 grid gap-x-12 gap-y-10 md:mt-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <Reveal delay={60}>
                <h1 className="font-display text-[2.75rem] font-medium leading-[0.95] tracking-[-0.035em] text-[var(--color-text)] sm:text-[4.5rem] md:text-[6rem] lg:text-[6.5rem]">
                  software
                  <br />
                  engineer<span className="text-[var(--color-accent)]">.</span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-8 max-w-xl text-pretty text-[var(--color-text-muted)] md:text-[1.125rem] md:leading-relaxed">
                  I&apos;m{" "}
                  <span className="text-[var(--color-text)]">
                    Vishnuvardhan Reddy
                  </span>
                  —a software engineer at FactSet, three years in. I build
                  systems where{" "}
                  <span className="text-[var(--color-text)]">
                    every decision can be defended
                  </span>
                  . The work is RAG, voice AI, and the unglamorous backbone
                  underneath.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
                  <Link
                    href="/projects"
                    className="group inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-3 font-mono text-[13px] text-[var(--color-canvas)] transition-all hover:bg-[var(--color-text)] sm:py-2.5"
                  >
                    <span>read the case studies</span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--color-border-strong)] bg-transparent px-4 py-3 font-mono text-[13px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] sm:py-2.5"
                  >
                    who is this
                  </Link>
                  <span className="ml-1 hidden font-mono text-[11px] text-[var(--color-text-subtle)] sm:inline">
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

            {/* Right: status panel — desktop counterweight; hidden on mobile
                to avoid duplicating info already in the eyebrow + bio. */}
            <Reveal delay={240} className="hidden min-w-0 lg:block">
              <aside
                aria-label="Status"
                className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                    system_status
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
                    v1.0.0
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-3 font-mono text-[12px]">
                  <dt className="text-[var(--color-text-subtle)]">thesis</dt>
                  <dd className="text-[var(--color-text)]">
                    {THESIS_OPTIONS[0].toLowerCase()}
                  </dd>
                  <dt className="text-[var(--color-text-subtle)]">role</dt>
                  <dd className="text-[var(--color-text)]">
                    swe iii @ factset
                  </dd>
                  <dt className="text-[var(--color-text-subtle)]">tenure</dt>
                  <dd className="text-[var(--color-text)]">3+ years</dd>
                  <dt className="text-[var(--color-accent)]">open to</dt>
                  <dd className="text-[var(--color-text)]">{OPEN_TO}</dd>
                  <dt className="text-[var(--color-text-subtle)]">writes</dt>
                  <dd className="text-[var(--color-text)]">
                    typescript · python · rust
                  </dd>
                </dl>
              </aside>
            </Reveal>
          </div>
        </div>

        {/* Subtle base-line numerals — bottom-edge ornament. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-between px-6 font-mono text-[10px] tracking-widest text-[var(--color-text-subtle)] opacity-40"
        >
          <span>vvr.dev</span>
          <span>est. 2026</span>
        </div>
      </section>

      {/* ─── Manifesto / Beliefs ─────────────────────────────────── */}
      <section
        data-source="app/page.tsx › Manifesto"
        className="relative py-20 md:py-28"
      >
        <div className="container-page">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              §01 · how i work
            </p>
          </Reveal>

          <Reveal delay={60}>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
              Engineering is the art
              <br />
              of{" "}
              <span className="text-[var(--color-accent)]">
                defending choices.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-2xl text-pretty text-[var(--color-text-muted)] md:text-lg md:leading-relaxed">
              Most code can be written two ways. Most architectures have a
              shadow architecture beneath them. The job isn&apos;t to ship —
              it&apos;s to ship the version of the system that you can still
              defend a year later, when the constraints have changed and the
              alternative looks tempting.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <DiffRow type="add">taste compounds</DiffRow>
                <DiffRow type="remove">
                  &quot;we&apos;ll fix it later&quot;
                </DiffRow>
              </div>
              <div className="space-y-1.5">
                <DiffRow type="add">boring tech where it matters</DiffRow>
                <DiffRow type="remove">resume-driven architecture</DiffRow>
              </div>
              <div className="space-y-1.5">
                <DiffRow type="add">defend every primitive</DiffRow>
                <DiffRow type="remove">cargo-culted abstractions</DiffRow>
              </div>
              <div className="space-y-1.5">
                <DiffRow type="add">name the tradeoff out loud</DiffRow>
                <DiffRow type="remove">silent compromises</DiffRow>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Featured Projects ───────────────────────────────────── */}
      <section
        data-source="app/page.tsx › FeaturedProjects"
        className="relative py-20 md:py-28"
      >
        <div className="container-page">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  §02 · selected work
                </p>
                <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
                  Two systems.
                  <br />
                  <span className="text-[var(--color-text-muted)]">
                    Both shipped. Both defensible.
                  </span>
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden font-mono text-[12px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] md:inline"
              >
                all projects →
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={120 + i * 80}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all hover:border-[var(--color-accent-dim)] hover:bg-[var(--color-surface-inset)] md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-signal)]">
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
                      />
                      {p.status}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                      {p.year}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-[var(--color-text)] md:text-[1.75rem]">
                    {p.name}
                  </h3>
                  <p className="mt-2 max-w-md text-[var(--color-text-muted)]">
                    {p.tagline}
                  </p>

                  <div className="mt-6 space-y-1.5 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-canvas)]/40 p-4">
                    <DiffRow type="add">{p.decisions[0].chose}</DiffRow>
                    <DiffRow type="remove">{p.decisions[0].rejected}</DiffRow>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-display text-3xl font-medium text-[var(--color-accent)] md:text-4xl">
                        {p.headline.metric}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                        {p.headline.label}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[var(--color-border-strong)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]"
                        >
                          {tagLabels[t]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-7">
                    <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 font-mono text-[12px]">
                      <span className="text-[var(--color-text-subtle)]">
                        {p.tech.slice(0, 3).join(" · ")}
                        {p.tech.length > 3 && " · …"}
                      </span>
                      <span className="text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent)]">
                        read case study →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300} className="md:hidden">
            <div className="mt-8 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-mono text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              >
                all projects →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Pull-quote epigraph ────────────────────────────────── */}
      <section
        data-source="app/page.tsx › Epigraph"
        className="relative py-24 md:py-32"
      >
        <div className="container-narrow text-center">
          <Reveal>
            <div className="mx-auto mb-6 h-px w-12 bg-[var(--color-accent-dim)]" />
          </Reveal>
          <Reveal delay={80}>
            <blockquote className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-[var(--color-text)] md:text-5xl">
              <span className="text-[var(--color-accent)]">&ldquo;</span>
              Simple is harder than complex.
              <br />
              But it&apos;s worth it.
              <span className="text-[var(--color-accent)]">&rdquo;</span>
            </blockquote>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              — guiding principle
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Experience timeline ─────────────────────────────────── */}
      <section
        data-source="app/page.tsx › Timeline"
        className="relative py-20 md:py-28"
      >
        <div className="container-page">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              §03 · the path
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
              Intern to swe iii.
              <br />
              <span className="text-[var(--color-text-muted)]">
                Three years. Each rung earned.
              </span>
            </h2>
          </Reveal>

          <div className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {TIMELINE.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="grid gap-3 py-6 md:grid-cols-[10rem_14rem_1fr] md:gap-8 md:py-7">
                  <div className="font-mono text-[12px] uppercase tracking-wider text-[var(--color-text-subtle)]">
                    {item.period}
                  </div>
                  <div>
                    <div className="font-display text-lg font-medium text-[var(--color-text)]">
                      {item.title}
                    </div>
                    <div className="font-mono text-[12px] text-[var(--color-accent)]">
                      {item.company}
                    </div>
                  </div>
                  <p className="text-[var(--color-text-muted)]">{item.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact CTA ─────────────────────────────────────────── */}
      <section
        data-source="app/page.tsx › ContactCTA"
        className="relative py-24 md:py-32"
      >
        <div className="container-page">
          <div className="grid gap-10 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:grid-cols-[1fr_auto] md:items-end md:p-12">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                §04 · let&apos;s talk
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-[2.5rem]">
                The bar to reach out is lower than you think.
              </h2>
              <p className="mt-4 max-w-xl text-[var(--color-text-muted)]">
                If you&apos;re building something where judgment matters,
                I&apos;d like to hear about it. Direct messages are read,
                signals are noticed, and short emails get short replies fast.
              </p>
              <div className="mt-7">
                <CopyButton value={EMAIL} />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex flex-col items-stretch gap-3 md:items-end">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-3 font-mono text-[13px] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-text)]"
                >
                  open the contact form →
                </Link>
                <span className="text-center font-mono text-[11px] text-[var(--color-text-subtle)] md:text-right">
                  i respond to every message that doesn&apos;t look bulk-sent.
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
