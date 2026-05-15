"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GuardianBadge } from "./guardian-badge";
import { ResumeButton } from "./resume-button";

const logoMaskStyle = {
  WebkitMaskImage: "url(/logo.svg)",
  maskImage: "url(/logo.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
} as const;

const MobileMenu = dynamic(
  () => import("./mobile-menu").then((mod) => mod.MobileMenu),
  { ssr: false }
);

const NAV = [
  { href: "/projects", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

// Status-line header. Reads like an instrument panel — slim, dense,
// honest. Three regions: identity left, nav center, action+signal right.
export function SiteHeader() {
  const pathname = usePathname();
  const [now, setNow] = useState<string>("");

  // Menu open state is encoded as the pathname-at-which-menu-was-opened.
  // When the route changes (link click, back button, anywhere), the
  // openedAt no longer matches the current path, so the menu derives
  // closed without needing a route-listening effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const mobileMenuOpen = openedAt !== null && openedAt === pathname;
  const openMenu = () => setOpenedAt(pathname);
  const closeMenu = () => setOpenedAt(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(d) + " ist"
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("vvr:palette:open"));
  };

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color:rgba(10,10,11,0.82)] backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-[76rem] items-center justify-between gap-3 px-5 font-mono text-[12px] text-[var(--color-text-muted)] md:h-14 md:px-6">
          {/* Left: identity + breadcrumb path */}
          <div className="flex min-w-0 items-center gap-3 overflow-hidden">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
              aria-label="Home"
            >
              <span
                aria-hidden
                className="block h-7 w-[56px] flex-shrink-0 bg-[var(--color-accent)] transition-opacity group-hover:opacity-85"
                style={logoMaskStyle}
              />
              <span className="hidden sm:inline">~/vvr.dev</span>
            </Link>
            {pathname !== "/" && (
              <>
                <span
                  aria-hidden
                  className="hidden text-[var(--color-text-subtle)] sm:inline"
                >
                  ›
                </span>
                <span className="hidden truncate text-[var(--color-text-subtle)] sm:inline">
                  {pathname.replace(/^\//, "")}
                </span>
              </>
            )}
          </div>

          {/* Center: nav (desktop only) — 3 items, no chord chrome */}
          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex h-14 items-center transition-colors ${
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span>{item.label}</span>
                  {/* underline accent — only on active route */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-px left-0 right-0 h-[1px] bg-[var(--color-accent)]"
                      style={{ boxShadow: "0 0 8px rgba(245,180,84,0.6)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: signal cluster — guardian, resume, palette, time */}
          <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
            {/* Guardian badge — visible from md up. Highest-density signal. */}
            <div className="hidden md:inline-flex">
              <GuardianBadge variant="compact" />
            </div>

            {/* Resume CTA — visible md+, the primary action for skimmers */}
            <div className="hidden lg:inline-flex">
              <ResumeButton size="sm" />
            </div>

            {/* Command palette — desktop only */}
            <button
              type="button"
              onClick={openPalette}
              className="hidden h-8 items-center gap-1 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] md:inline-flex"
              style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)" }}
              aria-label="Open command palette"
              title="Open command palette (⌘K)"
            >
              <span aria-hidden>⌘</span>
              <span aria-hidden>k</span>
            </button>

            {/* Locale clock — hidden on very narrow viewports */}
            <span
              className="hidden text-[var(--color-text-subtle)] tabular-nums md:inline"
              suppressHydrationWarning
            >
              {now || "··:·· ist"}
            </span>

            {/* Mobile menu trigger — 44px touch target */}
            <button
              type="button"
              onClick={openMenu}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)] active:text-[var(--color-accent)] md:hidden"
              style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)" }}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                aria-hidden
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
              >
                <path
                  d="M0 1H16M0 6H16M0 11H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <MobileMenu open={mobileMenuOpen} onClose={closeMenu} />
      ) : null}
    </>
  );
}
