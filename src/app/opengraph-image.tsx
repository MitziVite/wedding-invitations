import { ImageResponse } from "next/og";

export const alt = "Mitzi & Josh — 7 de noviembre de 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Auto-detected by Next.js's file convention — no manual metadata wiring
 * needed, it becomes the site's og:image (and twitter:image fallback) for
 * link previews in WhatsApp, iMessage, etc. Those crawlers ignore the
 * noindex robots directive, so this is worth having even on a private,
 * unlisted invite site. Built with ImageResponse (not a static asset) so
 * it stays in sync with the site's actual color tokens with no separate
 * file to keep updated.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f6f0e6 0%, #efe1c8 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "serif",
            fontSize: 190,
            color: "#4b3024",
          }}
        >
          <span>M</span>
          <span style={{ color: "#c7a56a", fontSize: 130, margin: "0 28px" }}>&#38;</span>
          <span>J</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: "sans-serif",
            fontSize: 30,
            letterSpacing: 8,
            color: "#8e7e72",
            textTransform: "uppercase",
          }}
        >
          7 de noviembre de 2026
        </div>
      </div>
    ),
    { ...size }
  );
}
