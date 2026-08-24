"use client";

import { motion } from "framer-motion";

interface RaindropCellProps {
  revealed: boolean;
  /** Global start delay for this drop (already scaled for debug speed). */
  baseDelay: number;
  /** Debug/production time scaling, applied to this drop's internal offsets. */
  speed: number;
  debug: boolean;
  /** Geometry, all in container pixels. */
  left: number;
  top: number;
  diameter: number;
  backgroundSize: string;
  backgroundPosition: string;
}

const IMAGE_SRC = "/images/hero/garden-desktop.png";
const DROP_MASK = "radial-gradient(circle at center, #000 40%, rgba(0,0,0,0.55) 60%, transparent 78%)";

// Internal timing (seconds, pre-speed): a highlight falls and hits, then two
// ripple rings spread out from the impact while the image circle fills in.
const FALL_DURATION = 0.3;
const IMPACT_OFFSET = 0.24;
const REVEAL_DURATION = 0.62;
const RING_DURATION = 0.72;
const RING2_EXTRA_DELAY = 0.14;

export function RaindropCell({
  revealed,
  baseDelay,
  speed,
  debug,
  left,
  top,
  diameter,
  backgroundSize,
  backgroundPosition,
}: RaindropCellProps) {
  const impactDelay = baseDelay + IMPACT_OFFSET * speed;
  const dotSize = Math.max(4, diameter * 0.1);
  const fall = diameter * 0.55;

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left, top, width: diameter, height: diameter }}
    >
      {/* Expanding ripple rings — the "ondas" spreading from the impact. */}
      {[0, RING2_EXTRA_DELAY].map((extra, ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid rgba(255, 238, 205, 0.55)" }}
          initial={false}
          animate={revealed ? { scale: [0.2, 1.5], opacity: [0.55, 0] } : { scale: 0.2, opacity: 0 }}
          transition={{
            delay: impactDelay + extra * speed,
            duration: RING_DURATION * speed,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Image circle — reveals with a soft ripple-like pop as the wave passes. */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage: `url(${IMAGE_SRC})`,
          backgroundRepeat: "no-repeat",
          backgroundSize,
          backgroundPosition,
          maskImage: DROP_MASK,
          WebkitMaskImage: DROP_MASK,
          ...(debug ? { outline: "1px solid rgba(255,255,255,0.7)" } : {}),
        }}
        initial={false}
        animate={revealed ? { scale: 1, opacity: 1 } : { scale: 0.15, opacity: 0 }}
        transition={{
          delay: impactDelay,
          duration: REVEAL_DURATION * speed,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      />

      {/* Falling highlight — the drop itself, landing at the center. */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: diameter / 2 - dotSize / 2,
          top: diameter / 2 - dotSize / 2,
          width: dotSize,
          height: dotSize,
          background:
            "radial-gradient(circle, rgba(255,246,224,0.95) 0%, rgba(255,246,224,0) 72%)",
        }}
        initial={false}
        animate={revealed ? { y: [-fall, 0, 0], opacity: [0, 1, 0] } : { y: -fall, opacity: 0 }}
        transition={{
          delay: baseDelay,
          duration: FALL_DURATION * speed,
          times: [0, 0.6, 1],
          ease: "easeIn",
        }}
      />
    </div>
  );
}
