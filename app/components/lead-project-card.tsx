// Server component: the full-width card for the lead project.
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { tagLabels } from "@/lib/projects";
import { DiffRow } from "./diff";
import { ExternalChip } from "./featured-project-card";
import { LoopVideo } from "./loop-video";

// Same stretched-link pattern as FeaturedProjectCard: one anchor (the
// case-study link) covers the whole card through ::after, and the
// external chips sit above it. The right half is the product itself, a
// silent loop of a teammate working on its own screen, framed like the
// app's live-screen panel.
export function LeadProjectCard({ project }: { project: Project }) {
  const media = project.media;
  const decision = project.decisions[0];

  return (
    <article className="group surface lit-edge relative grid overflow-hidden p-5 transition-all hover:bg-[var(--color-surface-2)] active:bg-[var(--color-surface-3)] md:p-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:gap-10 lg:p-8">
      {/* Product screen (first on mobile, right column on desktop) */}
      {media && (
        <div className="mb-6 lg:order-2 lg:mb-0 lg:self-center">
          <div
            className="overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-canvas-deep)]"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.045), 0 24px 60px -30px rgba(0,0,0,0.85)",
            }}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]"
                  style={{ boxShadow: "0 0 6px rgba(245,126,84,0.7)" }}
                />
                {media.loop.label}
              </span>
              <span>working</span>
            </div>
            <LoopVideo
              loop={media.loop}
              alt={`${project.name}: a teammate searching for flights in its own browser`}
            />
          </div>
          <p className="mt-2.5 font-mono text-[10.5px] text-[var(--color-text-subtle)]">
            real recording · no mockups
          </p>
        </div>
      )}

      {/* Text column */}
      <div className="flex min-w-0 flex-col lg:order-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="inline-flex items-center gap-2 text-[var(--color-signal)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
              style={{ boxShadow: "0 0 6px rgba(74,222,128,0.55)" }}
            />
            {project.status}
          </span>
          <span aria-hidden className="text-[var(--color-text-subtle)]">
            ·
          </span>
          <span className="text-[var(--color-text-subtle)]">
            {project.year}
          </span>
          {project.built && (
            <>
              <span aria-hidden className="text-[var(--color-text-subtle)]">
                ·
              </span>
              <span className="text-[var(--color-text-subtle)]">
                built in {project.built}
              </span>
            </>
          )}
          <span className="ml-auto hidden rounded-full border border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)] px-2 py-0.5 text-[9.5px] text-[var(--color-accent)] sm:inline">
            latest
          </span>
        </div>

        <h3 className="mt-3 font-display text-[1.85rem] font-medium leading-[1.02] tracking-[-0.025em] text-[var(--color-text)] sm:text-[2.25rem] md:text-[2.6rem]">
          {project.name}
          <span className="text-[var(--color-accent)]">.</span>
        </h3>

        <p className="mt-3 max-w-xl text-pretty text-[var(--color-text-muted)] md:text-[1.0625rem] md:leading-relaxed">
          {project.tagline}
        </p>

        {/* What you can do: the tour's chapters, as a scannable list */}
        {media && media.shots.length > 0 && (
          <ol className="mt-5 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
            {media.shots.map((shot, i) => (
              <li
                key={shot.src}
                className="flex items-baseline gap-2.5 text-[14px] text-[var(--color-text)]"
              >
                <span className="font-mono text-[10px] tabular text-[var(--color-accent-dim)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">{shot.title}</span>
              </li>
            ))}
          </ol>
        )}

        {decision && (
          <div className="surface-recess mt-5 p-3.5">
            <DiffRow type="add">{decision.chose}</DiffRow>
            <DiffRow type="remove">{decision.rejected}</DiffRow>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-canvas-deep)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]"
            >
              {tagLabels[t]}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-[var(--color-border)] pt-4 font-mono text-[11.5px]">
            <span className="min-w-0 text-[var(--color-text-subtle)]">
              {project.tech.slice(0, 3).join(" · ")}
              {project.tech.length > 3 && " · …"}
            </span>
            <Link
              href={`/projects/${project.slug}`}
              className="ml-auto flex-shrink-0 pl-3 font-mono text-[var(--color-text-muted)] transition-colors after:absolute after:inset-0 after:z-0 after:content-[''] group-hover:text-[var(--color-accent)]"
            >
              read case study →
            </Link>
          </div>

          {(project.links.live || project.links.github) && (
            <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
              {project.links.live && (
                <ExternalChip
                  href={project.links.live}
                  label={
                    project.links.liveLabel ??
                    project.links.live.replace(/^https?:\/\//, "")
                  }
                  kind="live"
                />
              )}
              {project.links.github && (
                <ExternalChip
                  href={project.links.github}
                  label="github"
                  kind="repo"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
