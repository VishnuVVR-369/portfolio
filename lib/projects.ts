// Single source of truth for projects.
// Add new projects here — pages and indexes pick them up automatically.

export type ProjectTag = "ai" | "systems" | "full-stack" | "desktop";

export type ProjectStatus = "live" | "in-progress" | "archived";

export interface Decision {
  chose: string;
  rejected: string;
  reason: string;
}

export interface ImpactMetric {
  metric: string;
  label: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
  demo?: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  status: ProjectStatus;
  tags: ProjectTag[];
  tech: string[];
  pipeline: string[];
  problem: string;
  approach: string;
  decisions: Decision[];
  tradeoffs: string[];
  impact: ImpactMetric[];
  featured: boolean;
  headline: ImpactMetric;
  links: ProjectLinks;
}

export const projects: Project[] = [
  {
    slug: "chat-with-pdf",
    name: "Chat with PDF",
    tagline:
      "Ask any document a question. Even the scanned ones nobody can search.",
    year: "2025",
    role: "Designed, built, shipped",
    status: "live",
    tags: ["ai", "full-stack"],
    tech: [
      "Next.js",
      "Convex",
      "Google Document AI",
      "TypeScript",
      "React",
      "Tailwind",
      "Gemini Embedding 2",
    ],
    pipeline: [
      "upload",
      "ocr",
      "chunk",
      "embed",
      "store",
      "retrieve",
      "answer",
    ],
    problem:
      "Most PDF interactions are limited to keyword search — useless for scanned documents and unable to understand context. Engineers, researchers, and analysts waste hours skimming long documents to find a single passage.",
    approach:
      "An AI-powered document Q&A system. Upload any PDF — scanned or digital — and ask questions in natural language. The system extracts text via OCR, chunks and embeds it, then retrieves relevant passages to generate accurate, contextual answers.",
    decisions: [
      {
        chose: "Convex (real-time DB + functions)",
        rejected: "REST + Postgres + manual websockets",
        reason:
          "Convex gives real-time reactivity for free. Chat messages appear instantly without polling, schema changes deploy without migrations. Vendor lock-in is the cost; shipping the full backend in days instead of weeks is the gain.",
      },
      {
        chose: "Google Document AI",
        rejected: "Tesseract OCR",
        reason:
          "Tesseract chokes on multi-column layouts, tables, and handwriting. Document AI handles all three at 95%+ accuracy. ~$0.01/page is the price; making 40% of real-world PDFs actually queryable is the value.",
      },
      {
        chose: "Embeddings stored in Convex",
        rejected: "Pinecone or Weaviate",
        reason:
          "Fewer moving parts. Single data layer. Simpler deployment. Works at current scale (150+ docs); the migration to pgvector or a dedicated index becomes worth it around 10K docs, not before.",
      },
    ],
    tradeoffs: [
      "Chunk size: 512 tokens with 50-token overlap. 256 was too fragmented and lost surrounding context. 1024 dropped retrieval precision. 512 was the only size that preserved both.",
      "OCR adds 2–3s per page. The cost of making 40% of uploaded PDFs queryable is paid once at upload, not every query.",
      "Convex's vector search adds ~100ms over a dedicated index. Acceptable for a conversational interface; users expect a brief pause between question and answer.",
    ],
    impact: [
      { metric: "150+", label: "documents indexed" },
      { metric: "100+", label: "active users" },
      { metric: "<3s", label: "average answer time" },
    ],
    headline: { metric: "150+", label: "documents indexed" },
    featured: true,
    links: {
      // TODO(vishnu): paste live + GitHub links when ready.
      live: undefined,
      github: undefined,
    },
  },
  {
    slug: "voiceflow",
    name: "VoiceFlow",
    tagline:
      "System-level voice-to-text that turns speech into polished writing in any app.",
    year: "2025",
    role: "Designed, built, shipped",
    status: "live",
    tags: ["ai", "desktop", "systems"],
    tech: [
      "Electron",
      "Rust",
      "Whisper-1",
      "TypeScript",
      "React",
      "Node.js",
      "GPToss-120b",
    ],
    pipeline: ["hotkey", "capture", "transcribe", "clean-up", "inject"],
    problem:
      "Voice input on desktop is broken. System dictation produces transcripts the writer disowns. Per-app integrations make the universal case impossible. Power users who think faster than they type have no good option.",
    approach:
      "A system-level desktop app. Hold a hotkey, speak, release — polished text appears at your cursor in any application. Two-stage AI pipeline: Whisper for raw transcription, then GPToss for intelligent cleanup that removes filler words while preserving intent.",
    decisions: [
      {
        chose: "Rust native key listener for global hotkey",
        rejected: "Electron globalShortcut",
        reason:
          "Electron's globalShortcut becomes unreliable when the app loses focus. Rust intercepts at the OS layer (IOKit on macOS, Win32 API on Windows), capturing 100% of hotkey presses regardless of which app is in front.",
      },
      {
        chose: "Two-stage pipeline (Whisper → GPToss)",
        rejected: "Single end-to-end model",
        reason:
          "Whisper is excellent at transcription but outputs verbatim speech, fillers and all. GPToss handles contextual cleanup — it knows when 'like' is a filler vs. meaningful. Separating concerns lets each stage be tuned independently.",
      },
      {
        chose: "Clipboard-based text injection",
        rejected: "Programmatic text-field insertion",
        reason:
          "Programmatic insertion behaves differently in every app. The clipboard approach (copy → simulate Cmd+V) works in any text field, anywhere. Original clipboard contents are saved and restored in <50ms.",
      },
    ],
    tradeoffs: [
      "Electron adds ~150–200MB memory overhead vs. a native app. The cost of one codebase running on macOS, Windows, and Linux is paid once in RAM.",
      "API-based Whisper adds ~500ms latency vs. a local whisper.cpp model. The latency buys consistently better accuracy on technical vocabulary and accents — non-negotiable for the writing use case.",
      "Clipboard injection briefly overwrites user clipboard. Mitigated with atomic save-inject-restore in under 50ms, well below human perception.",
    ],
    impact: [
      { metric: "3–4×", label: "typing-speed improvement" },
      { metric: "<1s", label: "end-to-end latency" },
      { metric: "3", label: "platforms supported" },
    ],
    headline: { metric: "3–4×", label: "typing-speed improvement" },
    featured: true,
    links: {
      // TODO(vishnu): paste live + GitHub links when ready.
      live: undefined,
      github: undefined,
    },
  },
];

// ─── Helpers ───────────────────────────────────────────────────────

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const featuredProjects = (): Project[] =>
  projects.filter((p) => p.featured);

export const allProjectSlugs = (): { slug: string }[] =>
  projects.map((p) => ({ slug: p.slug }));

export const tagLabels: Record<ProjectTag, string> = {
  ai: "AI",
  systems: "Systems",
  "full-stack": "Full-stack",
  desktop: "Desktop",
};

// Word count + reading-time helper for case-study pages.
export const readingTime = (project: Project): number => {
  const words = [
    project.problem,
    project.approach,
    ...project.decisions.flatMap((d) => [d.chose, d.rejected, d.reason]),
    ...project.tradeoffs,
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};
