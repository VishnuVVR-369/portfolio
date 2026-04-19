import Link from "next/link";

export const metadata = {
  title: "404 — route not deployed",
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-start justify-center pt-24 pb-32">
      <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
        404 · routing diff
      </p>

      <h1 className="mt-6 font-display text-5xl font-medium leading-[1.0] tracking-tight text-[var(--color-text)] md:text-7xl">
        not in the build.
      </h1>

      <div className="mt-10 w-full max-w-xl space-y-1.5 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 font-mono text-[13px]">
        <div className="diff diff-remove">
          <span>this route was never deployed.</span>
        </div>
        <div className="diff diff-add">
          <span>but / is, and so is /projects.</span>
        </div>
        <div className="diff diff-meta">
          <span>or press ⌘k and search anything.</span>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2.5 font-mono text-[13px] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-text)]"
        >
          ← back home
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-strong)] px-4 py-2.5 font-mono text-[13px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)]"
        >
          read the case studies →
        </Link>
      </div>
    </section>
  );
}
