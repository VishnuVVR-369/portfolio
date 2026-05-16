"use client";

import { usePathname } from "next/navigation";

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  // On mobile, show only the leaf segment so deep routes still announce
  // context (e.g. /projects/voiceflow → "voiceflow"). On sm+ show the
  // full pathname so users can map back to the section.
  const trimmed = pathname.replace(/^\//, "");
  const leaf = trimmed.split("/").filter(Boolean).pop() ?? trimmed;
  return (
    <>
      <span aria-hidden className="text-[var(--color-text-subtle)]">
        ›
      </span>
      <span className="truncate text-[var(--color-text-subtle)] sm:hidden">
        {leaf}
      </span>
      <span className="hidden truncate text-[var(--color-text-subtle)] sm:inline">
        {trimmed}
      </span>
    </>
  );
}
