"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CommandPaletteDialog = lazy(() =>
  import("./command-palette-dialog").then((mod) => ({
    default: mod.CommandPaletteDialog,
  }))
);

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const chordRef = useRef<{ key: string; until: number } | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const openPaletteFresh = useCallback(() => {
    setOpen(true);
  }, []);

  const toggleEngineerMode = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.engineer === "on" ? "off" : "on";
    root.dataset.engineer = next;
    try {
      window.localStorage.setItem("vvr:engineer", next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("vvr:engineer");
      if (saved === "on") {
        document.documentElement.dataset.engineer = "on";
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onOpen = () => openPaletteFresh();
    window.addEventListener("vvr:palette:open", onOpen);
    return () => window.removeEventListener("vvr:palette:open", onOpen);
  }, [openPaletteFresh]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          close();
        } else {
          openPaletteFresh();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === ".") {
        e.preventDefault();
        toggleEngineerMode();
        return;
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
        return;
      }

      if (open || inField) return;

      const now = Date.now();
      if (chordRef.current && chordRef.current.until > now) {
        if (chordRef.current.key === "g") {
          if (e.key === "h") router.push("/");
          else if (e.key === "p") router.push("/projects");
          else if (e.key === "a") router.push("/about");
          else if (e.key === "c") router.push("/contact");
          chordRef.current = null;
          return;
        }
      }

      if (e.key === "g") {
        chordRef.current = { key: "g", until: now + 900 };
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, router, toggleEngineerMode, openPaletteFresh]);

  if (!open) return null;

  return (
    <Suspense fallback={null}>
      <CommandPaletteDialog onClose={close} />
    </Suspense>
  );
}
