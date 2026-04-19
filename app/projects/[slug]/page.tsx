import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  allProjectSlugs,
  getProject,
  projects,
  readingTime,
  tagLabels,
} from "@/lib/projects";
import { Reveal } from "../../components/reveal";
import { DiffRow } from "../../components/diff";

const LAST_EDITED = "2026-04-19";

export function generateStaticParams() {
  return allProjectSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: `${project.name} — Case study`,
      description: project.tagline,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const minutes = readingTime(project);
  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <article>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header
        data-source={`app/projects/[slug]/page.tsx › ${project.slug}`}
        className="container-page pt-20 pb-12 md:pt-32 md:pb-16"
      >
        <Reveal>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            <span aria-hidden>←</span> back to projects
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
            {project.name}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-medium leading-[1.05] tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
            {project.tagline}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] text-[var(--color-text-muted)]">
            <span>
              <span className="text-[var(--color-text-subtle)]">year ·</span>{" "}
              {project.year}
            </span>
            <span>
              <span className="text-[var(--color-text-subtle)]">role ·</span>{" "}
              {project.role.toLowerCase()}
            </span>
            <span>
              <span className="text-[var(--color-text-subtle)]">tags ·</span>{" "}
              {project.tags.map((t) => tagLabels[t]).join(", ")}
            </span>
            <span>
              <span className="text-[var(--color-text-subtle)]">read ·</span>{" "}
              ~{minutes} min
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--color-signal)]">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
              />
              {project.status}
            </span>
          </div>
        </Reveal>
      </header>

      <div className="border-t border-[var(--color-border)]" />

      {/* ─── Pipeline visualization ─────────────────────────────── */}
      <section
        data-source="case-study › Pipeline"
        className="container-page py-14"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §01 · pipeline
          </p>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex min-w-max items-center gap-3 font-mono text-[12px]">
              {project.pipeline.map((step, i) => (
                <span key={step} className="flex items-center gap-3">
                  <span className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-canvas)]/60 px-3 py-1.5 text-[var(--color-text)]">
                    {step}
                  </span>
                  {i < project.pipeline.length - 1 && (
                    <span
                      aria-hidden
                      className="text-[var(--color-text-subtle)]"
                    >
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── Problem / Approach ─────────────────────────────────── */}
      <section
        data-source="case-study › ProblemApproach"
        className="container-page py-14"
      >
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              §02 · problem
            </p>
            <p className="mt-5 text-pretty text-[var(--color-text)] md:text-lg md:leading-relaxed">
              {project.problem}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
              §03 · approach
            </p>
            <p className="mt-5 text-pretty text-[var(--color-text)] md:text-lg md:leading-relaxed">
              {project.approach}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Decisions ──────────────────────────────────────────── */}
      <section
        data-source="case-study › Decisions"
        className="container-page py-14"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §04 · decisions
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
            What was chosen.
            <br />
            <span className="text-[var(--color-text-muted)]">
              What was rejected.
            </span>
          </h2>
        </Reveal>

        <div className="mt-10 space-y-5">
          {project.decisions.map((d, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="grid gap-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:grid-cols-[2.5rem_1fr] md:gap-8 md:p-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  d/{String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="space-y-1.5">
                    <DiffRow type="add">
                      <span className="text-[var(--color-text)]">{d.chose}</span>
                    </DiffRow>
                    <DiffRow type="remove">
                      <span>{d.rejected}</span>
                    </DiffRow>
                  </div>
                  <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                    <p className="text-pretty text-[var(--color-text-muted)] md:text-[1.0625rem] md:leading-relaxed">
                      {d.reason}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Tradeoffs ──────────────────────────────────────────── */}
      <section
        data-source="case-study › Tradeoffs"
        className="container-page py-14"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §05 · tradeoffs
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
            What this costs.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-8 space-y-4">
            {project.tradeoffs.map((t, i) => (
              <li
                key={i}
                className="grid grid-cols-[2rem_1fr] gap-4 border-l-2 border-[var(--color-accent-dim)] py-1 pl-4"
              >
                <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                  t/{String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-pretty text-[var(--color-text-muted)] md:text-[1.0625rem] md:leading-relaxed">
                  {t}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ─── Impact ─────────────────────────────────────────────── */}
      <section
        data-source="case-study › Impact"
        className="container-page py-14"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §06 · impact
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
            What this returned.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
            {project.impact.map((m, i) => (
              <div
                key={i}
                className="bg-[var(--color-surface)] p-7 text-center"
              >
                <div className="font-display text-4xl font-medium text-[var(--color-accent)] md:text-5xl">
                  {m.metric}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── Tech stack ─────────────────────────────────────────── */}
      <section
        data-source="case-study › Stack"
        className="container-page py-14"
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §07 · stack
          </p>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-1.5 font-mono text-[12px] text-[var(--color-text)]"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── Footer / next case ─────────────────────────────────── */}
      <section className="container-page py-14">
        <div className="border-t border-[var(--color-border)] pt-8">
          <div className="flex items-center justify-between font-mono text-[11px] text-[var(--color-text-subtle)]">
            <span>last edited · {LAST_EDITED}</span>
            <span>~{minutes} min read</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-accent-dim)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                ← previous
              </p>
              <p className="mt-2 font-display text-xl font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                {prev.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-right transition-colors hover:border-[var(--color-accent-dim)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                next →
              </p>
              <p className="mt-2 font-display text-xl font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                {next.name}
              </p>
            </Link>
          ) : (
            <Link
              href="/projects"
              className="group rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-right transition-colors hover:border-[var(--color-accent-dim)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                next →
              </p>
              <p className="mt-2 font-display text-xl font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                back to all projects
              </p>
            </Link>
          )}
        </div>
      </section>
    </article>
  );
}
