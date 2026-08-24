"use client";

import { motion } from "framer-motion";

interface GardenLanternGlowProps {
  revealed: boolean;
  reducedMotion: boolean;
  x: number;
  y: number;
  size: number;
  delay: number;
  pulseDuration: number;
}

/** A single soft warm glow accent, fading in once the region behind it has been revealed. */
export function GardenLanternGlow({
  revealed,
  reducedMotion,
  x,
  y,
  size,
  delay,
  pulseDuration,
}: GardenLanternGlowProps) {
  return (
    <motion.div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background:
          "radial-gradient(circle, rgba(255,196,110,0.55) 0%, rgba(255,196,110,0.18) 45%, rgba(255,196,110,0) 75%)",
      }}
      initial={false}
      animate={revealed ? { opacity: 1, scale: [1, 1.12, 1] } : { opacity: 0, scale: 1 }}
      transition={
        reducedMotion
          ? { opacity: { duration: 0.3 } }
          : {
              opacity: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              scale: { delay, duration: pulseDuration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
            }
      }
    />
  );
}
