import type { Project } from "@/lib/projects";

interface ProjectVisualProps {
  project: Project;
  variant?: "pipeline" | "rack";
  className?: string;
}

// Spec-sheet visualization for project cards. Instead of a fake browser
// screenshot, we render the product's *architecture* as a schematic:
//
//   pipeline → vertical flowchart inside an abstracted control panel
//   rack     → horizontal instrument-rack with hotkey/mic/text stages
//
// Both variants are pure SVG/HTML — no real assets needed, scales
// perfectly, and the visual itself demonstrates design ability.
export function ProjectVisual({
  project,
  variant = "pipeline",
  className = "",
}: ProjectVisualProps) {
  if (variant === "rack") {
    return <RackVisual project={project} className={className} />;
  }
  return <PipelineVisual project={project} className={className} />;
}

// ─── Pipeline visualization ────────────────────────────────────────
// Vertical control panel showing each stage as a labeled cell, with
// a connecting trace line between them. One stage is highlighted (the
// "expensive" one) with a tooltip-style metric annotation.

function PipelineVisual({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const stages = project.pipeline;
  const highlightIdx = stages.findIndex((s) => s === "embed" || s === "ocr");

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-canvas-deep)] via-[var(--color-canvas)] to-[var(--color-surface)] ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.045), 0 1px 24px -8px rgba(0,0,0,0.5)",
      }}
      aria-hidden
    >
      {/* Panel header — instrument label */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
            style={{ boxShadow: "0 0 6px rgba(74,222,128,0.6)" }}
          />
          pipeline · {project.slug}
        </span>
        <span className="tabular text-[var(--color-text-subtle)]">
          {stages.length} stages
        </span>
      </div>

      {/* Stack of stages with trace lines */}
      <div className="relative px-5 py-5">
        {/* Vertical trace running down the left edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-7 left-[2.05rem] top-7 w-px bg-gradient-to-b from-transparent via-[var(--color-border-strong)] to-transparent"
        />

        <ol className="space-y-2.5">
          {stages.map((stage, i) => {
            const isHighlight = i === highlightIdx;
            return (
              <li
                key={stage}
                className="flex items-center gap-3"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Step node */}
                <span
                  className={`relative z-10 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[4px] border font-mono text-[9px] tabular ${
                    isHighlight
                      ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                      : "border-[var(--color-border-strong)] bg-[var(--color-canvas-deep)] text-[var(--color-text-subtle)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Label */}
                <span
                  className={`font-mono text-[12px] ${
                    isHighlight
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text)]"
                  }`}
                >
                  {stage}
                </span>

                {/* Right-side annotation on the highlighted row */}
                {isHighlight && (
                  <span className="ml-auto inline-flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="hidden h-px w-8 bg-[var(--color-accent-dim)] sm:block"
                    />
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--color-accent-dim)]">
                      hot path
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Bottom strip — corner badges, like a real instrument panel */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-canvas-deep)] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
        <span>schema · v1</span>
        <span className="text-[var(--color-accent-dim)]">{project.year}</span>
      </div>
    </div>
  );
}

// ─── Rack visualization ────────────────────────────────────────────
// Horizontal "patchbay" showing input → processing → output stages.
// Used for projects where the data flow is conceptually left-to-right
// (e.g. hotkey input → AI processing → text output for VoiceFlow).

function RackVisual({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  // Map the pipeline into 3 logical stages: input / process / output
  const cells = project.pipeline;
  const inputCells = cells.slice(0, Math.max(1, Math.floor(cells.length / 3)));
  const processCells = cells.slice(
    inputCells.length,
    cells.length - 1
  );
  const outputCells = cells.slice(-1);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-canvas-deep)] via-[var(--color-canvas)] to-[var(--color-surface)] ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.045), 0 1px 24px -8px rgba(0,0,0,0.5)",
      }}
      aria-hidden
    >
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            style={{ boxShadow: "0 0 6px rgba(245,180,84,0.6)" }}
          />
          patchbay · {project.slug}
        </span>
        <span className="tabular text-[var(--color-text-subtle)]">
          system-level
        </span>
      </div>

      {/* Rack: three column groups separated by amber rule */}
      <div className="grid grid-cols-[1fr_auto_1.4fr_auto_1fr] items-stretch gap-2 px-4 py-5">
        <RackGroup label="input" cells={inputCells} />
        <RackBridge />
        <RackGroup
          label="process"
          cells={processCells}
          tone="accent"
        />
        <RackBridge />
        <RackGroup label="output" cells={outputCells} />
      </div>

      {/* Bottom strip */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-canvas-deep)] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
        <span>3 platforms · macos · win · linux</span>
        <span className="text-[var(--color-accent-dim)]">{project.year}</span>
      </div>
    </div>
  );
}

function RackGroup({
  label,
  cells,
  tone = "muted",
}: {
  label: string;
  cells: string[];
  tone?: "muted" | "accent";
}) {
  const isAccent = tone === "accent";
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
        {label}
      </span>
      <div
        className={`flex flex-1 flex-col gap-1 rounded-md border p-2 ${
          isAccent
            ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-wash)]"
            : "border-[var(--color-border-strong)] bg-[var(--color-canvas-deep)]"
        }`}
        style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)" }}
      >
        {cells.length === 0 ? (
          <span className="font-mono text-[10px] text-[var(--color-text-subtle)]">
            —
          </span>
        ) : (
          cells.map((c, i) => (
            <span
              key={c + i}
              className={`block truncate font-mono text-[11px] ${
                isAccent
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text)]"
              }`}
            >
              {c}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function RackBridge() {
  return (
    <div
      aria-hidden
      className="flex flex-col items-center justify-center pb-1 pt-5"
    >
      <span
        className="block h-px w-4 bg-gradient-to-r from-[var(--color-border-strong)] via-[var(--color-accent-dim)] to-[var(--color-border-strong)]"
      />
    </div>
  );
}
