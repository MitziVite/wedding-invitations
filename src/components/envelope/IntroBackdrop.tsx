"use client";

import { motion } from "framer-motion";

interface IntroBackdropProps {
  isOpen: boolean;
  reducedMotion: boolean;
}

/** Tiny tiled fractal-noise SVG, blended at very low opacity for a subtle cinematic grain. */
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function IntroBackdrop({ isOpen, reducedMotion }: IntroBackdropProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0.5 : 1.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 42%, rgba(190,155,77,0.13) 0%, rgba(46,33,27,0.93) 38%, rgba(14,10,8,0.98) 68%, #0c0806 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: 0.05,
          mixBlendMode: "overlay",
        }}
      />
    </motion.div>
  );
}
