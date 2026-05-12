import { stack } from "@/lib/stack";
import { getStackIcon } from "./stack-icons";

interface StackGridProps {
  className?: string;
}

// Full stack rendered as a grid of categorized cards. Each tech entry
// is a chip with a monochrome brand glyph + name + tier badge.
//
// Categories are rendered as small section blocks; within each, the
// chips wrap fluidly. The "daily" tier is highlighted in amber so
// the eye picks up actively-used tools first.
export function StackGrid({ className = "" }: StackGridProps) {
  return (
    <div className={`grid gap-3 sm:gap-4 md:grid-cols-2 ${className}`}>
      {stack.map((category) => (
        <section
          key={category.name}
          className="surface flex flex-col p-5 md:p-6"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h3 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
              {category.name}
            </h3>
            <span className="tabular font-mono text-[10.5px] text-[var(--color-text-subtle)]">
              {String(category.skills.length).padStart(2, "0")}
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {category.skills.map((skill) => {
              const Icon = getStackIcon(skill.name);
              const isDaily = skill.tier === "daily";
              return (
                <li
                  key={skill.name}
                  className={`group flex items-start gap-3 rounded-md border bg-[var(--color-canvas-deep)] p-3 transition-colors ${
                    isDaily
                      ? "border-[var(--color-accent-dim)]/40"
                      : "border-[var(--color-border)]"
                  }`}
                  style={{
                    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.025)",
                  }}
                >
                  <span
                    className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[5px] border ${
                      isDaily
                        ? "border-[var(--color-accent-dim)] text-[var(--color-accent)]"
                        : "border-[var(--color-border-strong)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`font-display text-[14px] font-medium tracking-tight ${
                          isDaily
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text)]"
                        }`}
                      >
                        {skill.name}
                      </span>
                      <span
                        className={`flex-shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] ${
                          isDaily
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-text-subtle)]"
                        }`}
                      >
                        {skill.tier === "daily" ? "daily" : "shipped"}
                      </span>
                    </div>
                    <p className="mt-1 text-pretty text-[12.5px] leading-snug text-[var(--color-text-muted)]">
                      {skill.opinion}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
