import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon. Slightly more refined than the favicon — fuller
// border, ambient glow behind the mark, matches the bureau aesthetic.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 38%, rgba(245,180,84,0.22) 0%, transparent 55%), #0a0a0b",
          color: "#f5b454",
          fontFamily: "sans-serif",
          fontSize: 124,
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
