// Pages can pass their own "last edited" date via a custom event,
// but for now we use a single build constant.
const LAST_EDITED = "2026-04-19";
const YEAR = 2026; // bump on Jan 1.

// Now-line — the line that makes the site feel alive.
// Update this string when context changes; the rest of the site stays static.
const NOW = {
  building: "RAG eval harness for Chat with PDF v2.",
  reading: "Designing Data-Intensive Applications, again.",
};

const SOCIAL = [
  { label: "github", href: "https://github.com/VishnuVVR-369" },
  { label: "linkedin", href: "https://www.linkedin.com/in/vishnu-vvr" },
  { label: "email", href: "mailto:vishnuvardhanganji@gmail.com" },
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-[var(--color-border)]">
      <div className="container-page py-12">
        {/* Now line */}
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
              now
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="diff diff-add">
                <span>building · {NOW.building}</span>
              </div>
              <div className="diff diff-meta">
                <span>reading · {NOW.reading}</span>
              </div>
            </div>
          </div>

          <nav
            aria-label="Social"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px]"
          >
            {SOCIAL.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Hairline */}
        <div className="mt-10 border-t border-[var(--color-border)]" />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col items-start justify-between gap-3 font-mono text-[11px] text-[var(--color-text-subtle)] md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {YEAR} vishnuvardhan reddy.</span>
            <span aria-hidden>·</span>
            <span>built with judgment, not a template.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>last edited · {LAST_EDITED}</span>
            <span aria-hidden>·</span>
            <span>v1.0.0</span>
            <span aria-hidden className="hidden md:inline">
              ·
            </span>
            <span className="hidden md:inline">
              <span className="kbd" style={{ minWidth: "auto" }}>
                ⌘
              </span>{" "}
              <span className="kbd" style={{ minWidth: "auto" }}>
                .
              </span>{" "}
              engineer mode
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
