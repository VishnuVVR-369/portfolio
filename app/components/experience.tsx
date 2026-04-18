import { AnimateOnScroll } from "./animate-on-scroll";

const timeline = [
  {
    period: "Apr 2026 — Present",
    title: "Software Engineer III",
    company: "FactSet",
    description:
      "Leading architecture decisions for data-intensive systems. Driving performance optimization initiatives and mentoring engineers across the team.",
  },
  {
    period: "Aug 2024 — Apr 2026",
    title: "Software Engineer II",
    company: "FactSet",
    description:
      "Owned and scaled critical data pipeline components. Made key technical decisions on system design and infrastructure that improved throughput and reliability.",
  },
  {
    period: "Jun 2023 — Aug 2024",
    title: "Software Engineer I",
    company: "FactSet",
    description:
      "Built and shipped production features across the core platform. Developed deep expertise in full-stack financial data systems and API design.",
  },
  {
    period: "Jan 2023 — Jun 2023",
    title: "Software Engineering Intern",
    company: "FactSet",
    description:
      "Rapid ramp-up on enterprise-scale systems. Delivered production-ready features within the first month and converted to full-time offer.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="bg-background-alt py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Experience
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            3+ years building at scale
          </h2>
          <p className="mt-4 max-w-2xl text-foreground-muted">
            Intern to SWE III in three years — each promotion earned through
            technical depth, ownership, and measurable impact on systems serving
            thousands of users.
          </p>
        </AnimateOnScroll>

        <div className="mt-14">
          {timeline.map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <div className="relative flex gap-6 pb-10 last:pb-0">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full border-2 border-accent bg-white" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-accent">
                    {item.company}
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
