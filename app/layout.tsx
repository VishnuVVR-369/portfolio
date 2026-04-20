import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Geist, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { CommandPalette } from "./components/command-palette";
import { Analytics } from "@vercel/analytics/next";

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

const siteUrl = "https://vvr.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vishnuvardhan Reddy — Software Engineer",
    template: "%s · vvr.dev",
  },
  description:
    "Software engineer building systems where every decision can be defended. Three years at FactSet. RAG, voice AI, and full-stack.",
  keywords: [
    "Vishnuvardhan Reddy",
    "software engineer",
    "RAG",
    "AI engineer",
    "Next.js",
    "FactSet",
  ],
  authors: [{ name: "Vishnuvardhan Reddy", url: siteUrl }],
  creator: "Vishnuvardhan Reddy",
  icons: {
    icon: "/logo.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Vishnuvardhan Reddy — Software Engineer",
    description:
      "I build systems where every decision can be defended. RAG, voice AI, full-stack at scale.",
    siteName: "vvr.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishnuvardhan Reddy — Software Engineer",
    description:
      "I build systems where every decision can be defended. RAG, voice AI, full-stack at scale.",
  },
  robots: { index: true, follow: true },
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
