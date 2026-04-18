import { AnimateOnScroll } from "./animate-on-scroll";

const capabilities = [
  {
    title: "AI & Intelligent Systems",
    description:
      "Designing and deploying RAG pipelines, embedding systems, and LLM-powered features that solve real information retrieval and productivity problems.",
    tech: [
      "Gemini",
      "Whisper",
      "GPToss",
      "Google Document AI",
      "Vector Databases",
      "Embeddings",
    ],
  },
  {
    title: "Full-Stack Web Applications",
    description:
      "Building real-time, server-rendered applications with type-safe APIs and scalable data layers. From database schema to production deployment.",
    tech: [
      "Next.js",
      "React",
      "Node.js",
      "Convex",
      "PostgreSQL",
      "TypeScript",
    ],
  },
  {
    title: "Systems & Desktop Software",
    description:
      "Cross-platform desktop applications with native OS integration, global hotkey systems, and performance-critical native modules written in Rust.",
    tech: [
      "Electron",
      "Rust",
      "Native OS APIs",
      "IPC",
      "Audio Processing",
    ],
  },
];

const additionalSkills = [
  "Python",
  "Git",
  "Docker",
  "CI/CD",
  "REST APIs",
  "WebSockets",
  "Tailwind CSS",
  "Testing",
  "System Design",
];

export function Skills() {
  return (
    <section id="skills" className="bg-background-alt py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Skills
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            What I build with
          </h2>
          <p className="mt-4 max-w-2xl text-foreground-muted">
            I don&apos;t just list technologies — each one here is something
            I&apos;ve shipped production systems with. Organized by the type of
            problems I solve.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <AnimateOnScroll key={i} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-border bg-white p-7 shadow-sm transition-all hover:border-foreground-subtle/30 hover:shadow-md">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {cap.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                  {cap.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {cap.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors group-hover:bg-accent/5 group-hover:text-accent"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={300}>
          <div className="mt-10 rounded-xl border border-border bg-white px-7 py-5">
            <p className="text-sm text-foreground-subtle">
              <span className="font-medium text-foreground-muted">
                Also proficient in:{" "}
              </span>
              {additionalSkills.join(" · ")}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
