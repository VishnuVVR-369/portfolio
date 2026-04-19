"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProjectTag, ProjectStatus, ImpactMetric } from "@/lib/projects";
import { tagLabels } from "@/lib/projects";
import { Reveal } from "../components/reveal";
import { DiffRow } from "../components/diff";

interface IndexEntry {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  status: ProjectStatus;
  tech: string[];
  tags: ProjectTag[];
  headline: ImpactMetric;
  firstDecision: { chose: string; rejected: string };
}

const FILTERS: ({ id: "all" } | { id: ProjectTag })[] = [
  { id: "all" },
  { id: "ai" },
  { id: "systems" },
  { id: "full-stack" },
  { id: "desktop" },
];

export function ProjectsIndex({ projects }: { projects: IndexEntry[] }) {
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
      <section className="container-page pt-20 pb-10 md:pt-32">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
            /projects
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="mt-4 font-display text-5xl font-medium leading-[1.0] tracking-tight text-[var(--color-text)] md:text-7xl">
            selected work.
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-2xl text-[var(--color-text-muted)] md:text-lg">
            Each project is a case study, not a screenshot. Click in for the
            decision log: what was chosen, what was rejected, and the
            constraint that made the difference.
          </p>
        </Reveal>
      </section>

      {/* Filter bar */}
      <section className="container-page">
        <Reveal delay={180}>
          <div className="flex flex-wrap items-center gap-2 border-y border-[var(--color-border)] py-4">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
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
                  className={`group inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[12px] transition-colors ${
                    active
                      ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                      : "border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span className="lowercase">{label}</span>
                  <span
                    className={`text-[10px] ${
                      active
                        ? "text-[var(--color-accent-dim)]"
                        : "text-[var(--color-text-subtle)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto font-mono text-[11px] text-[var(--color-text-subtle)]">
              {visible.length}/{projects.length}
            </span>
          </div>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="container-page py-12 md:py-16">
        {visible.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] py-20 text-center font-mono text-sm text-[var(--color-text-subtle)]">
            no projects under this filter — yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all hover:border-[var(--color-accent-dim)] hover:bg-[var(--color-surface-inset)]"
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

                  <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-[var(--color-text)]">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[var(--color-text-muted)]">
                    {p.tagline}
                  </p>

                  <div className="mt-6 space-y-1.5 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-canvas)]/40 p-4">
                    <DiffRow type="add">
                      <span>{p.firstDecision.chose}</span>
                    </DiffRow>
                    <DiffRow type="remove">
                      <span>{p.firstDecision.rejected}</span>
                    </DiffRow>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-display text-3xl font-medium text-[var(--color-accent)]">
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
        )}
      </section>
    </>
  );
}
