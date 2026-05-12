// Server component — pure presentational, no event handlers.
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { tagLabels } from "@/lib/projects";
import { DiffRow } from "./diff";
import { ProjectVisual } from "./project-visual";

interface FeaturedProjectCardProps {
  project: Project;
  visualVariant?: "pipeline" | "rack";
  className?: string;
}

// Image-led featured-project card.
//
// Pattern: the card is NOT a link wrapper (that would nest anchors).
// Instead, the "read case study →" link is the primary anchor and
// stretches across the whole card via its ::after pseudo-element
// (`absolute inset-0`). External chips sit above it via z-index.
// This is the accessible canonical "stretched link" pattern: single
// anchor in the a11y tree, full-card click target, no nested <a>s.
export function FeaturedProjectCard({
  project,
  visualVariant = "pipeline",
  className = "",
}: FeaturedProjectCardProps) {
  return (
    <article
      className={`group surface lit-edge relative flex h-full flex-col overflow-hidden p-5 transition-all hover:bg-[var(--color-surface-2)] md:p-6 ${className}`}
    >
      {/* Visual region */}
      <ProjectVisual
        project={project}
        variant={visualVariant}
        className="mb-6"
      />

      {/* Identity row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-signal)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
              style={{ boxShadow: "0 0 6px rgba(74,222,128,0.55)" }}
            />
            {project.status}
            <span aria-hidden className="text-[var(--color-text-subtle)]">
              ·
            </span>
            <span className="text-[var(--color-text-subtle)]">
              {project.year}
            </span>
          </div>
          <h3 className="font-display text-[1.65rem] font-medium leading-tight tracking-tight text-[var(--color-text)] md:text-[1.85rem]">
            {project.name}
          </h3>
        </div>

        {/* Headline metric — right-aligned, the eye finds it */}
        <div className="flex-shrink-0 text-right">
          <div className="font-display text-3xl font-medium leading-none text-[var(--color-accent)] md:text-[2.25rem]">
            {project.headline.metric}
          </div>
          <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
            {project.headline.label}
          </div>
        </div>
      </div>

      <p className="mt-3 max-w-md text-pretty text-[var(--color-text-muted)]">
        {project.tagline}
      </p>

      {/* The decision row — diff primitive earning its place */}
      <div className="surface-recess mt-5 p-3.5">
        <DiffRow type="add">{project.decisions[0].chose}</DiffRow>
        <DiffRow type="remove">{project.decisions[0].rejected}</DiffRow>
      </div>

      {/* Tech tags */}
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

      {/* Footer — tech list + the stretched primary link + external chips */}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 font-mono text-[11.5px]">
          <span className="min-w-0 truncate text-[var(--color-text-subtle)]">
            {project.tech.slice(0, 3).join(" · ")}
            {project.tech.length > 3 && " · …"}
          </span>
          {/*
            Stretched primary link. ::after spans the entire card so
            click anywhere on the article navigates to the case study.
            External chips below override with their own z-index.
          */}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-3 flex-shrink-0 font-mono text-[var(--color-text-muted)] transition-colors after:absolute after:inset-0 after:z-0 after:content-[''] group-hover:text-[var(--color-accent)]"
          >
            read case study →
          </Link>
        </div>

        {(project.links.live || project.links.github) && (
          <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
            {project.links.live && (
              <ExternalChip
                href={project.links.live}
                label={project.links.live.replace(/^https?:\/\//, "")}
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
    </article>
  );
}

function ExternalChip({
  href,
  label,
  kind,
}: {
  href: string;
  label: string;
  kind: "live" | "repo";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`relative z-10 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10.5px] transition-colors ${
        kind === "live"
          ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)] text-[var(--color-accent)] hover:bg-[var(--color-accent-wash)]"
          : "border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:border-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
      }`}
      style={
        kind === "live"
          ? undefined
          : { boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)" }
      }
    >
      <span className="max-w-[18ch] truncate">{label}</span>
      <span aria-hidden className="opacity-80">
        ↗
      </span>
    </a>
  );
}
