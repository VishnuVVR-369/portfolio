"use client";

import { usePathname } from "next/navigation";

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <>
      <span aria-hidden className="hidden text-[var(--color-text-subtle)] sm:inline">
        ›
      </span>
      <span className="hidden truncate text-[var(--color-text-subtle)] sm:inline">
        {pathname.replace(/^\//, "")}
      </span>
    </>
  );
}
