import {
  EMAIL,
  GITHUB_URL,
  LEETCODE_URL,
  LINKEDIN_URL,
  NOW,
  RESUME_URL,
} from "@/lib/identity";
import {
  DocumentIcon,
  GitHubIcon,
  LeetCodeIcon,
  LinkedInIcon,
  MailIcon,
} from "./social-icons";

const LAST_EDITED = "2026-05-11";
const YEAR = 2026;

// Five-link social cluster. Icon + label, monochrome, hover → accent.
const SOCIAL = [
  {
    label: "github",
    href: GITHUB_URL,
    Icon: GitHubIcon,
    external: true,
  },
  {
    label: "linkedin",
    href: LINKEDIN_URL,
    Icon: LinkedInIcon,
    external: true,
  },
  {
    label: "leetcode",
    href: LEETCODE_URL,
    Icon: LeetCodeIcon,
    external: true,
  },
  {
    label: "resume",
    href: RESUME_URL,
    Icon: DocumentIcon,
    external: true,
  },
  {
    label: "email",
    href: `mailto:${EMAIL}`,
    Icon: MailIcon,
    external: false,
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-0 border-t border-[var(--color-border)]">
      <div className="container-page py-14">
        {/* Now line — the line that makes the site feel alive.
            Three rows: building / reading / verifying.  */}
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              now
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="diff diff-add">
                <span className="diff-body">
                  <span className="text-[var(--color-text-muted)]">
                    building ·{" "}
                  </span>
                  {NOW.building}
                </span>
              </div>
              <div className="diff diff-meta">
                <span className="diff-body">
                  <span className="text-[var(--color-text-muted)]">
                    reading ·{" "}
                  </span>
                  {NOW.reading}
                </span>
              </div>
              <div className="diff diff-meta">
                <span className="diff-body">
                  <span className="text-[var(--color-text-muted)]">
                    verifying ·{" "}
                  </span>
                  {NOW.verifying}
                </span>
              </div>
            </div>
          </div>

          {/* Five-icon social cluster */}
          <nav
            aria-label="Social"
            className="flex flex-wrap items-start gap-2"
          >
            {SOCIAL.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="group inline-flex h-9 items-center gap-2 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 font-mono text-[12px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)]"
                style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)" }}
              >
                <Icon size={13} className="opacity-80 group-hover:opacity-100" />
                <span>{label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Hairline */}
        <div className="mt-12 border-t border-[var(--color-border)]" />

        {/* Bottom row — pure metadata, no slogans */}
        <div className="mt-6 flex flex-col items-start justify-between gap-3 font-mono text-[11px] text-[var(--color-text-subtle)] md:flex-row md:items-center">
          <div className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {YEAR} vishnuvardhan reddy</span>
            <span aria-hidden className="hidden sm:inline">·</span>
            <a
              href={`mailto:${EMAIL}`}
              className="min-w-0 break-all transition-colors hover:text-[var(--color-accent)]"
            >
              {EMAIL}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
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
