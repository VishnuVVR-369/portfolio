import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
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
import { TourPlayer } from "../../components/tour-player";

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
    image: project.media?.ogImage
      ? {
          url: project.media.ogImage,
          alt: `${project.name}: ${project.tagline}`,
        }
      : undefined,
  });
}

function ProjectStructuredData({ slug }: { slug: string }) {
  const data = projectJsonLd(slug);
  if (!data) return null;
  return <JsonLd data={data} />;
}

type SectionKey =
  | "tour"
  | "product"
  | "architecture"
  | "problem"
  | "approach"
  | "decisions"
  | "tradeoffs"
  | "impact"
  | "stack";

// Section numbers follow what a project actually has: a case study
// without a tour or impact numbers doesn't skip from §01 to §03.
function sectionNumbers(keys: (SectionKey | false)[]) {
  const order = keys.filter((k): k is SectionKey => k !== false);
  return (key: SectionKey) =>
    `§${String(order.indexOf(key) + 1).padStart(2, "0")}`;
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
  const media = project.media;
  const shots = media?.shots ?? [];
  const n = sectionNumbers([
    Boolean(media?.tour) && "tour",
    shots.length > 0 && "product",
    "architecture",
    "problem",
    "approach",
    "decisions",
    "tradeoffs",
    project.impact.length > 0 && "impact",
    "stack",
  ]);

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
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-[var(--color-text-muted)] sm:gap-x-5">
            <span>
              <span className="text-[var(--color-text-subtle)]">year ·</span>{" "}
              {project.year}
            </span>
            <span>
              <span className="text-[var(--color-text-subtle)]">role ·</span>{" "}
              {project.role.toLowerCase()}
            </span>
            {project.built && (
              <span>
                <span className="text-[var(--color-text-subtle)]">
                  built in ·
                </span>{" "}
                {project.built}
              </span>
            )}
            <span className="min-w-0 truncate">
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
        {(project.links.live ||
          project.links.github ||
          project.links.download) && (
          <Reveal delay={300}>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-accent min-h-[40px] px-4"
                >
                  <span>
                    {project.links.liveLabel ??
                      project.links.live.replace(/^https?:\/\//, "")}
                  </span>
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
              {project.links.download && (
                <a
                  href={project.links.download}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-ghost min-h-[40px] px-4"
                >
                  <span>download</span>
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </Reveal>
        )}
      </header>

      <div className="border-t border-[var(--color-border)]" />

      {/* ═══ TOUR ══════════════════════════════════════════════════════ */}
      {media?.tour && (
        <section className="mx-auto max-w-[76rem] px-5 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
              {n("tour")} · tour
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 max-w-2xl font-display text-[1.75rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.25rem]">
              See it{" "}
              <span className="text-[var(--color-accent)]">do the work</span>.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8">
              <TourPlayer
                tour={media.tour}
                poster={media.loop.poster}
                posterAvif={media.loop.posterAvif}
                name={project.name}
              />
            </div>
          </Reveal>
        </section>
      )}

      {/* ═══ PRODUCT ═══════════════════════════════════════════════════ */}
      {shots.length > 0 && (
        <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              {n("product")} · the product
            </p>
            <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.75rem]">
              What it does.
              <br />
              <span className="text-[var(--color-text-muted)]">
                Straight from the running app.
              </span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-12 md:mt-14 md:space-y-20">
            {shots.map((shot, i) => {
              const flipped = i % 2 === 1;
              return (
                <Reveal key={shot.src}>
                  <figure
                    className={`grid items-center gap-5 md:gap-10 ${
                      flipped
                        ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
                        : "md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
                    }`}
                  >
                    <div
                      className={`overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] ${
                        flipped ? "md:order-2" : ""
                      }`}
                      style={{
                        boxShadow:
                          "0 1px 0 rgba(255,255,255,0.03), 0 28px 60px -34px rgba(0,0,0,0.9)",
                      }}
                    >
                      <Image
                        src={shot.src}
                        width={shot.width}
                        height={shot.height}
                        alt={shot.alt}
                        sizes="(min-width: 1216px) 690px, (min-width: 768px) 58vw, 100vw"
                        className="block h-auto w-full"
                      />
                    </div>
                    <figcaption className={flipped ? "md:order-1" : ""}>
                      <span className="font-mono text-[11px] tabular text-[var(--color-accent)]">
                        {String(i + 1).padStart(2, "0")}
                        <span className="text-[var(--color-text-subtle)]">
                          {" "}
                          / {String(shots.length).padStart(2, "0")}
                        </span>
                      </span>
                      <h3 className="mt-2 font-display text-[1.5rem] font-medium leading-tight tracking-tight text-[var(--color-text)] md:text-[1.85rem]">
                        {shot.title}
                      </h3>
                      <p className="mt-3 max-w-md text-pretty text-[var(--color-text-muted)] md:text-[1.0625rem] md:leading-relaxed">
                        {shot.caption}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>

          {project.highlights && project.highlights.length > 0 && (
            <Reveal>
              <div className="mt-14 border-t border-[var(--color-border)] pt-8 md:mt-20">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  and the rest
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-1.5 text-[13.5px] text-[var(--color-text)]"
                      style={{
                        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)",
                      }}
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* ═══ ARCHITECTURE ══════════════════════════════════════════════ */}
      <section
        className={`mx-auto max-w-[76rem] px-5 py-14 md:px-6 md:py-20 ${
          media ? "border-t border-[var(--color-border)]" : ""
        }`}
      >
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            {n("architecture")} · architecture
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-3 max-w-2xl font-display text-[1.75rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.25rem]">
            How it{" "}
            <span className="text-[var(--color-accent)]">moves the data</span>.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div
            className={`mt-8 ${
              project.visual === "topology" ? "max-w-5xl" : "max-w-3xl"
            }`}
          >
            <ProjectVisual project={project} />
          </div>
        </Reveal>
      </section>

      {/* ═══ PROBLEM + APPROACH ════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              {n("problem")} · problem
            </p>
            <p className="mt-5 text-pretty text-[var(--color-text)] md:text-[1.0625rem] md:leading-relaxed">
              {project.problem}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
              {n("approach")} · approach
            </p>
            <p className="mt-5 text-pretty text-[var(--color-text)] md:text-[1.0625rem] md:leading-relaxed">
              {project.approach}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ DECISIONS ═════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            {n("decisions")} · decisions
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
              <div className="surface grid gap-5 p-5 sm:p-6 md:grid-cols-[3rem_1fr] md:gap-8 md:p-8">
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

      {/* ═══ TRADEOFFS ═════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            {n("tradeoffs")} · tradeoffs
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
                className="grid grid-cols-[2.25rem_1fr] gap-3 border-l-2 border-[var(--color-accent-dim)] py-1 pl-4 sm:grid-cols-[2.5rem_1fr] sm:gap-4 sm:pl-5"
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

      {/* ═══ IMPACT ═══════════════════════════════════════════════════ */}
      {project.impact.length > 0 && (
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            {n("impact")} · impact
          </p>
          <h2 className="mt-3 font-display text-[2rem] font-medium tracking-tight text-[var(--color-text)] md:text-[2.75rem]">
            What this returned.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-3">
            {project.impact.map((m, i) => (
              <div
                key={i}
                className={`surface flex flex-col gap-2 p-3 text-center sm:gap-3 sm:p-6 md:p-8 ${
                  i === 0 ? "lit-edge relative overflow-hidden" : ""
                }`}
              >
                <div className="font-display text-[1.4rem] font-medium leading-none tracking-tight text-[var(--color-accent)] sm:text-[2.5rem] md:text-[3.25rem]">
                  {m.metric}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)] sm:text-[10.5px] sm:tracking-[0.2em]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      )}

      {/* ═══ STACK ═════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] border-t border-[var(--color-border)] px-5 py-14 md:px-6 md:py-20">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            {n("stack")} · stack
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
          <div className="flex items-center justify-end font-mono text-[11px] text-[var(--color-text-subtle)]">
            <span>~{minutes} min read</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="surface group p-5 transition-colors hover:bg-[var(--color-surface-2)] active:bg-[var(--color-surface-3)] sm:p-6"
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
              className="surface group p-5 transition-colors hover:bg-[var(--color-surface-2)] active:bg-[var(--color-surface-3)] sm:p-6 md:text-right"
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
              className="surface group p-5 transition-colors hover:bg-[var(--color-surface-2)] active:bg-[var(--color-surface-3)] sm:p-6 md:text-right"
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
