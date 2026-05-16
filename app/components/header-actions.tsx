"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useNow } from "./use-now";

const MobileMenu = dynamic(
  () => import("./mobile-menu").then((mod) => mod.MobileMenu),
  { ssr: false }
);

export function HeaderActions() {
  const pathname = usePathname();
  const now = useNow();

  // Menu open state is encoded as the pathname-at-which-menu-was-opened.
  // When the route changes, the openedAt no longer matches the current
  // path, so the menu derives closed without a route-listening effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const mobileMenuOpen = openedAt !== null && openedAt === pathname;
  const openMenu = () => setOpenedAt(pathname);
  const closeMenu = () => setOpenedAt(null);

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("vvr:palette:open"));
  };

  return (
    <>
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

      <span
        className="hidden text-[var(--color-text-subtle)] tabular-nums md:inline"
        suppressHydrationWarning
      >
        {now || "··:·· ist"}
      </span>

      <button
        type="button"
        onClick={openMenu}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] transition-colors active:border-[var(--color-accent-dim)] active:text-[var(--color-accent)] md:hidden"
        style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.045)" }}
        aria-label="Open menu"
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <svg aria-hidden width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M0 1H16M0 6H16M0 11H10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {mobileMenuOpen ? (
        <MobileMenu open={mobileMenuOpen} onClose={closeMenu} />
      ) : null}
    </>
  );
}
