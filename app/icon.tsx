import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Browser-tab icon. The "v" mark on a dark tile with amber border —
// matches the inline header glyph used in the programmatic OG image.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#f5b454",
          border: "3px solid #8a6024",
          borderRadius: 12,
          fontFamily: "sans-serif",
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        v
      </div>
    ),
    { ...size }
  );
}
