"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SelectProps {
  name: string;
  options: SelectOption[];
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
}

// Custom dropdown — keyboard-accessible, fully styled, integrates with
// native form submission via a hidden input. Drop-in replacement for
// <select> that doesn't inherit the OS chrome that breaks the dark theme.
export function Select({
  name,
  options,
  placeholder,
  required = false,
  defaultValue = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [activeIdx, setActiveIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const optionId = (i: number) => `${reactId}-opt-${i}`;

  const selected = options.find((o) => o.value === value);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onMouse = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        listRef.current &&
        !listRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouse);
    return () => document.removeEventListener("mousedown", onMouse);
  }, [open]);

  // Close on Escape (also returns focus to trigger).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // When opening: pre-select current value (or first option) and move focus
  // to the listbox so arrow keys work immediately.
  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => listRef.current?.focus());
    }
  }, [open]);

  const openMenu = () => {
    const idx = options.findIndex((o) => o.value === value);
    setActiveIdx(idx >= 0 ? idx : 0);
    setOpen(true);
  };

  const commit = (idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    setValue(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIdx(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(activeIdx);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="flex w-full items-center justify-between gap-3 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2.5 text-left font-mono text-[14px] transition-colors hover:border-[var(--color-text-subtle)] data-[open=true]:border-[var(--color-accent)]"
        data-open={open || undefined}
      >
        <span
          className={`truncate ${
            selected
              ? "text-[var(--color-text)]"
              : "text-[var(--color-text-subtle)]"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          aria-hidden
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`flex-shrink-0 text-[var(--color-text-subtle)] transition-transform duration-200 ${
            open ? "rotate-180 text-[var(--color-accent)]" : ""
          }`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {/*
        Hidden form-binding input. Uses the same name as a native <select>,
        so server-side handling (and HTML form validation) works unchanged.
      */}
      <input
        type="text"
        name={name}
        value={value}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="!sr-only !pointer-events-none !absolute !h-px !w-px !border-0 !p-0"
        onChange={() => {
          /* controlled — value is set via state */
        }}
      />

      {open && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          aria-activedescendant={
            activeIdx >= 0 ? optionId(activeIdx) : undefined
          }
          className="absolute left-0 right-0 z-30 mt-1.5 max-h-64 overflow-auto rounded-[10px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] focus:outline-none"
          style={{
            animation: "vvr-fade-in 140ms ease-out",
          }}
        >
          {options.map((opt, i) => {
            const isActive = i === activeIdx;
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => commit(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-[6px] px-3 py-2 font-mono text-[13px] transition-colors ${
                  isActive
                    ? "bg-[var(--color-surface-inset)] text-[var(--color-accent)]"
                    : isSelected
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text)] hover:bg-[var(--color-surface-inset)]"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected ? (
                  <svg
                    aria-hidden
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className="flex-shrink-0 text-[var(--color-accent)]"
                  >
                    <path
                      d="M2.5 6.5L5 9L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                ) : (
                  opt.hint && (
                    <span className="flex-shrink-0 font-mono text-[10px] text-[var(--color-text-subtle)]">
                      {opt.hint}
                    </span>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
