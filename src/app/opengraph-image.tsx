import { ImageResponse } from "next/og";

export const alt = "Mitzi & Josh — 7 de noviembre de 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const IVORY = "#f6f1e6";
const GOLD_TEXT = "#a3854f";
const GOLD_LINE = "#c7a56a";
const BLUSH = "#f3c3cd";
const DUSTY_BLUE = "#a9cae4";
const SAGE = "#93a884";

/** Satori (the renderer behind ImageResponse) needs real font bytes, not just a CSS font-family name — fetched once from Google Fonts. Cormorant Garamond matches the caps names on the couple's real printed invitation; Allura is the same script face already used for the "&" in the site's own hero monogram. */
async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`
  ).then((res) => res.text());
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`${family} font URL not found in Google Fonts CSS`);
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

/** Same pointed "vesica" leaf/petal silhouette used by CornerFloral and the itinerary vine — original vector shapes, not a reproduction of the couple's licensed invitation artwork, just echoing its blush/dusty-blue/sage palette. */
function petalPath(baseX: number, baseY: number, angleDeg: number, length: number, width: number): string {
  const rad = (angleDeg * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  const perpX = -dirY;
  const perpY = dirX;
  const tipX = baseX + dirX * length;
  const tipY = baseY + dirY * length;
  const midX = baseX + dirX * length * 0.5;
  const midY = baseY + dirY * length * 0.5;
  const bulge = width / 2;
  const c1x = midX + perpX * bulge;
  const c1y = midY + perpY * bulge;
  const c2x = midX - perpX * bulge;
  const c2y = midY - perpY * bulge;
  return `M ${baseX.toFixed(1)},${baseY.toFixed(1)} Q ${c1x.toFixed(1)},${c1y.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} Q ${c2x.toFixed(1)},${c2y.toFixed(1)} ${baseX.toFixed(1)},${baseY.toFixed(1)} Z`;
}

/** A loose cluster of petals/leaves growing from one corner — mirrored for the opposite corner via `flip`. */
function CornerBouquet({ flip = false }: { flip?: boolean }) {
  const shapes: Array<{ d: string; color: string }> = [
    { d: petalPath(0, 0, -100, 46, 30), color: SAGE },
    { d: petalPath(6, 4, -55, 40, 26), color: BLUSH },
    { d: petalPath(-4, 10, -30, 34, 24), color: DUSTY_BLUE },
    { d: petalPath(2, 18, -75, 30, 22), color: BLUSH },
    { d: petalPath(12, 2, -18, 26, 18), color: SAGE },
  ];
  return (
    <svg
      width="130"
      height="130"
      viewBox="-20 -20 100 100"
      style={{
        position: "absolute",
        top: -8,
        [flip ? "right" : "left"]: -8,
        ...(flip ? { transform: "scale(-1,-1)" } : {}),
      }}
    >
      {shapes.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} opacity={0.9} />
      ))}
    </svg>
  );
}

/**
 * Auto-detected by Next.js's file convention — no manual metadata wiring
 * needed, it becomes the site's og:image (and twitter:image fallback) for
 * link previews in WhatsApp, iMessage, etc. Deliberately matches the
 * couple's real printed invitation (ivory ground, thin gold frame,
 * tracked serif caps, a script "&", soft blush/dusty-blue/sage accents)
 * rather than the site's own darker envelope theme, so the link preview
 * reads as the same invitation guests already have in hand.
 */
export default async function OgImage() {
  const [cormorant, allura] = await Promise.all([
    loadGoogleFont("Cormorant Garamond", 600),
    loadGoogleFont("Allura", 400),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: IVORY,
        }}
      >
        {/* Thin double gold frame, inset from the edge, like the printed invitation's border. */}
        <div style={{ position: "absolute", top: 28, right: 28, bottom: 28, left: 28, border: `1px solid ${GOLD_LINE}` }} />
        <div style={{ position: "absolute", top: 38, right: 38, bottom: 38, left: 38, border: `1px solid ${GOLD_LINE}` }} />

        <CornerBouquet />
        <CornerBouquet flip />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontFamily: "Cormorant Garamond",
              fontSize: 22,
              letterSpacing: 6,
              color: GOLD_TEXT,
              textTransform: "uppercase",
            }}
          >
            Nos casamos
          </div>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              fontFamily: "Cormorant Garamond",
              fontSize: 84,
              letterSpacing: 8,
              color: GOLD_TEXT,
              textTransform: "uppercase",
            }}
          >
            <span>Mitzi</span>
            <span style={{ fontFamily: "Allura", fontSize: 56, margin: "0 26px", textTransform: "none" }}>&amp;</span>
            <span>Josh</span>
          </div>

          <div
            style={{
              marginTop: 22,
              fontFamily: "Cormorant Garamond",
              fontSize: 26,
              letterSpacing: 5,
              color: GOLD_TEXT,
              textTransform: "uppercase",
            }}
          >
            7 de noviembre de 2026
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: cormorant, style: "normal", weight: 600 },
        { name: "Allura", data: allura, style: "normal", weight: 400 },
      ],
    }
  );
}
