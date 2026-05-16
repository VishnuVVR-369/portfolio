import type { Metadata } from "next";
import { projects } from "@/lib/projects";

export const SITE_URL = "https://vvr.dev";
export const SITE_NAME = "vvr.dev";
export const PERSON_NAME = "Vishnuvardhan Reddy";
export const PERSON_TITLE = "Software Engineer";
export const EMAIL = "vishnuvardhanganji@gmail.com";
export const LOCATION = "Hyderabad, India";
export const LINKEDIN_URL = "https://www.linkedin.com/in/vishnu-vvr";
export const GITHUB_URL = "https://github.com/VishnuVVR-369";

export const DEFAULT_DESCRIPTION =
  "Vishnuvardhan Reddy — Software Engineer III at FactSet. Building AI products and data-intensive systems. LeetCode Guardian (top 1%). Two products live: chatwithpdf.pro and VoiceFlow.";

export const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Vishnuvardhan Reddy - Software Engineer",
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function routeMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url,
      title: title === PERSON_NAME ? `${PERSON_NAME} - ${PERSON_TITLE}` : title,
      description,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: PERSON_NAME,
    alternateName: "Vishnu VVR",
    jobTitle: PERSON_TITLE,
    url: SITE_URL,
    email: `mailto:${EMAIL}`,
    image: absoluteUrl("/portrait.webp"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressCountry: "IN",
    },
    worksFor: {
      "@type": "Organization",
      name: "FactSet",
    },
    sameAs: [GITHUB_URL, LINKEDIN_URL],
    knowsAbout: [
      "Software engineering",
      "Full-stack development",
      "Retrieval-augmented generation",
      "Voice AI",
      "TypeScript",
      "Next.js",
      "Data-intensive systems",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": absoluteUrl("/#person") },
    inLanguage: "en",
  };
}

export function projectJsonLd(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return null;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/projects/${project.slug}#case-study`),
    name: `${project.name} case study`,
    headline: project.tagline,
    description: project.problem,
    url: absoluteUrl(`/projects/${project.slug}`),
    datePublished: `${project.year}-01-01`,
    author: { "@id": absoluteUrl("/#person") },
    creator: { "@id": absoluteUrl("/#person") },
    keywords: [...project.tech, ...project.tags].join(", "),
    sameAs: [project.links.live, project.links.github, project.links.demo].filter(
      Boolean
    ),
    about: project.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
