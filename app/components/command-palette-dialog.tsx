"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EMAIL,
  GITHUB_URL,
  LEETCODE_URL,
  LINKEDIN_URL,
  RESUME_URL,
} from "@/lib/identity";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "actions" | "external";
  run: () => void;
  keywords?: string;
};

interface CommandPaletteDialogProps {
  onClose: () => void;
}

export function CommandPaletteDialog({
  onClose,
}: CommandPaletteDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
        id: "nav-work",
        label: "go to work",
        hint: "g p",
        group: "navigate",
        keywords: "/projects work case studies projects",
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
        keywords: "grid overlay graph paper debug",
        run: toggleEngineerMode,
      },
      {
        id: "ext-github",
        label: "open github",
        hint: "↗",
        group: "external",
        keywords: "git code source",
        run: () => window.open(GITHUB_URL, "_blank", "noreferrer"),
      },
      {
        id: "ext-linkedin",
        label: "open linkedin",
        hint: "↗",
        group: "external",
        keywords: "social profile work",
        run: () => window.open(LINKEDIN_URL, "_blank", "noreferrer"),
      },
      {
        id: "ext-leetcode",
        label: "open leetcode",
        hint: "guardian · 2150+",
        group: "external",
        keywords: "leetcode guardian algorithms practice",
        run: () => window.open(LEETCODE_URL, "_blank", "noreferrer"),
      },
      {
        id: "ext-resume",
        label: "open resume (pdf)",
        hint: "↗",
        group: "external",
        keywords: "cv resume hire",
        run: () => window.open(RESUME_URL, "_blank", "noreferrer"),
      },
    ],
    [router, copyEmail, toggleEngineerMode]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((action) => {
      const haystack =
        `${action.label} ${action.keywords ?? ""} ${action.hint ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [actions, query]);

  useEffect(() => {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const groupOrder: Action["group"][] = ["navigate", "actions", "external"];
  const grouped = groupOrder
    .map((group) => ({
      group,
      items: filtered.filter((action) => action.group === group),
    }))
    .filter((group) => group.items.length > 0);

  const flat: Action[] = grouped.flatMap((group) => group.items);
  const safeIdx = Math.min(activeIdx, Math.max(0, flat.length - 1));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((idx) => Math.min(idx + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((idx) => Math.max(0, idx - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = flat[safeIdx];
      if (action) {
        action.run();
        onClose();
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
      <div
        className="absolute inset-0 bg-[color:rgba(8,8,9,0.7)] backdrop-blur-sm"
        onClick={onClose}
      />

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
            grouped.map((group) => (
              <div key={group.group} className="px-2 py-1">
                <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">
                  {group.group}
                </div>
                {group.items.map((action) => {
                  const idxInFlat = flat.indexOf(action);
                  const isActive = idxInFlat === safeIdx;

                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.run();
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIdx(idxInFlat)}
                      className={`flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left font-mono text-[13px] transition-colors ${
                        isActive
                          ? "bg-[var(--color-surface-inset)] text-[var(--color-accent)]"
                          : "text-[var(--color-text)] hover:bg-[var(--color-surface-inset)]"
                      }`}
                    >
                      <span>{action.label}</span>
                      {action.hint && (
                        <span
                          className={`truncate font-mono text-[11px] ${
                            isActive
                              ? "text-[var(--color-accent-dim)]"
                              : "text-[var(--color-text-subtle)]"
                          }`}
                        >
                          {action.hint}
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
