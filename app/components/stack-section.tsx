import Link from "next/link";
import { Reveal } from "./reveal";
import { stack, resolveStackProject, stackSkillCount } from "@/lib/stack";

export function StackSection() {
  return (
    <section
      id="stack"
      data-source="app/page.tsx › Stack"
      className="relative scroll-mt-24 py-20 md:py-28"
    >
      <div className="container-page">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
            §02 · the stack
          </p>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-medium tracking-tight text-[var(--color-text)] md:text-5xl">
              {stackSkillCount} tools.
              <br />
              <span className="text-[var(--color-text-muted)]">
                Each one, a defensible opinion.
              </span>
            </h2>
            <p className="hidden max-w-sm text-[var(--color-text-muted)] md:block">
              Recruiters read fast. Engineers read carefully.{" "}
              <span className="text-[var(--color-text)]">This section is for both.</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {stack.map((category) => (
              <div
                key={category.name}
                className="grid gap-y-6 py-7 md:grid-cols-[9rem_1fr] md:gap-x-10 md:py-9"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {category.name}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)]">
                    {category.skills.length}{" "}
                    {category.skills.length === 1 ? "tool" : "tools"}
                  </p>
                </div>

                <ul className="space-y-6 md:space-y-5">
                  {category.skills.map((skill) => {
                    const project = resolveStackProject(skill.name);
                    return (
                      <li
                        key={skill.name}
                        className="grid gap-x-6 gap-y-1.5 md:grid-cols-[8rem_8rem_1fr_auto] md:items-baseline"
                      >
                        <span className="font-display text-[15px] font-medium text-[var(--color-text)] md:text-base">
                          {skill.name}
                        </span>

                        <span
                          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                          aria-label={`tier: ${skill.tier}`}
                        >
                          <span
                            aria-hidden
                            className={
                              skill.tier === "daily"
                                ? "inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-accent)] shadow-[0_0_0_3px_var(--color-accent-glow)]"
                                : "inline-block h-[6px] w-[6px] rounded-full border border-[var(--color-text-subtle)]"
                            }
                          />
                          <span
                            className={
                              skill.tier === "daily"
                                ? "text-[var(--color-accent)]"
                                : "text-[var(--color-text-subtle)]"
                            }
                          >
                            {skill.tier}
                          </span>
                        </span>

                        <p className="text-[14px] text-[var(--color-text-muted)] md:text-[15px]">
                          {skill.opinion}
                        </p>

                        {project ? (
                          <Link
                            href={`/projects/${project.slug}`}
                            className="group inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-accent)] md:justify-end md:whitespace-nowrap"
                          >
                            <span className="hidden md:inline">used in:</span>
                            <span className="md:hidden">→</span>
                            <span className="underline-offset-4 group-hover:underline">
                              {project.name.toLowerCase()}
                            </span>
                            <span
                              aria-hidden
                              className="hidden transition-transform group-hover:translate-x-0.5 md:inline"
                            >
                              →
                            </span>
                          </Link>
                        ) : (
                          <span
                            aria-hidden
                            className="hidden font-mono text-[11px] text-[var(--color-text-subtle)]/40 md:block md:text-right"
                          >
                            —
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-8 grid gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)] md:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 normal-case tracking-normal">
                <span
                  aria-hidden
                  className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text)]">daily</span>
              </span>
              <span className="normal-case tracking-normal text-[var(--color-text-subtle)]">
                — reached for this week
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 normal-case tracking-normal">
                <span
                  aria-hidden
                  className="inline-block h-[6px] w-[6px] rounded-full border border-[var(--color-text-subtle)]"
                />
                <span className="text-[var(--color-text)]">shipped-with</span>
              </span>
              <span className="normal-case tracking-normal text-[var(--color-text-subtle)]">
                — put in production, would again
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
