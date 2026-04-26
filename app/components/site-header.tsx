"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  { href: "/", label: "home", chord: "g h" },
  { href: "/projects", label: "projects", chord: "g p" },
  { href: "/about", label: "about", chord: "g a" },
  { href: "/contact", label: "contact", chord: "g c" },
];

// Status-line header. Reads like a terminal prompt — sets the
// engineering-auteur tone before any content loads.
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
      // Hyderabad time — the user's actual locale, not the visitor's.
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

  // Open the command palette by dispatching a window event.
  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("vvr:palette:open"));
  };

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color:rgba(10,10,11,0.78)] backdrop-blur-md"
      >
        <div className="container-page flex h-14 items-center justify-between gap-3 font-mono text-[12px] text-[var(--color-text-muted)] md:h-12 md:gap-6">
          {/* Left: identity + path */}
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
            <span
              aria-hidden
              className="hidden text-[var(--color-text-subtle)] sm:inline"
            >
              ·
            </span>
            <span className="hidden truncate text-[var(--color-text-subtle)] sm:inline">
              {pathname === "/" ? "" : pathname}
            </span>
          </div>

          {/* Center: nav (desktop only) */}
          <nav
            className="hidden items-center gap-5 md:flex"
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
                  className={`group flex items-center gap-1.5 transition-colors ${
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden
                    className="kbd hidden lg:inline-flex"
                    style={{ minWidth: "auto" }}
                  >
                    {item.chord}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right: time + palette + mobile menu */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <span
              className="hidden text-[var(--color-text-subtle)] tabular-nums sm:inline"
              suppressHydrationWarning
            >
              {now || "··:·· ist"}
            </span>

            {/* Command palette — desktop emphasises the kbd hint */}
            <button
              type="button"
              onClick={openPalette}
              className="hidden h-8 items-center gap-1.5 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] md:inline-flex"
              aria-label="Open command palette"
            >
              <span>⌘</span>
              <span>k</span>
            </button>

            {/* Mobile: full-screen menu trigger — 44px touch target. */}
            <button
              type="button"
              onClick={openMenu}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)] active:text-[var(--color-accent)] md:hidden"
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
