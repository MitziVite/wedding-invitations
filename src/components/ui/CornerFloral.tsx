export type FloralVariant = "sprig" | "flower";
export type FloralCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "mid-left"
  | "mid-right";

const CORNER_POSITION: Record<FloralCorner, string> = {
  "top-left": "top-6 left-6",
  "top-right": "top-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "bottom-6 right-6",
  "mid-left": "top-1/2 left-6",
  "mid-right": "top-1/2 right-6",
};

/** Same pointed "vesica" leaf silhouette used by the itinerary vine (windingPath.ts's leafShape) — tapers to a point at both base and tip, bulging in the middle. */
function leafShape(baseX: number, baseY: number, angleDeg: number, length: number, width: number): string {
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

const SPRIG_LEAVES = [leafShape(16, 60, -140, 16, 9), leafShape(24, 38, -40, 18, 10), leafShape(40, 12, -95, 20, 10)];

const FLOWER_PETALS = [-90, -18, 54, 126, 198].map((a) => leafShape(35, 28, a, 15, 10));
const FLOWER_LEAVES = [leafShape(30, 60, -150, 14, 8), leafShape(24, 78, -30, 14, 8)];

interface CornerFloralProps {
  variant: FloralVariant;
  corner: FloralCorner;
  /** Hidden by default on mobile — decorative only, and the tightest screens don't have room to spare. */
  className?: string;
}

/**
 * A quiet botanical accent tucked into one corner of a section — a simple
 * leaf sprig or a small flower, drawn with the same pointed-leaf silhouette
 * as the itinerary vine so it reads as part of the same hand-drawn family.
 * Mirrored per corner so growth always reads as reaching out of that
 * corner (up from the bottom corners, hanging down from the top ones)
 * rather than the same fixed artwork just relocated.
 */
export function CornerFloral({ variant, corner, className = "" }: CornerFloralProps) {
  const flipX = corner.endsWith("right") ? -1 : 1;
  const flipY = corner.startsWith("top") ? -1 : 1;
  const vCenter = corner.startsWith("mid") ? "translateY(-50%) " : "";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute hidden text-gold sm:block ${CORNER_POSITION[corner]} ${className}`}
      style={{ transform: `${vCenter}scale(${flipX}, ${flipY})`, opacity: 0.42 }}
    >
      {variant === "sprig" ? (
        <svg width="52" height="66" viewBox="0 0 70 90" fill="none">
          <path d="M14,82 Q10,45 40,12" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {SPRIG_LEAVES.map((d, i) => (
            <path key={i} d={d} fill="currentColor" />
          ))}
        </svg>
      ) : (
        <svg width="52" height="74" viewBox="0 0 70 100" fill="none">
          <path d="M35,40 Q40,65 18,92" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {FLOWER_LEAVES.map((d, i) => (
            <path key={i} d={d} fill="currentColor" />
          ))}
          {FLOWER_PETALS.map((d, i) => (
            <path key={i} d={d} fill="currentColor" opacity={0.85} />
          ))}
          <circle cx="35" cy="28" r="3" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}
