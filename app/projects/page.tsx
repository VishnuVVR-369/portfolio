import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { routeMetadata } from "@/lib/seo";
import { ProjectsIndex } from "./projects-index";

export const metadata: Metadata = routeMetadata({
  title: "Work",
  description:
    "Case studies by Vishnuvardhan Reddy covering RAG, voice AI, desktop systems, and full-stack products built with explicit engineering tradeoffs.",
  path: "/projects",
});

export default function ProjectsPage() {
  // Pass full projects through; visual-variant is chosen per slug
  // inside the index so case-study cards mirror the homepage cards.
  return <ProjectsIndex projects={projects} />;
}
