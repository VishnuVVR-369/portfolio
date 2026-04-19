"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "actions" | "external";
  run: () => void;
  keywords?: string;
};

const EMAIL = "vishnuvardhanganji@gmail.com";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chordRef = useRef<{ key: string; until: number } | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIdx(0);
  }, []);

  const openPaletteFresh = useCallback(() => {
    setOpen(true);
    setActiveIdx(0);
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

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* clipboard blocked */
    }
  }, []);

  const actions = useMemo<Action[]>(
    () => [
      {
        id: "nav-home",
        label: "go to home",
        hint: "g h",
        group: "navigate",
        keywords: "/ index landing",
        run: () => router.push("/"),
      },
      {
        id: "nav-projects",
        label: "go to projects",
        hint: "g p",
        group: "navigate",
        keywords: "/projects work case studies",
        run: () => router.push("/projects"),
      },
      {
        id: "nav-about",
        label: "go to about",
        hint: "g a",
        group: "navigate",
        keywords: "/about bio manifesto",
        run: () => router.push("/about"),
      },
      {
        id: "nav-contact",
        label: "go to contact",
        hint: "g c",
        group: "navigate",
        keywords: "/contact reach hire",
        run: () => router.push("/contact"),
      },
      {
        id: "act-copy-email",
        label: "copy email address",
        hint: EMAIL,
        group: "actions",
        keywords: "mail message inbox copy",
        run: () => void copyEmail(),
      },
      {
        id: "act-engineer",
        label: "toggle engineer mode",
        hint: "⌘ .",
        group: "actions",
        keywords: "debug source paths overlay",
        run: toggleEngineerMode,
      },
      {
        id: "ext-github",
        label: "open github",
        hint: "↗",
        group: "external",
        keywords: "git code source",
        run: () =>
          window.open(
            "https://github.com/VishnuVVR-369",
            "_blank",
            "noreferrer"
          ),
      },
      {
        id: "ext-linkedin",
        label: "open linkedin",
        hint: "↗",
        group: "external",
        keywords: "social profile work",
        run: () =>
          window.open(
            "https://www.linkedin.com/in/vishnu-vvr",
            "_blank",
            "noreferrer"
          ),
      },
      {
        id: "ext-resume",
        label: "open resume (pdf)",
        hint: "↗",
        group: "external",
        keywords: "cv resume hire",
        // TODO(vishnu): replace with actual resume URL when uploaded.
        run: () => window.open("/resume.pdf", "_blank", "noreferrer"),
      },
    ],
    [router, copyEmail, toggleEngineerMode]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => {
      const hay = `${a.label} ${a.keywords ?? ""} ${a.hint ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [actions, query]);

  // Restore engineer mode on mount.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("vvr:engineer");
      if (saved === "on") document.documentElement.dataset.engineer = "on";
    } catch {
      /* ignore */
    }
  }, []);

  // Listen for the open event from header button + global shortcuts.
  useEffect(() => {
    const onOpen = () => openPaletteFresh();
    window.addEventListener("vvr:palette:open", onOpen);
    return () => window.removeEventListener("vvr:palette:open", onOpen);
  }, [openPaletteFresh]);

  // Global keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // ⌘K / Ctrl+K — open palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openPaletteFresh();
        return;
      }

      // ⌘. — toggle engineer mode
      if ((e.metaKey || e.ctrlKey) && e.key === ".") {
        e.preventDefault();
        toggleEngineerMode();
        return;
      }

      // Esc — close
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
        return;
      }

      // g-prefix chords (g h / g p / g a / g c) — only when not typing
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

  // Focus the input when opened (no setState here — purely DOM side-effect).
  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  const groupOrder: Action["group"][] = ["navigate", "actions", "external"];
  const grouped = groupOrder
    .map((group) => ({ group, items: filtered.filter((a) => a.group === group) }))
    .filter((g) => g.items.length > 0);

  // Build a flat ordered list mirroring the rendered order.
  const flat: Action[] = grouped.flatMap((g) => g.items);
  const safeIdx = Math.min(activeIdx, Math.max(0, flat.length - 1));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = flat[safeIdx];
      if (action) {
        action.run();
        close();
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[18vh]"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-[color:rgba(8,8,9,0.7)] backdrop-blur-sm"
        onClick={close}
      />

      {/* panel */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
            ⌘
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="type a command, route, or 'email'…"
            className="!w-full !border-0 !bg-transparent !p-0 !py-3.5 font-mono !text-[13px] !text-[var(--color-text)] placeholder:!text-[var(--color-text-subtle)] focus:!outline-none"
            spellCheck={false}
            autoComplete="off"
          />
          <span
            className="kbd hidden sm:inline-flex"
            style={{ minWidth: "auto" }}
          >
            esc
          </span>
        </div>

        <div className="max-h-[55vh] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="px-4 py-6 font-mono text-xs text-[var(--color-text-subtle)]">
              no matches. try `home`, `projects`, `email`.
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.group} className="px-2 py-1">
                <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                  {g.group}
                </div>
                {g.items.map((a) => {
                  const idxInFlat = flat.indexOf(a);
                  const isActive = idxInFlat === safeIdx;
                  return (
                    <button
                      key={a.id}
                      onClick={() => {
                        a.run();
                        close();
                      }}
                      onMouseEnter={() => setActiveIdx(idxInFlat)}
                      className={`flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left font-mono text-[13px] transition-colors ${
                        isActive
                          ? "bg-[var(--color-surface-inset)] text-[var(--color-accent)]"
                          : "text-[var(--color-text)] hover:bg-[var(--color-surface-inset)]"
                      }`}
                    >
                      <span>{a.label}</span>
                      {a.hint && (
                        <span
                          className={`truncate font-mono text-[11px] ${
                            isActive
                              ? "text-[var(--color-accent-dim)]"
                              : "text-[var(--color-text-subtle)]"
                          }`}
                        >
                          {a.hint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-2 font-mono text-[10px] text-[var(--color-text-subtle)]">
          <div className="flex items-center gap-2">
            <span className="kbd" style={{ minWidth: "auto" }}>
              ↑
            </span>
            <span className="kbd" style={{ minWidth: "auto" }}>
              ↓
            </span>
            <span>navigate</span>
            <span aria-hidden>·</span>
            <span className="kbd" style={{ minWidth: "auto" }}>
              ↵
            </span>
            <span>select</span>
          </div>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
