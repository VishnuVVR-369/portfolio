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
import { JsonLd, projectJsonLd, routeMetadata } from "@/lib/seo";
import { Reveal } from "../../components/reveal";
import { DiffRow } from "../../components/diff";
import { ProjectVisual } from "../../components/project-visual";

const LAST_EDITED = "2026-05-11";

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
  return routeMetadata({
    title: `${project.name} Case Study`,
    description: `${project.tagline} Built with ${project.tech
      .slice(0, 4)
      .join(", ")} by Vishnuvardhan Reddy.`,
    path: `/projects/${project.slug}`,
    type: "article",
  });
}

function ProjectStructuredData({ slug }: { slug: string }) {
  const data = projectJsonLd(slug);
  if (!data) return null;
  return <JsonLd data={data} />;
}

function visualVariantFor(slug: string): "pipeline" | "rack" {
  return slug === "voiceflow" ? "rack" : "pipeline";
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
  const variant = visualVariantFor(project.slug);

  return (
    <article>
      <ProjectStructuredData slug={project.slug} />

      {/* ═══ HEADER ════════════════════════════════════════════════════ */}
      <header className="mx-auto max-w-[76rem] px-5 pt-12 pb-12 md:px-6 md:pt-20 md:pb-16">
        <Reveal>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            <span aria-hidden>←</span> back to work
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
            /work · {project.slug}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-4 max-w-4xl font-display text-[2rem] font-medium leading-[1.05] tracking-[-0.025em] text-[var(--color-text)] sm:text-[2.75rem] md:text-[3.75rem]">
            {project.name}
            <span className="text-[var(--color-accent)]">.</span>
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-5 max-w-2xl text-pretty text-[var(--color-text-muted)] md:text-[1.15rem] md:leading-relaxed">
            {project.tagline}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11.5px] text-[var(--color-text-muted)]">
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
                style={{ boxShadow: "0 0 6px rgba(74,222,128,0.55)" }}
              />
              {project.status}
            </span>
          </div>
        </Reveal>

        {/* External links bar */}
        {(project.links.live || project.links.github) && (
          <Reveal delay={300}>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-accent min-h-[40px] px-4"
                >
                  <span>{project.links.live.replace(/^https?:\/\//, "")}</span>
                  <span aria-hidden>↗</span>
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-ghost min-h-[40px] px-4"
                >
                  <span>github</span>
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </Reveal>
        )}
      </header>

      <div className="border-t border-[var(--color-border)]" />

      {/* ═══ §01 VISUAL ════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §01 · architecture
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-3 max-w-2xl font-display text-[1.75rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.25rem]">
            How it{" "}
            <span className="text-[var(--color-accent)]">moves the data</span>.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 max-w-3xl">
            <ProjectVisual project={project} variant={variant} />
          </div>
        </Reveal>
      </section>

      {/* ═══ §02 PROBLEM + APPROACH ════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              §02 · problem
            </p>
            <p className="mt-5 text-pretty text-[var(--color-text)] md:text-[1.0625rem] md:leading-relaxed">
              {project.problem}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
              §03 · approach
            </p>
            <p className="mt-5 text-pretty text-[var(--color-text)] md:text-[1.0625rem] md:leading-relaxed">
              {project.approach}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ §04 DECISIONS ═════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §04 · decisions
          </p>
          <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.75rem]">
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
              <div className="surface grid gap-6 p-6 md:grid-cols-[3rem_1fr] md:gap-8 md:p-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  d/{String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="surface-recess space-y-1.5 p-3.5">
                    <DiffRow type="add">
                      <span className="text-[var(--color-text)]">
                        {d.chose}
                      </span>
                    </DiffRow>
                    <DiffRow type="remove">{d.rejected}</DiffRow>
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

      {/* ═══ §05 TRADEOFFS ═════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §05 · tradeoffs
          </p>
          <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.75rem]">
            What this costs.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-8 space-y-4">
            {project.tradeoffs.map((t, i) => (
              <li
                key={i}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-l-2 border-[var(--color-accent-dim)] py-1 pl-5"
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

      {/* ═══ §06 IMPACT ════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §06 · impact
          </p>
          <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.75rem]">
            What this returned.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {project.impact.map((m, i) => (
              <div
                key={i}
                className={`surface flex flex-col gap-3 p-6 text-center md:p-8 ${
                  i === 0 ? "lit-edge relative overflow-hidden" : ""
                }`}
              >
                <div className="font-display text-[2.5rem] font-medium leading-none tracking-tight text-[var(--color-accent)] md:text-[3.25rem]">
                  {m.metric}
                </div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ §07 STACK ═════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
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
                style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER / next case ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 py-14 md:px-6">
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
              className="surface group p-6 transition-colors hover:bg-[var(--color-surface-2)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                ← previous
              </p>
              <p className="mt-2 font-display text-[1.25rem] font-medium tracking-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                {prev.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="surface group p-6 text-right transition-colors hover:bg-[var(--color-surface-2)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                next →
              </p>
              <p className="mt-2 font-display text-[1.25rem] font-medium tracking-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                {next.name}
              </p>
            </Link>
          ) : (
            <Link
              href="/projects"
              className="surface group p-6 text-right transition-colors hover:bg-[var(--color-surface-2)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                next →
              </p>
              <p className="mt-2 font-display text-[1.25rem] font-medium tracking-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                back to all work
              </p>
            </Link>
          )}
        </div>
      </section>
    </article>
  );
}
