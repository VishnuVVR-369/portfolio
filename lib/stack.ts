import { projects, type Project } from "./projects";

export type SkillTier = "daily" | "shipped-with";

export interface Skill {
  name: string;
  tier: SkillTier;
  opinion: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const stack: SkillCategory[] = [
  {
    name: "languages",
    skills: [
      {
        name: "TypeScript",
        tier: "daily",
        opinion: "Strict mode from day one. `any` is a smell, not an escape hatch.",
      },
      {
        name: "Python",
        tier: "shipped-with",
        opinion: "When the problem is data-shaped, not request-shaped.",
      },
    ],
  },
  {
    name: "frontend",
    skills: [
      {
        name: "React",
        tier: "daily",
        opinion: "Components as functions. State as the last resort, not the first.",
      },
      {
        name: "Next.js",
        tier: "daily",
        opinion: "Server components by default. Client ones earn their keep.",
      },
      {
        name: "Tailwind",
        tier: "daily",
        opinion: "Utility-first. Extract a component the second the classes repeat.",
      },
    ],
  },
  {
    name: "backend",
    skills: [
      {
        name: "Node.js",
        tier: "daily",
        opinion: "The runtime, not the framework. Bun and Deno when it earns it.",
      },
      {
        name: "Express",
        tier: "shipped-with",
        opinion: "Thin router, fat services. Middleware is a contract.",
      },
    ],
  },
  {
    name: "data & ai",
    skills: [
      {
        name: "Postgres",
        tier: "shipped-with",
        opinion: "The default. NoSQL earns its place; it doesn't assume it.",
      },
      {
        name: "LangChain",
        tier: "shipped-with",
        opinion: "Chains for glue, not for thinking. Prompts are still code.",
      },
    ],
  },
  {
    name: "infra",
    skills: [
      {
        name: "Docker",
        tier: "shipped-with",
        opinion: "For parity with prod, not for kubernetes cosplay.",
      },
      {
        name: "Git",
        tier: "daily",
        opinion: "Small commits. Honest messages. Rebase before review, merge after.",
      },
    ],
  },
];

export const heroStack = ["TypeScript", "React", "Postgres", "Docker"];

export const resolveStackProject = (skill: string): Project | undefined => {
  const needle = skill.toLowerCase();
  return projects.find((p) =>
    p.tech.some((t) => t.toLowerCase() === needle),
  );
};

export const stackSkillCount = stack.reduce(
  (n, cat) => n + cat.skills.length,
  0,
);
