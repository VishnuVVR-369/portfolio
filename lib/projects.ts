// Single source of truth for projects.
// Add new projects here — pages and indexes pick them up automatically.

import {
  PRODUCT_OPENBOT_LABEL,
  PRODUCT_OPENBOT_URL,
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

// How the project's architecture is drawn (see components/project-visual).
export type ProjectVisualVariant = "pipeline" | "rack" | "topology";

// A product screenshot, shown as a feature row on the case study and
// as a chapter in the lead card. Paths are relative to /public.
export interface ProjectShot {
  src: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  alt: string;
}

export interface TourChapter {
  /** Seconds from the start of the tour. */
  at: number;
  title: string;
}

export interface ProjectMedia {
  /** Silent, seamless product loop for cards. */
  loop: {
    av1: string;
    h264: string;
    poster: string;
    posterAvif: string;
    /** Short label for the screen frame, e.g. "milo's screen". */
    label: string;
  };
  /** Narrated product tour with captions and chapters. */
  tour?: {
    src: string;
    captions: string;
    durationSeconds: number;
    chapters: TourChapter[];
  };
  shots: ProjectShot[];
  /** 1200x630 social preview for the case study. */
  ogImage?: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  /** How long the first shipped version took, e.g. "2 weeks". */
  built?: string;
  status: ProjectStatus;
  tags: ProjectTag[];
  tech: string[];
  pipeline: string[];
  visual: ProjectVisualVariant;
  problem: string;
  approach: string;
  /** Short capability labels, listed on the case study after the shots. */
  highlights?: string[];
  decisions: Decision[];
  tradeoffs: string[];
  impact: ImpactMetric[];
  featured: boolean;
  /** The lead project gets the full-width card on home and /projects. */
  lead?: boolean;
  headline?: ImpactMetric;
  media?: ProjectMedia;
  links: ProjectLinks;
}

const OPENBOT_MEDIA = "/projects/open-bot";

export const projects: Project[] = [
  {
    slug: "open-bot",
    name: "open-bot",
    tagline:
      "AI teammates that do real work on their own computer. Watch them live, take over any time, and nothing ships without your OK.",
    year: "2026",
    role: "Designed, built, shipped",
    built: "2 weeks",
    status: "live",
    tags: ["ai", "systems", "full-stack", "desktop"],
    tech: [
      "Next.js",
      "TypeScript",
      "Codex app-server",
      "Postgres",
      "pgvector",
      "Drizzle",
      "Docker",
      "Chromium",
      "noVNC",
      "Electron",
      "Better Auth",
      "Railway",
    ],
    pipeline: [
      "ask",
      "queue",
      "claim",
      "agent turn",
      "desktop",
      "approve",
      "report",
    ],
    visual: "topology",
    problem:
      "Chat assistants can explain how to compare prices, book a flight or clear an inbox, but they can't do it. That work lives behind logged-in websites, not APIs. Grok Bot, OpenAI Dots and Meta Muse showed that agents with a computer of their own can do this kind of work. I wanted one that is personal and open source: one I can watch, interrupt, and trust with my own accounts.",
    approach:
      "You create teammates and give each one a job. They share one always-on cloud computer, and every teammate gets its own screen with a Linux desktop, a browser, a shell and files, so several can work at once. You watch any screen live, press Take over to type a password or solve a 2FA prompt, then hand it back with a note. Sending, buying, publishing and deleting wait for your approval. Saved logins and cards sit in a vault that teammates can use but never see, and each teammate has a monthly budget. Around that sit schedules, page watches, group chats, a shared task board, parallel helpers, editable memory, MCP connections, email and Telegram. Designed and built in two weeks, and live on Railway.",
    highlights: [
      "Schedules and reminders",
      "Page watches",
      "Webhooks",
      "Group chats with a lead",
      "Shared task board",
      "Memory you can edit and forget",
      "Vault for logins and cards",
      "Monthly budgets",
      "MCP connections",
      "Email on your domain",
      "Telegram approvals",
      "Voice in and out",
      "Push notifications",
      "Plan to API key fallback",
    ],
    decisions: [
      {
        chose: "Codex app-server inside the computer, driven over JSON-RPC",
        rejected: "An agent loop on the backend calling a model API",
        reason:
          "Codex's shell and file tools act on the machine Codex runs on, and a ChatGPT plan is only reachable through Codex. So the agent runs inside the shared computer and the worker drives it remotely, serving the teammates' own tools (desktop, approvals, takeovers, schedules, handoffs) as Codex dynamic tools. When the plan's limit runs out, the same code path switches to an OpenAI API key under a hard monthly cap: one agent runtime, two ways to pay for it.",
      },
      {
        chose: "One shared computer with a screen and a lease per teammate",
        rejected: "A separate virtual machine for every teammate",
        reason:
          "Sign in to a site once on any screen and every teammate is signed in. Work passes between teammates as files instead of copies, and there is one machine to run, monitor and pay for. Each screen has its own display, browser profile and lease, held by the teammate's run or by you. A daemon inside the computer checks the lease on every click and keystroke, so a takeover can't be bypassed, and taking over one screen pauses only that teammate.",
      },
      {
        chose: "Postgres as the job queue: SKIP LOCKED plus NOTIFY",
        rejected: "A queue library or a workflow vendor",
        reason:
          "Runs, schedules and memory jobs are plain rows. The worker claims them with FOR UPDATE SKIP LOCKED, NOTIFY wakes it the moment work arrives, and a run changes state in the same transaction as the data around it. Nothing extra to deploy or keep in sync, and every run can be inspected with SQL.",
      },
      {
        chose: "Browser traffic routed out through the desktop app on my Mac",
        rejected: "Browsing from the cloud server's IP address",
        reason:
          "Websites treat datacenter IPs with suspicion: more CAPTCHAs, more blocked sign-ins. Chromium in the computer talks to a local SOCKS5 proxy that carries each connection over a multiplexed tunnel, through the worker, to the Electron app, so sites see a home connection. When the desktop app is closed, browsing falls back to the cloud.",
      },
    ],
    tradeoffs: [
      "Teammates share one computer and one OS user, so they can read each other's files. That is fine for a single-user app where every teammate works for the same person; a multi-user version would need a computer per user.",
      "Codex hands control back to the model about 30 seconds into a tool call, so a teammate never blocks on a human. A quick approval or hand-back rejoins the running turn; otherwise the turn ends saying what it waits for, and your answer starts a new run in the same chat.",
      "Computer use runs on screenshots, which costs tokens, and every awake screen holds about 330 MB of memory. Screens sleep when idle and wake when a teammate or you need them.",
      "Memory is versioned rows in Postgres, recalled with keyword and vector search merged by reciprocal rank fusion. Vector search is exact for now; an approximate index waits until data size and measured latency call for one.",
    ],
    impact: [],
    featured: true,
    lead: true,
    media: {
      loop: {
        av1: `${OPENBOT_MEDIA}/loop.av1.mp4`,
        h264: `${OPENBOT_MEDIA}/loop.h264.mp4`,
        poster: `${OPENBOT_MEDIA}/loop-poster.jpg`,
        posterAvif: `${OPENBOT_MEDIA}/loop-poster.avif`,
        label: "milo · finding flights",
      },
      tour: {
        src: `${OPENBOT_MEDIA}/tour.mp4`,
        captions: `${OPENBOT_MEDIA}/tour-captions.vtt`,
        durationSeconds: 86,
        chapters: [
          { at: 0, title: "Meet open-bot" },
          { at: 14, title: "Give them a job" },
          { at: 24, title: "Watch them work" },
          { at: 38, title: "Take the wheel" },
          { at: 46, title: "Nothing ships without your OK" },
          { at: 56, title: "Many hands at once" },
          { at: 64, title: "And the rest" },
        ],
      },
      shots: [
        {
          src: `${OPENBOT_MEDIA}/shots/job.avif`,
          width: 2240,
          height: 1400,
          title: "Give them a job",
          caption:
            "Start from a template or write the job yourself. Each teammate gets its own instructions, its own memory and starter automations it runs on a schedule.",
          alt: "The new teammate form with templates, a job description and starter automations.",
        },
        {
          src: `${OPENBOT_MEDIA}/shots/watch.avif`,
          width: 2240,
          height: 1400,
          title: "Watch them work",
          caption:
            "Every click happens in a real browser on the teammate's own screen, streamed live beside the chat, with each step recorded so you can replay it.",
          alt: "A travel teammate searching Google Flights while its live screen streams beside the chat.",
        },
        {
          src: `${OPENBOT_MEDIA}/shots/takeover.avif`,
          width: 2240,
          height: 1400,
          title: "Take the wheel",
          caption:
            "Take over a screen to type a password, solve a 2FA prompt or pick a seat. The teammate pauses until you hand it back with a note.",
          alt: "The owner in control of a teammate's screen, handing it back with a note.",
        },
        {
          src: `${OPENBOT_MEDIA}/shots/approval.avif`,
          width: 2240,
          height: 1400,
          title: "Nothing ships without your OK",
          caption:
            "Purchases, emails and posts wait for your approval, with the card's spending rules and the budget left shown before you decide.",
          alt: "A shopping teammate asking for approval to pay $45 with a saved card.",
        },
        {
          src: `${OPENBOT_MEDIA}/shots/swarm.avif`,
          width: 2240,
          height: 1400,
          title: "Many hands at once",
          caption:
            "Split a big job across helpers that work in parallel, each on its own screen, then combine what they found into one answer.",
          alt: "Four helpers checking a kettle's price at four stores at the same time.",
        },
      ],
      ogImage: `${OPENBOT_MEDIA}/og.jpg`,
    },
    links: {
      live: PRODUCT_OPENBOT_URL,
      liveLabel: PRODUCT_OPENBOT_LABEL,
      github: "https://github.com/VishnuVVR-369/open-bot",
    },
  },
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
    visual: "pipeline",
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
    visual: "rack",
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

// The one project that gets the full-width lead card.
export const leadProject = (): Project | undefined =>
  projects.find((p) => p.lead);

// Featured projects shown in the grid under the lead card.
export const featuredProjects = (): Project[] =>
  projects.filter((p) => p.featured && !p.lead);

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
    ...(project.media?.shots ?? []).flatMap((shot) => [shot.title, shot.caption]),
    ...project.decisions.flatMap((d) => [d.chose, d.rejected, d.reason]),
    ...project.tradeoffs,
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};
