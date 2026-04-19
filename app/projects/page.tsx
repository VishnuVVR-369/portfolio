import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { ProjectsIndex } from "./projects-index";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work — case studies of systems built with explicit tradeoffs and defended decisions.",
};

export default function ProjectsPage() {
  return (
    <ProjectsIndex
      projects={projects.map((p) => ({
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        year: p.year,
        status: p.status,
        tech: p.tech,
        tags: p.tags,
        headline: p.headline,
        firstDecision: {
          chose: p.decisions[0].chose,
          rejected: p.decisions[0].rejected,
        },
      }))}
    />
  );
}
