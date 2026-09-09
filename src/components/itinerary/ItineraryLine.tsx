"use client";

import { motion } from "framer-motion";

/** Same pointed "vesica" leaf silhouette used elsewhere (CornerFloral, the old vine) — tapers to a point at both base and tip, bulging in the middle. */
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

const LEAF_PATHS = [leafShape(0, 0, -125, 9, 5.5), leafShape(0, 0, -55, 9, 5.5)];

/** A tiny two-leaf sprig growing up from the middle of a row's line. */
function LeafAccent() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="-9 -10 18 12"
      className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-gold"
      aria-hidden="true"
    >
      {LEAF_PATHS.map((d, i) => (
        <path key={i} d={d} fill="currentColor" opacity={0.75} />
      ))}
    </svg>
  );
}

/**
 * One row's decorative spine: a straight horizontal line spanning from the
 * first stop's node to the last, with a tiny leaf sprig above its
 * midpoint. Pure CSS positioning (percentages fixed by the 3-column grid
 * it sits behind) — no measurement, so it can't end up mismatched with
 * the row's real content on any device.
 */
export function ItineraryRowLine() {
  return (
    <div className="pointer-events-none absolute top-1.5 right-[16.6%] left-[16.6%] h-px" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/55 to-gold/0" />
      <LeafAccent />
    </div>
  );
}

interface ItineraryNodeProps {
  className?: string;
  reducedMotion?: boolean;
  /** Seconds to delay this node's own fade-in — pass the same value given to its event so both appear together. */
  delay?: number;
}

/** The small hollow-ring + filled-dot node marking one event on the line. */
export function ItineraryNode({ className = "", reducedMotion = true, delay = 0 }: ItineraryNodeProps) {
  return (
    <motion.div
      className={`relative h-3 w-3 shrink-0 ${className}`}
      aria-hidden="true"
      initial={reducedMotion ? false : { opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reducedMotion ? 0.3 : 0.4, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="absolute inset-0 rounded-full border border-gold" />
      <span className="absolute inset-[3px] rounded-full bg-gold" />
    </motion.div>
  );
}
