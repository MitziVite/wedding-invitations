"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface GardenLanternGlowProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
  x: number;
  y: number;
  size: number;
  glowRange: [number, number];
  pulseDuration: number;
}

/**
 * A single soft warm glow accent, fading in as the reveal nears completion.
 * `progress` already reflects the correct end state for reduced motion too
 * (it still animates to 1, just with duration 0 — see GardenHero), so this
 * derived opacity needs no separate reduced-motion branch of its own.
 */
export function GardenLanternGlow({
  progress,
  reducedMotion,
  x,
  y,
  size,
  glowRange,
  pulseDuration,
}: GardenLanternGlowProps) {
  const revealOpacity = useTransform(progress, glowRange, [0, 1]);

  return (
    <motion.div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        opacity: revealOpacity,
        background:
          "radial-gradient(circle, rgba(255,196,110,0.55) 0%, rgba(255,196,110,0.18) 45%, rgba(255,196,110,0) 75%)",
      }}
      animate={reducedMotion ? undefined : { scale: [1, 1.12, 1] }}
      transition={
        reducedMotion
          ? undefined
          : { duration: pulseDuration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
      }
    />
  );
}
