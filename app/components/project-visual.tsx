import type { Project, ProjectVisualVariant } from "@/lib/projects";
import type { ReactNode } from "react";

interface ProjectVisualProps {
  project: Project;
  variant?: ProjectVisualVariant;
  className?: string;
}

// Spec-sheet visualization for project cards. Instead of a fake browser
// screenshot, we render the product's *architecture* as a schematic:
//
//   pipeline → vertical flowchart inside an abstracted control panel
//   rack     → horizontal instrument-rack with hotkey/mic/text stages
//   topology → three-tier system map: your devices, the cloud, and the
//              shared computer with one screen per teammate
//
// Both variants are pure SVG/HTML — no real assets needed, scales
// perfectly, and the visual itself demonstrates design ability.
export function ProjectVisual({
  project,
  variant = project.visual,
  className = "",
}: ProjectVisualProps) {
  if (variant === "topology") {
    return <TopologyVisual project={project} className={className} />;
  }
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

// ─── Topology visualization ────────────────────────────────────────
// A system map for open-bot: what runs on your devices, what runs in
// the cloud, and the shared computer where every teammate has its own
// screen. The screen grid shows the three lease states a screen can be
// in, so the diagram explains takeover without words.

type ScreenState = "asleep" | "working" | "you";

const TOPOLOGY_SCREENS: { name: string; state: ScreenState }[] = [
  { name: "iris", state: "asleep" },
  { name: "ada", state: "working" },
  { name: "otto", state: "asleep" },
  { name: "penny", state: "working" },
  { name: "milo", state: "you" },
  { name: "juno", state: "asleep" },
];

const SCREEN_STATE_LABEL: Record<ScreenState, string> = {
  asleep: "asleep",
  working: "working",
  you: "you have it",
};

function TopologyVisual({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
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
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
            style={{ boxShadow: "0 0 6px rgba(74,222,128,0.6)" }}
          />
          topology · {project.slug}
        </span>
        <span className="tabular">3 tiers</span>
      </div>

      <div className="grid gap-2 px-4 py-5 md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1fr)_auto_minmax(0,1.5fr)] md:items-stretch">
        <TopologyGroup label="your devices">
          <TopologyCell name="web app" detail="next.js" />
          <TopologyCell name="desktop app" detail="electron · egress" />
          <TopologyCell name="phone" detail="push · telegram" />
        </TopologyGroup>

        <TopologyBridge />

        <TopologyGroup label="railway" tone="accent">
          <TopologyCell name="server" detail="auth · actions · sse" tone="accent" />
          <TopologyCell name="worker" detail="runs · schedules · tools" tone="accent" />
          <TopologyCell name="postgres" detail="queue · memory · pgvector" tone="accent" />
        </TopologyGroup>

        <TopologyBridge />

        <TopologyGroup label="shared computer">
          <div className="grid grid-cols-2 gap-1">
            <TopologyCell name="codex" detail="app-server" />
            <TopologyCell name="botd" detail="leases · desktop" />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {TOPOLOGY_SCREENS.map((screen) => (
              <TopologyScreen key={screen.name} {...screen} />
            ))}
          </div>
        </TopologyGroup>
      </div>

      {/* Bottom strip: the egress path, the one non-obvious wire */}
      <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-canvas-deep)] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
        <span className="min-w-0 truncate">
          browser → <span className="hidden sm:inline">tunnel → </span>your
          mac → home ip
        </span>
        <span className="flex-shrink-0 text-[var(--color-accent-dim)]">
          {project.year}
        </span>
      </div>
    </div>
  );
}

function TopologyGroup({
  label,
  tone = "muted",
  children,
}: {
  label: string;
  tone?: "muted" | "accent";
  children: ReactNode;
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
        {children}
      </div>
    </div>
  );
}

function TopologyCell({
  name,
  detail,
  tone = "muted",
}: {
  name: string;
  detail: string;
  tone?: "muted" | "accent";
}) {
  return (
    <div className="min-w-0 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-canvas)] px-2 py-1.5">
      <span
        className={`block truncate font-mono text-[11px] ${
          tone === "accent"
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text)]"
        }`}
      >
        {name}
      </span>
      <span className="block truncate font-mono text-[9px] text-[var(--color-text-subtle)]">
        {detail}
      </span>
    </div>
  );
}

function TopologyScreen({ name, state }: { name: string; state: ScreenState }) {
  const lit = state !== "asleep";
  const dot =
    state === "you"
      ? "var(--color-accent)"
      : state === "working"
        ? "var(--color-danger)"
        : "var(--color-border-strong)";
  return (
    <div
      className={`min-w-0 rounded-[4px] border px-1.5 pb-1 pt-1.5 ${
        state === "you"
          ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)]"
          : "border-[var(--color-border)] bg-[var(--color-canvas)]"
      }`}
    >
      {/* Tiny monitor: a lit screen shows two "content" bars */}
      <div className="relative mb-1 h-5 overflow-hidden rounded-[2px] border border-[var(--color-border-strong)] bg-[var(--color-canvas-deep)]">
        {lit && (
          <>
            <span className="absolute left-1 right-3 top-1 h-[2px] rounded-full bg-[var(--color-text-subtle)] opacity-50" />
            <span className="absolute left-1 right-5 top-2.5 h-[2px] rounded-full bg-[var(--color-text-subtle)] opacity-30" />
          </>
        )}
        <span
          className="absolute right-1 top-1 h-1 w-1 rounded-full"
          style={{
            background: dot,
            boxShadow: lit ? `0 0 4px ${dot}` : undefined,
          }}
        />
      </div>
      <span className="block truncate font-mono text-[9px] text-[var(--color-text)]">
        {name}
      </span>
      <span
        className={`block truncate font-mono text-[8.5px] ${
          state === "you"
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text-subtle)]"
        }`}
      >
        {SCREEN_STATE_LABEL[state]}
      </span>
    </div>
  );
}

function TopologyBridge() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center md:flex-col md:pb-1 md:pt-5"
    >
      <span className="block h-3 w-px bg-gradient-to-b from-[var(--color-border-strong)] via-[var(--color-accent-dim)] to-[var(--color-border-strong)] md:h-px md:w-4 md:bg-gradient-to-r" />
    </div>
  );
}
