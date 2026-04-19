"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "home", index: "00" },
  { href: "/projects", label: "projects", index: "01" },
  { href: "/about", label: "about", index: "02" },
  { href: "/contact", label: "contact", index: "03" },
];

const EMAIL = "vishnuvardhanganji@gmail.com";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");
  const [emailCopied, setEmailCopied] = useState(false);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Tick the clock when open.
  useEffect(() => {
    if (!open) return;
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()) + " ist"
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [open]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const openPalette = () => {
    onClose();
    // wait for the close animation so focus moves cleanly.
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("vvr:palette:open"));
    }, 80);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-50 flex flex-col bg-[var(--color-canvas)]"
      style={{ animation: "vvr-fade-in 180ms ease-out" }}
    >
      {/* Top bar — mirrors the desktop status line so the chrome feels continuous. */}
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-5">
        <div className="flex items-center gap-2.5 font-mono text-[12px] text-[var(--color-text)]">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[5px] border border-[var(--color-accent-dim)] bg-[var(--color-surface-inset)] text-[12px] font-semibold text-[var(--color-accent)]"
          >
            v
          </span>
          <span>~/vvr.dev</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)]"
        >
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Primary nav — large tappable rows, indexed. */}
        <nav aria-label="Primary" className="border-b border-[var(--color-border)]">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-5 transition-colors last:border-b-0 active:bg-[var(--color-surface)]"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                    /{item.index}
                  </span>
                  <span
                    className={`font-display text-3xl font-medium tracking-tight ${
                      active
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  aria-hidden
                  className={`font-mono text-lg ${
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-subtle)]"
                  }`}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Direct actions */}
        <section className="border-b border-[var(--color-border)] px-5 py-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            actions
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={copyEmail}
              className="flex w-full items-center justify-between gap-3 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 text-left font-mono text-[13px] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)]"
            >
              <span className="min-w-0 truncate">
                {emailCopied ? "copied to clipboard" : "copy email"}
              </span>
              <span
                aria-hidden
                className={`flex-shrink-0 font-mono text-[11px] uppercase tracking-wider ${
                  emailCopied
                    ? "text-[var(--color-signal)]"
                    : "text-[var(--color-text-subtle)]"
                }`}
              >
                {emailCopied ? "ok" : "tap"}
              </span>
            </button>

            <button
              type="button"
              onClick={openPalette}
              className="flex w-full items-center justify-between gap-3 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 text-left font-mono text-[13px] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)]"
            >
              <span>open command palette</span>
              <span
                aria-hidden
                className="flex-shrink-0 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-subtle)]"
              >
                ⌘k
              </span>
            </button>

            <a
              // TODO(vishnu): swap to your real resume URL.
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex w-full items-center justify-between gap-3 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 text-left font-mono text-[13px] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)]"
            >
              <span>download resume</span>
              <span
                aria-hidden
                className="flex-shrink-0 text-[var(--color-text-subtle)]"
              >
                ↗
              </span>
            </a>
          </div>
        </section>

        {/* Social */}
        <section className="border-b border-[var(--color-border)] px-5 py-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            elsewhere
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://github.com/VishnuVVR-369"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex items-center justify-between rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 font-mono text-[13px] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)]"
            >
              <span>github</span>
              <span aria-hidden className="text-[var(--color-text-subtle)]">
                ↗
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/vishnu-vvr"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex items-center justify-between rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 font-mono text-[13px] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)]"
            >
              <span>linkedin</span>
              <span aria-hidden className="text-[var(--color-text-subtle)]">
                ↗
              </span>
            </a>
          </div>
        </section>
      </div>

      {/* Footer status */}
      <footer className="border-t border-[var(--color-border)] px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-[var(--color-text-subtle)]">
          <span className="inline-flex items-center gap-1.5 text-[var(--color-signal)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]"
            />
            <span>open to inbound</span>
          </span>
          <span aria-hidden>·</span>
          <span>bangalore</span>
          <span aria-hidden>·</span>
          <span suppressHydrationWarning className="tabular-nums">
            {time || "··:·· ist"}
          </span>
        </div>
      </footer>
    </div>
  );
}
