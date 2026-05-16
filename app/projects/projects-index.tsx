"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectTag } from "@/lib/projects";
import { tagLabels } from "@/lib/projects";
import { Reveal } from "../components/reveal";
import { FeaturedProjectCard } from "../components/featured-project-card";

const FILTERS: ({ id: "all" } | { id: ProjectTag })[] = [
  { id: "all" },
  { id: "ai" },
  { id: "systems" },
  { id: "full-stack" },
  { id: "desktop" },
];

// Per-project visual variant. Pipeline-shape projects get the
// vertical flow visual; system-level / input-process-output projects
// get the patchbay rack.
function visualVariantFor(slug: string): "pipeline" | "rack" {
  if (slug === "voiceflow") return "rack";
  return "pipeline";
}

export function ProjectsIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<"all" | ProjectTag>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.tags.includes(filter)),
    [filter, projects]
  );

  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-[76rem] px-5 pt-14 pb-10 md:px-6 md:pt-20">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
            /work
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="mt-3 font-display text-[2.5rem] font-medium leading-[0.98] tracking-[-0.03em] text-[var(--color-text)] sm:text-[4rem] md:text-[5rem]">
            selected work
            <span className="text-[var(--color-accent)]">.</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-2xl text-pretty text-[var(--color-text-muted)] md:text-[1.05rem] md:leading-relaxed">
            Each project is a case study, not a screenshot. Click in for the
            decision log: what was chosen, what was rejected, and the
            constraint that made the difference.
          </p>
        </Reveal>
      </section>

      {/* Filter bar */}
      <section className="mx-auto max-w-[76rem] px-5 md:px-6">
        <Reveal delay={180}>
          <div className="flex flex-wrap items-center gap-2.5 border-y border-[var(--color-border)] py-4">
            <span className="mr-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
              filter ·
            </span>
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const label = f.id === "all" ? "all" : tagLabels[f.id];
              const count =
                f.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.tags.includes(f.id)).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`group inline-flex min-h-[40px] items-center gap-1.5 rounded-md border px-3.5 py-2 font-mono text-[12px] transition-colors active:translate-y-px ${
                    active
                      ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                      : "border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                  }`}
                  style={{
                    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)",
                  }}
                >
                  <span className="lowercase">{label}</span>
                  <span
                    className={`tabular text-[10px] ${
                      active
                        ? "text-[var(--color-accent-dim)]"
                        : "text-[var(--color-text-subtle)]"
                    }`}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto font-mono text-[11px] text-[var(--color-text-subtle)] tabular">
              {String(visible.length).padStart(2, "0")}/
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[76rem] px-5 py-12 md:px-6 md:py-16">
        {visible.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] py-20 text-center font-mono text-sm text-[var(--color-text-subtle)]">
            no projects under this filter — yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <FeaturedProjectCard
                  project={p}
                  visualVariant={visualVariantFor(p.slug)}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
