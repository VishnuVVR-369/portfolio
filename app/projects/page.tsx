import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { routeMetadata } from "@/lib/seo";
import { ProjectsIndex } from "./projects-index";

export const metadata: Metadata = routeMetadata({
  title: "Projects",
  description:
    "Case studies by Vishnuvardhan Reddy covering RAG, voice AI, desktop systems, and full-stack products built with explicit engineering tradeoffs.",
  path: "/projects",
});

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
