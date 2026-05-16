import Link from "next/link";

export const metadata = {
  title: "404 — route not deployed",
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-start justify-center pt-16 pb-20 md:pt-24 md:pb-32">
      <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
        404 · routing diff
      </p>

      <h1 className="mt-6 font-display text-[2.5rem] font-medium leading-[1.0] tracking-tight text-[var(--color-text)] sm:text-5xl md:text-7xl">
        not in the build.
      </h1>

      <div className="mt-10 w-full max-w-xl space-y-1.5 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 font-mono text-[13px] sm:p-6">
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
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2.5 font-mono text-[13px] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-text)] active:translate-y-px"
        >
          ← back home
        </Link>
        <Link
          href="/projects"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--color-border-strong)] px-4 py-2.5 font-mono text-[13px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] active:translate-y-px"
        >
          read the case studies →
        </Link>
      </div>
    </section>
  );
}
