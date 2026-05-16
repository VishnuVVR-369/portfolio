"use client";

import { useState } from "react";
import { Select } from "../components/select";

type Status = "idle" | "submitting" | "sent" | "error";

const ROLE_TYPES = [
  { value: "full-time", label: "full-time role" },
  { value: "contract", label: "contract / consulting" },
  { value: "advisory", label: "advisory / fractional" },
  { value: "collab", label: "collaboration / project" },
  { value: "saying-hi", label: "just saying hi" },
];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      // TODO(vishnu): wire this up to a real handler — Resend, a route handler,
      // a serverless function, or a forwarding service like Formspree.
      // For now: simulate a network round-trip and log to console.
      const formData = new FormData(e.currentTarget);
      const payload = Object.fromEntries(formData.entries());
      console.info("[contact-form/stub]", payload);
      await new Promise((r) => setTimeout(r, 700));
      setStatus("sent");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="surface space-y-7 p-6 md:p-8"
    >
      <header className="flex flex-col items-start gap-1 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
          new message
        </p>
        <p className="font-mono text-[11px] text-[var(--color-text-subtle)]">
          fields without a hint are optional
        </p>
      </header>

      {/* Name + email row */}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="your name" hint="required">
          <input
            type="text"
            name="name"
            required
            placeholder="ada lovelace"
            autoComplete="name"
          />
        </Field>
        <Field label="email" hint="required">
          <input
            type="email"
            name="email"
            required
            placeholder="ada@analytical-engine.org"
            autoComplete="email"
          />
        </Field>
      </div>

      {/* Role-type + company */}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="kind" hint="required">
          <Select
            name="role-type"
            required
            placeholder="what kind of conversation?"
            options={ROLE_TYPES}
          />
        </Field>
        <Field label="company / org">
          <input
            type="text"
            name="company"
            placeholder="acme co."
            autoComplete="organization"
          />
        </Field>
      </div>

      {/* Message */}
      <Field label="what's this about?" hint="required">
        <textarea
          name="message"
          required
          rows={6}
          placeholder="the punchier the better. what's the problem, what's the constraint, what would success look like?"
          className="resize-y"
        />
      </Field>

      {/* Footer / submit */}
      <div className="flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] pt-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="cta-accent min-h-[44px] px-5 text-[13px] disabled:cursor-wait disabled:opacity-50"
        >
          <span>
            {status === "submitting"
              ? "sending…"
              : status === "sent"
                ? "sent — thanks"
                : status === "error"
                  ? "try again"
                  : "send message"}
          </span>
          <span aria-hidden>→</span>
        </button>
        <span
          aria-live="polite"
          className="font-mono text-[11px] text-[var(--color-text-subtle)]"
        >
          {status === "sent"
            ? "i'll reply within 48 hours."
            : status === "error"
              ? "something went wrong. try the email instead."
              : "encrypted in transit. no third-party trackers."}
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {label}
        </span>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)]">
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}
