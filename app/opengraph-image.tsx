import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vishnuvardhan Reddy — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Programmatic OG image — every shareable URL gets a typography-driven
// preview card in the site's palette. Mirrors the homepage hero:
// name → role → proof line → Guardian credential. No image asset.
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
          padding: "64px 72px",
          background:
            "radial-gradient(ellipse 70% 60% at 18% 12%, rgba(245,180,84,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 95% 100%, rgba(245,180,84,0.06) 0%, transparent 55%), #0a0a0b",
          color: "#eceae6",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar — logo + status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
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
                width: 42,
                height: 42,
                borderRadius: 8,
                background: "#060607",
                border: "1px solid #8a6024",
                color: "#f5b454",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              v
            </div>
            <span>~/vvr.dev</span>
          </div>
          {/* Guardian pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid #8a6024",
              background: "#131315",
              color: "#f5b454",
              fontSize: 18,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 22,
                borderRadius: 4,
                background: "#060607",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              LC
            </span>
            <span>guardian · 2150+</span>
          </div>
        </div>

        {/* Body — name + role + proof */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 108,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              fontWeight: 600,
              color: "#eceae6",
            }}
          >
            vishnuvardhan reddy
            <span style={{ color: "#f5b454" }}>.</span>
          </div>

          <div
            style={{
              fontSize: 36,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              fontWeight: 500,
              color: "#9a9a95",
              maxWidth: 900,
              display: "flex",
            }}
          >
            software engineer — building AI products &amp; data-intensive
            systems.
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginTop: 8,
              fontSize: 22,
              color: "#9a9a95",
            }}
          >
            <span style={{ color: "#5c5c58" }}>now ›</span>
            <span style={{ color: "#eceae6" }}>SWE III at FactSet</span>
            <span style={{ color: "#5c5c58" }}>·</span>
            <span>intern → swe III in 3 years</span>
          </div>
        </div>

        {/* Footer — credentials strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#5c5c58",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>live · chatwithpdf.pro · voiceflow · 3 platforms</span>
          <span style={{ color: "#f5b454" }}>vvr.dev</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
