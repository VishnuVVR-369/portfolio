import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
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
  title: "Vishnuvardhan Reddy — Software Engineer",
  description:
    "Full-stack software engineer building AI-powered systems and scalable web applications. 3+ years at FactSet.",
  keywords: [
    "software engineer",
    "full-stack developer",
    "AI",
    "RAG",
    "Next.js",
    "React",
    "Node.js",
  ],
  authors: [{ name: "Vishnuvardhan Reddy" }],
  openGraph: {
    title: "Vishnuvardhan Reddy — Software Engineer",
    description:
      "Full-stack software engineer building AI-powered systems and scalable web applications.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishnuvardhan Reddy — Software Engineer",
    description:
      "Full-stack software engineer building AI-powered systems and scalable web applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
