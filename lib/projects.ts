// Single source of truth for projects.
// Add new projects here — pages and indexes pick them up automatically.

import {
  PRODUCT_VOICEFLOW_LABEL,
  PRODUCT_VOICEFLOW_URL,
  VOICEFLOW_DOWNLOAD_URL,
} from "./identity";

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
  liveLabel?: string;
  github?: string;
  demo?: string;
  download?: string;
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
      "Mistral OCR 4",
      "OpenAI",
      "TypeScript",
      "React",
      "Tailwind",
      "Clerk",
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
      "An AI-powered document Q&A system. Upload any PDF — scanned or digital — and ask questions in natural language. An async pipeline runs Mistral OCR to extract page text, chunks and embeds it, then answers with hybrid retrieval (vector + full-text). Every answer streams back with citations that link to the source page and highlight the referenced text in an inline PDF viewer. A citation-validation pass verifies generated quotes against the source text, measured at 82% citation accuracy on a 50-question evaluation set.",
    decisions: [
      {
        chose: "Convex (real-time DB + functions)",
        rejected: "REST + Postgres + manual websockets",
        reason:
          "Convex gives real-time reactivity for free. Chat messages appear instantly without polling, schema changes deploy without migrations. Vendor lock-in is the cost; shipping the full backend in days instead of weeks is the gain.",
      },
      {
        chose: "Mistral OCR 4",
        rejected: "Google Document AI",
        reason:
          "Shipped first on Document AI, then migrated. Mistral OCR returns clean, markdown-structured text — tables, headings, and reading order preserved — from a single API call, instead of Document AI's processor setup and page-by-page batching. Comparable accuracy on scanned and multi-column PDFs, a far simpler integration, and lower cost. A 100-page-per-document cap is the tradeoff.",
      },
      {
        chose: "Hybrid retrieval inside Convex",
        rejected: "Pinecone or Weaviate",
        reason:
          "OpenAI embeddings (text-embedding-3-small) live in Convex's native vector index alongside a full-text index — one data layer, no extra service to run. Each query fans out to both, then a rerank pass merges the results and pulls neighboring chunks for context. Works at current scale; a dedicated index becomes worth it around 10K docs, not before.",
      },
    ],
    tradeoffs: [
      "Chunks target 450 words with a 75-word overlap, tracking the page span each chunk covers so citations can point back to an exact page. Smaller chunks fragmented context; larger ones dropped retrieval precision. The overlap is what keeps a passage that straddles two chunks retrievable.",
      "OCR runs asynchronously at upload, not on every query, and retries with backoff (15s, then 60s) on transient failures. The cost of making scanned PDFs queryable is paid once; the 100-page-per-document cap keeps a single job bounded.",
      "Hybrid retrieval adds a rerank and neighbor-expansion pass over pure vector search, plus a routing step that decides between chunk lookup and document summaries. A few hundred extra milliseconds for a conversational interface, in exchange for answers that stay grounded when the evidence is thin.",
    ],
    impact: [
      { metric: "82%", label: "citation accuracy" },
      { metric: "100+", label: "active users" },
      { metric: "2s", label: "first token latency" },
    ],
    headline: { metric: "82%", label: "citation accuracy" },
    featured: true,
    links: {
      live: "https://chatwithpdf.pro",
      github: "https://github.com/VishnuVVR-369/chat-pdf",
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
      "gpt-oss-120b",
    ],
    pipeline: ["hotkey", "capture", "transcribe", "clean-up", "inject"],
    problem:
      "Voice input on desktop is broken. System dictation produces transcripts the writer disowns. Per-app integrations make the universal case impossible. Power users who think faster than they type have no good option.",
    approach:
      "A system-level desktop app. Hold a hotkey, speak, release — polished text appears at your cursor in any application. Two-stage AI pipeline: Whisper for raw transcription, then gpt-oss for intelligent cleanup that removes filler words while preserving intent.",
    decisions: [
      {
        chose: "Rust native key listener for global hotkey",
        rejected: "Electron globalShortcut",
        reason:
          "Electron's globalShortcut becomes unreliable when the app loses focus. Rust intercepts at the OS layer (IOKit on macOS, Win32 API on Windows), capturing 100% of hotkey presses regardless of which app is in front.",
      },
      {
        chose: "Two-stage pipeline (Whisper → gpt-oss)",
        rejected: "Single end-to-end model",
        reason:
          "Whisper is excellent at transcription but outputs verbatim speech, fillers and all. gpt-oss handles contextual cleanup — it knows when 'like' is a filler vs. meaningful. Separating concerns lets each stage be tuned independently.",
      },
      {
        chose: "macOS Accessibility-based text injection",
        rejected: "Clipboard paste simulation",
        reason:
          "Simulating a paste (copy, then Cmd+V) works in any text field, but it overwrites the user's clipboard and can race with clipboard managers. The macOS Accessibility APIs insert text at the cursor directly, so injection is safe in any focused field and the clipboard is never touched.",
      },
    ],
    tradeoffs: [
      "Electron adds ~150–200MB memory overhead vs. a native app. The cost of one codebase running on macOS, Windows, and Linux is paid once in RAM.",
      "API-based Whisper adds ~500ms latency vs. a local whisper.cpp model. The latency buys consistently better accuracy on technical vocabulary and accents — non-negotiable for the writing use case.",
      "Accessibility-based injection needs an explicit macOS Accessibility permission grant. One-time setup friction, in exchange for text insertion that never touches the user's clipboard.",
    ],
    impact: [
      { metric: "3–4×", label: "typing-speed improvement" },
      { metric: "<1s", label: "end-to-end latency" },
      { metric: "3", label: "platforms supported" },
    ],
    headline: { metric: "3–4×", label: "typing-speed improvement" },
    featured: true,
    links: {
      live: PRODUCT_VOICEFLOW_URL,
      liveLabel: PRODUCT_VOICEFLOW_LABEL,
      github: "https://github.com/VishnuVVR-369/voice-flow",
      download: VOICEFLOW_DOWNLOAD_URL,
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
