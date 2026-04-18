import { AnimateOnScroll } from "./animate-on-scroll";

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
      {children}
    </span>
  );
}

function PipelineStep({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
      {children}
    </span>
  );
}

function PipelineArrow() {
  return (
    <span className="text-zinc-300" aria-hidden="true">
      →
    </span>
  );
}

const projects = [
  {
    name: "Chat with PDF",
    tagline: "AI-powered document Q&A with retrieval-augmented generation",
    tech: ["Next.js", "Convex", "Google Document AI", "Gemini Embedding 2"],
    pipeline: [
      "Upload PDF",
      "OCR",
      "Chunk Text",
      "Embed",
      "Store",
      "Retrieve",
      "Generate Answer",
    ],
    problem:
      "Most PDF interactions are limited to keyword search — useless for scanned documents and unable to understand context. Engineers, researchers, and analysts waste hours reading through lengthy documents to find specific information.",
    approach:
      "An AI-powered document Q&A system. Upload any PDF — scanned or digital — and ask questions in natural language. The system extracts text via OCR, chunks and embeds it, then retrieves relevant passages to generate accurate, contextual answers.",
    decisions: [
      {
        title: "Convex over REST + PostgreSQL",
        detail:
          "Convex provides real-time reactivity out of the box. Chat messages appear instantly without polling. Schema changes deploy without migrations. Tradeoff: vendor lock-in, but the development speed gain was significant — shipping the full backend in days instead of weeks.",
      },
      {
        title: "Google Document AI over Tesseract",
        detail:
          "Tesseract struggles with multi-column layouts, tables, and handwritten text. Document AI handles all of these with 95%+ accuracy. Cost: ~$0.01/page vs free, but accuracy makes the RAG pipeline viable on real-world documents.",
      },
      {
        title: "Embeddings in Convex vs dedicated vector DB",
        detail:
          "Kept embeddings in Convex instead of adding Pinecone or Weaviate. Fewer moving parts, single data layer, simpler deployment. Works well at current scale (150+ docs). Would migrate to pgvector at ~10K documents.",
      },
    ],
    tradeoffs: [
      "Chunk size: 512 tokens with 50-token overlap. Tested 256 (too fragmented, lost context), 1024 (poor retrieval precision). 512 balanced context preservation with retrieval accuracy.",
      "OCR adds 2–3s per page of processing time, but enables the system to handle scanned documents — without it, 40%+ of uploaded PDFs would be unsearchable.",
      "Convex's vector search adds ~100ms vs dedicated solutions. Acceptable for a conversational interface where users expect brief pauses.",
    ],
    impact: [
      { metric: "150+", label: "Documents processed" },
      { metric: "100+", label: "Active users" },
      { metric: "<3s", label: "Avg. query response" },
    ],
  },
  {
    name: "VoiceFlow",
    tagline:
      "System-level voice-to-text that turns speech into polished writing in any app",
    tech: ["Electron", "Rust", "Whisper-1", "GPToss-120b"],
    pipeline: [
      "Hold Hotkey",
      "Capture Audio",
      "Transcribe",
      "Clean Up",
      "Inject at Cursor",
    ],
    problem:
      "Voice input on desktop is broken. System-level dictation produces rough transcripts full of filler words. Third-party solutions require per-app integration and can't inject text universally. Power users who think faster than they type have no good option.",
    approach:
      "A system-level desktop app. Hold a hotkey, speak, release — polished text appears at your cursor in any application. Two-stage AI pipeline: Whisper for raw transcription, then GPToss for intelligent cleanup that removes filler words while preserving intent.",
    decisions: [
      {
        title: "Rust for global hotkey over Electron APIs",
        detail:
          "Electron's globalShortcut module is unreliable when the app loses focus. Rust's native key listener intercepts at the OS level via IOKit (macOS) / Windows API, ensuring 100% hotkey capture regardless of active application.",
      },
      {
        title: "Two-stage pipeline (Whisper → GPToss) over single model",
        detail:
          "Whisper excels at raw transcription but outputs verbatim speech including fillers. GPToss handles contextual cleanup — understanding when \"like\" is a filler vs. meaningful. Separating concerns allows independent optimization of each stage.",
      },
      {
        title: "Clipboard-based text injection",
        detail:
          "Programmatic text insertion varies wildly across apps. The clipboard approach (copy result → simulate Cmd+V) works universally in any text field. User's original clipboard is preserved and restored after injection (~50ms operation).",
      },
    ],
    tradeoffs: [
      "Electron adds ~150–200MB memory overhead vs a native app. Accepted this for cross-platform development speed — a single codebase runs on macOS, Windows, and Linux.",
      "API-based transcription (Whisper) adds ~500ms latency vs local model (whisper.cpp). Chose API for consistently better accuracy, especially with technical vocabulary and accents.",
      "Clipboard injection briefly overwrites user's clipboard. Mitigated by atomic clipboard operations — save, inject, restore — completing in under 50ms.",
    ],
    impact: [
      { metric: "3–4×", label: "Typing speed improvement" },
      { metric: "<1s", label: "End-to-end latency" },
      { metric: "3", label: "Platforms supported" },
    ],
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Projects
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Case studies
          </h2>
          <p className="mt-4 max-w-2xl text-foreground-muted">
            Detailed breakdowns of systems I&apos;ve designed and built —
            including the technical decisions, tradeoffs, and real-world impact.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 space-y-10">
          {projects.map((project, idx) => (
            <AnimateOnScroll key={idx}>
              <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
                {/* Header */}
                <div className="border-b border-border bg-zinc-50/50 px-8 py-8 md:px-12 md:py-10">
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-foreground-muted">
                    {project.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <TechBadge key={t}>{t}</TechBadge>
                    ))}
                  </div>
                </div>

                <div className="px-8 py-8 md:px-12 md:py-10">
                  {/* Pipeline visualization */}
                  <div className="mb-10 overflow-x-auto">
                    <div className="flex flex-wrap items-center gap-2 font-mono">
                      {project.pipeline.map((step, i) => (
                        <span key={i} className="flex items-center gap-2">
                          <PipelineStep>{step}</PipelineStep>
                          {i < project.pipeline.length - 1 && (
                            <PipelineArrow />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Problem & Approach */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                        The Problem
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                        The Approach
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                        {project.approach}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-8 border-t border-border" />

                  {/* Key Technical Decisions */}
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                    Key Technical Decisions
                  </h4>
                  <div className="mt-4 space-y-4">
                    {project.decisions.map((d, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-zinc-50/50 p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                            {i + 1}
                          </span>
                          <div>
                            <h5 className="text-sm font-semibold text-foreground">
                              {d.title}
                            </h5>
                            <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                              {d.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-8 border-t border-border" />

                  {/* Tradeoffs */}
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                    Tradeoffs
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {project.tradeoffs.map((t, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground-subtle" />
                        <span className="leading-relaxed text-foreground-muted">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="my-8 border-t border-border" />

                  {/* Impact */}
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                    Impact
                  </h4>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {project.impact.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-zinc-50/50 p-4 text-center"
                      >
                        <div className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                          {m.metric}
                        </div>
                        <div className="mt-1 text-xs text-foreground-muted">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
