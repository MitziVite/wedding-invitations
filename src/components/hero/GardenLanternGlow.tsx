"use client";

import { motion } from "framer-motion";

interface GardenLanternGlowProps {
  revealed: boolean;
  reducedMotion: boolean;
  /** Position in container pixels (already mapped through the cover crop). */
  left: number;
  top: number;
  /** Glow diameter in pixels. */
  size: number;
  /** Seconds after reveal starts before this lantern lights up. */
  revealDelay: number;
  /** Length of one flicker cycle (varied per lantern so they don't sync). */
  flickerDuration: number;
  /** Phase offset so lanterns flicker out of step with each other. */
  flickerDelay: number;
}

// Irregular candle-flicker keyframes — uneven on purpose so it reads as a
// live flame breathing, not a smooth sine pulse.
const FLICKER_OPACITY = [0.55, 0.95, 0.62, 1, 0.72, 0.86, 0.55];
const FLICKER_SCALE = [1, 1.06, 0.97, 1.07, 1.0, 1.04, 1];

const GLOW_BACKGROUND =
  "radial-gradient(circle, rgba(255,201,128,0.9) 0%, rgba(255,183,105,0.4) 40%, rgba(255,183,105,0) 72%)";

/**
 * A single lantern flame: fades in once its area of the scene resolves, then
 * flickers perpetually. An outer layer owns the reveal fade so it composes
 * cleanly with the inner layer's endless flicker loop.
 */
export function GardenLanternGlow({
  revealed,
  reducedMotion,
  left,
  top,
  size,
  revealDelay,
  flickerDuration,
  flickerDelay,
}: GardenLanternGlowProps) {
  return (
    <motion.div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, width: size, height: size }}
      initial={false}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ delay: reducedMotion ? 0 : revealDelay, duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="h-full w-full rounded-full"
        style={{ background: GLOW_BACKGROUND }}
        animate={reducedMotion ? { opacity: 0.85 } : { opacity: FLICKER_OPACITY, scale: FLICKER_SCALE }}
        transition={
          reducedMotion
            ? { duration: 0.3 }
            : {
                duration: flickerDuration,
                delay: flickerDelay,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
        }
      />
    </motion.div>
  );
}
