import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Geist, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { CommandPalette } from "./components/command-palette";
import { Analytics } from "@vercel/analytics/next";
import {
  DEFAULT_DESCRIPTION,
  GITHUB_URL,
  LINKEDIN_URL,
  OG_IMAGE,
  PERSON_NAME,
  PERSON_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  title: {
    default: `${PERSON_NAME} - ${PERSON_TITLE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    PERSON_NAME,
    "Vishnu VVR",
    "software engineer",
    "software engineer portfolio",
    "full-stack engineer",
    "RAG",
    "voice AI",
    "AI engineer",
    "TypeScript",
    "Next.js",
    "FactSet",
  ],
  authors: [{ name: PERSON_NAME, url: SITE_URL }],
  creator: PERSON_NAME,
  publisher: PERSON_NAME,
  category: "portfolio",
  icons: {
    icon: "/logo.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${PERSON_NAME} - ${PERSON_TITLE}`,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PERSON_NAME} - ${PERSON_TITLE}`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  archives: [GITHUB_URL],
  other: {
    "profile:first_name": "Vishnuvardhan",
    "profile:last_name": "Reddy",
    "profile:username": "VishnuVVR-369",
    "profile:linkedin": LINKEDIN_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

// TODO: add /notes route here when writing is ready to ship.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${dmSans.variable} ${geistMono.variable}`}
    >
      {/*
        — built with judgment, not with a template.
        — if you're reading the source, drop a line: hello@vvr.dev
      */}
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--color-accent)] focus:px-3 focus:py-2 focus:text-[var(--color-canvas)] focus:font-mono focus:text-xs"
        >
          skip to content
        </a>
        <SiteHeader />
        <ViewTransition>
          <main id="main">{children}</main>
        </ViewTransition>
        <SiteFooter />
        <CommandPalette />
        <Analytics />
      </body>
    </html>
  );
}
