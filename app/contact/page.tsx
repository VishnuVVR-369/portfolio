import type { Metadata } from "next";
import { routeMetadata } from "@/lib/seo";
import {
  EMAIL,
  GITHUB_URL,
  LEETCODE_URL,
  LINKEDIN_URL,
} from "@/lib/identity";
import { Reveal } from "../components/reveal";
import { CopyButton } from "../components/copy-button";
import { ContactForm } from "./contact-form";
import {
  GitHubIcon,
  LeetCodeIcon,
  LinkedInIcon,
} from "../components/social-icons";

export const metadata: Metadata = routeMetadata({
  title: "Contact",
  description:
    "Contact Vishnuvardhan Reddy about software engineering roles, product engineering work, collaborations, or interesting technical problems.",
  path: "/contact",
});

const ELSEWHERE = [
  { label: "github", href: GITHUB_URL, Icon: GitHubIcon },
  { label: "linkedin", href: LINKEDIN_URL, Icon: LinkedInIcon },
  { label: "leetcode", href: LEETCODE_URL, Icon: LeetCodeIcon },
];

export default function ContactPage() {
  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pt-12 pb-10 md:px-6 md:pt-20">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                /contact
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-3 font-display text-[3rem] font-medium leading-[0.98] tracking-[-0.03em] text-[var(--color-text)] sm:text-[4rem] md:text-[5rem]">
                let&apos;s talk
                <span className="text-[var(--color-accent)]">.</span>
              </h1>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <span className="pill pill-signal">
              <span aria-hidden className="pill-dot" />
              <span>inbox open</span>
            </span>
          </Reveal>
        </div>
        <Reveal delay={140}>
          <p className="mt-6 max-w-2xl text-pretty text-[var(--color-text-muted)] md:text-[1.05rem] md:leading-relaxed">
            Use the form for context, or copy the address and write me
            directly — both reach the same inbox. Reply within a day on
            weekdays.
          </p>
        </Reveal>
      </section>

      {/* ═══ FORM + SIDE RAIL ═══════════════════════════════════════ */}
      <section className="mx-auto max-w-[76rem] px-5 pb-24 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-10">
          <Reveal delay={180}>
            <ContactForm />
          </Reveal>

          <Reveal delay={240}>
            <aside className="surface lit-edge relative space-y-6 overflow-hidden p-6 md:p-7">
              {/* Direct email */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  direct
                </p>
                <div className="surface-recess mt-3 p-3">
                  <CopyButton value={EMAIL} className="w-full" />
                </div>
                <p className="mt-2 font-mono text-[11px] text-[var(--color-text-subtle)]">
                  click to copy. short emails get short replies fast.
                </p>
              </div>

              {/* Elsewhere */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  elsewhere
                </p>
                <ul className="mt-3 space-y-2">
                  {ELSEWHERE.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between rounded-md border border-[var(--color-border-strong)] bg-[var(--color-canvas-deep)] px-3 py-2 font-mono text-[12px] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)]"
                        style={{
                          boxShadow:
                            "inset 0 1px 0 0 rgba(255,255,255,0.045)",
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon
                            size={13}
                            className="opacity-80 group-hover:opacity-100"
                          />
                          <span>{label}</span>
                        </span>
                        <span
                          aria-hidden
                          className="flex-shrink-0 text-[var(--color-text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                        >
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Response time */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  response time
                </p>
                <p className="mt-3 font-mono text-[12px] text-[var(--color-text)]">
                  &lt; 24 hours, mon–fri.
                </p>
                <p className="mt-1 font-mono text-[11px] text-[var(--color-text-subtle)]">
                  weekends are for the side projects.
                </p>
              </div>

              {/* What to expect */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  what to expect
                </p>
                <p className="mt-3 text-pretty text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                  Short reply, fast. If your note has a clear ask, mine
                  will too. If it&apos;s ambiguous, expect questions
                  before answers.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
