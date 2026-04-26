import type { Metadata } from "next";
import { routeMetadata } from "@/lib/seo";
import { Reveal } from "../components/reveal";
import { CopyButton } from "../components/copy-button";
import { ContactForm } from "./contact-form";

const EMAIL = "vishnuvardhanganji@gmail.com";

export const metadata: Metadata = routeMetadata({
  title: "Contact",
  description:
    "Contact Vishnuvardhan Reddy about software engineering roles, product engineering work, collaborations, or interesting technical problems.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section
        data-source="app/contact/page.tsx › Hero"
        className="container-page pt-20 pb-10 md:pt-28"
      >
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                /contact
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-4 font-display text-5xl font-medium leading-[1.0] tracking-[-0.035em] text-[var(--color-text)] md:text-7xl">
                let&apos;s talk
                <span className="text-[var(--color-accent)]">.</span>
              </h1>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-signal)]">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
              />
              <span>inbox open</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={140}>
          <p className="mt-6 max-w-2xl text-pretty text-[var(--color-text-muted)] md:text-lg">
            Use the form for context, or copy the address and write me
            directly. Either way reaches the same inbox; the form just gives
            me a head start on understanding why you&apos;re here.
          </p>
        </Reveal>
      </section>

      {/* ─── Form + side rail ───────────────────────────────────── */}
      <section className="container-page pb-24">
        <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,18rem)] md:gap-12">
          {/* Form */}
          <Reveal delay={180}>
            <ContactForm />
          </Reveal>

          {/* Side rail */}
          <Reveal delay={240}>
            <aside
              data-source="contact › DirectChannels"
              className="space-y-7 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              {/* Direct email */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  direct
                </p>
                <div className="mt-3 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-canvas)]/40 p-3">
                  <CopyButton value={EMAIL} className="w-full" />
                </div>
                <p className="mt-2 font-mono text-[11px] text-[var(--color-text-subtle)]">
                  click to copy. read every message that doesn&apos;t look
                  bulk-sent.
                </p>
              </div>

              {/* Elsewhere */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  elsewhere
                </p>
                <ul className="mt-3 space-y-2.5 font-mono text-[13px]">
                  <li>
                    <a
                      href="https://github.com/VishnuVVR-369"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      <span className="truncate">github</span>
                      <span
                        aria-hidden
                        className="flex-shrink-0 text-[var(--color-text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/vishnu-vvr"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      <span className="truncate">linkedin</span>
                      <span
                        aria-hidden
                        className="flex-shrink-0 text-[var(--color-text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Response time */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  response time
                </p>
                <p className="mt-3 font-mono text-[12px] text-[var(--color-text)]">
                  &lt; 48 hours, mon–fri.
                </p>
                <p className="mt-1 font-mono text-[11px] text-[var(--color-text-subtle)]">
                  weekends are for the side projects.
                </p>
              </div>

              {/* What to expect — small editorial note */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  what to expect
                </p>
                <p className="mt-3 text-pretty text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                  Short reply, fast. If your note has a clear ask, mine
                  will too. If it&apos;s ambiguous, expect questions before
                  answers.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
