import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vishnuvardhan Reddy — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Programmatic OG image — every shareable URL gets a typography-driven
// preview card in the site's palette. No image asset needed.
export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(ellipse 70% 60% at 18% 12%, rgba(245,180,84,0.16) 0%, transparent 60%), #0a0a0b",
          color: "#eceae6",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: "#9a9a95",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#18181b",
              border: "1px solid #8a6024",
              color: "#f5b454",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            v
          </div>
          <span>~/vvr.dev</span>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div
            style={{
              fontSize: 110,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 600,
              color: "#eceae6",
            }}
          >
            vishnuvardhan
          </div>
          <div
            style={{
              fontSize: 110,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 600,
              color: "#9a9a95",
            }}
          >
            reddy.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 24,
              fontSize: 30,
              color: "#eceae6",
            }}
          >
            <span style={{ color: "#5c5c58" }}>›</span>
            <span style={{ color: "#9a9a95" }}>thesis ·</span>
            <span>i build systems where every decision can be defended.</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#5c5c58",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>software engineer · factset · 3+ years</span>
          <span style={{ color: "#f5b454" }}>vvr.dev</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
