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
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#f5b454"
                aria-hidden
              >
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.265 5.265 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
              </svg>
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
