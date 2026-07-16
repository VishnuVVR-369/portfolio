import "server-only";

import {
  AVAILABILITY,
  COMPANY,
  EMAIL,
  GITHUB_URL,
  HERO_PROOF,
  HERO_SUBPROOF,
  LEETCODE_PROBLEMS,
  LEETCODE_RATING,
  LEETCODE_STREAK,
  LEETCODE_TIER,
  LEETCODE_URL,
  LINKEDIN_URL,
  LOCATION,
  NAME,
  NAME_SHORT,
  NOW,
  PRODUCT_CHATWITHPDF_URL,
  PRODUCT_CHATWITHPDF_USERS,
  RESUME_URL,
  ROLE_NOW,
  ROLE_TAGLINE,
  TENURE_LINE,
  TIMEZONE_LABEL,
} from "@/lib/identity";
import { projects } from "@/lib/projects";
import { stack } from "@/lib/stack";
import { BIO_SECTIONS } from "./chat-bio";

// Composes every fact the chat AI is allowed to know into a single
// markdown block. Built once per cold start; cheap enough to recompute
// on every request if the imports become dynamic later.

function renderIdentity(): string {
  return [
    `# Identity`,
    `- Full name: ${NAME} (goes by ${NAME_SHORT})`,
    `- Role: ${ROLE_NOW} at ${COMPANY}`,
    `- Tagline: ${ROLE_TAGLINE}`,
    `- Tenure: ${TENURE_LINE}`,
    `- Location: ${LOCATION} (${TIMEZONE_LABEL})`,
    `- Availability: ${AVAILABILITY}`,
    `- Email: ${EMAIL}`,
    `- GitHub: ${GITHUB_URL}`,
    `- LinkedIn: ${LINKEDIN_URL}`,
    `- Résumé: ${RESUME_URL} (served from the portfolio at this path)`,
    ``,
    `# Hero claims`,
    `- ${HERO_PROOF}`,
    `- ${HERO_SUBPROOF}`,
    ``,
    `# LeetCode`,
    `- Tier: ${LEETCODE_TIER}`,
    `- Rating: ${LEETCODE_RATING}`,
    `- Streak: day ${LEETCODE_STREAK}+`,
    `- Total solved: ${LEETCODE_PROBLEMS}`,
    `- Profile: ${LEETCODE_URL}`,
    ``,
    `# Live products`,
    `- Chat with PDF — ${PRODUCT_CHATWITHPDF_URL} (${PRODUCT_CHATWITHPDF_USERS})`,
    ``,
    `# Now`,
    `- Building: ${NOW.building}`,
    `- Reading: ${NOW.reading}`,
  ].join("\n");
}

function renderProjects(): string {
  const lines: string[] = ["# Projects"];
  for (const p of projects) {
    lines.push(``);
    lines.push(`## ${p.name} (slug: ${p.slug}, ${p.year}, ${p.status})`);
    lines.push(`Tagline: ${p.tagline}`);
    lines.push(`Tags: ${p.tags.join(", ")}`);
    lines.push(`Tech: ${p.tech.join(", ")}`);
    lines.push(`Pipeline: ${p.pipeline.join(" → ")}`);
    lines.push(`Problem: ${p.problem}`);
    lines.push(`Approach: ${p.approach}`);
    if (p.decisions.length) {
      lines.push(`Key decisions:`);
      for (const d of p.decisions) {
        lines.push(`  - Chose ${d.chose} over ${d.rejected}. ${d.reason}`);
      }
    }
    if (p.tradeoffs.length) {
      lines.push(`Tradeoffs:`);
      for (const t of p.tradeoffs) lines.push(`  - ${t}`);
    }
    if (p.impact.length) {
      lines.push(
        `Impact: ${p.impact.map((m) => `${m.metric} ${m.label}`).join("; ")}`,
      );
    }
    const internalRoute = `/projects/${p.slug}`;
    lines.push(`Portfolio page: ${internalRoute}`);
    if (p.links.live) lines.push(`Live: ${p.links.live}`);
    if (p.links.github) lines.push(`GitHub: ${p.links.github}`);
  }
  return lines.join("\n");
}

function renderStack(): string {
  const lines: string[] = ["# Stack"];
  for (const cat of stack) {
    lines.push(``);
    lines.push(`## ${cat.name}`);
    for (const s of cat.skills) {
      lines.push(`- ${s.name} [${s.tier}]: ${s.opinion}`);
    }
  }
  return lines.join("\n");
}

function renderBio(): string {
  const lines: string[] = ["# Long-form bio"];
  for (const section of BIO_SECTIONS) {
    lines.push(``);
    lines.push(`## ${section.heading}`);
    lines.push(section.body);
  }
  return lines.join("\n");
}

let cached: string | null = null;

export function getKnowledgeBlock(): string {
  if (cached) return cached;
  cached = [
    renderIdentity(),
    ``,
    renderProjects(),
    ``,
    renderStack(),
    ``,
    renderBio(),
  ].join("\n");
  return cached;
}

// Enumerates internal routes the AI is allowed to surface as `route` actions.
// Kept here so the system prompt and the sanitizer share the same list.
export function getAllowedInternalRoutes(): string[] {
  return [
    "/",
    "/about",
    "/projects",
    "/contact",
    ...projects.map((p) => `/projects/${p.slug}`),
    RESUME_URL,
  ];
}

// External destinations the AI may link to. Anything else gets stripped
// server-side before the actions reach the browser.
export function getAllowedExternalHosts(): string[] {
  return [
    "github.com",
    "linkedin.com",
    "leetcode.com",
    "chatwithpdf.pro",
  ];
}

export function getAllowedEmail(): string {
  return EMAIL;
}
