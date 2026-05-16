"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/projects", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export function HeaderNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
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
  );
}
