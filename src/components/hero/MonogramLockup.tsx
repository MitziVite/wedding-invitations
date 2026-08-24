"use client";

import { motion, type Variants } from "framer-motion";

interface MonogramLockupProps {
  visible: boolean;
  reducedMotion: boolean;
  startDelay?: number;
  step?: number;
  className?: string;
}

interface Glyph {
  char: string;
  font: string;
  weight: number;
  amp?: boolean;
}

// The couple's monogram (chosen Version A): J and M in Bodoni Moda as the
// main initials, a softer Allura ampersand between them.
const GLYPHS: Glyph[] = [
  { char: "J", font: "var(--font-bodoni)", weight: 600 },
  { char: "&", font: "var(--font-allura)", weight: 400, amp: true },
  { char: "M", font: "var(--font-bodoni)", weight: 600 },
];

/**
 * The hero monogram lockup: J & M with mixed faces, revealed as a staggered
 * per-glyph wave (matching the rest of the hero text). J and M share a
 * baseline; the smaller script ampersand is nudged up (via relative `top`,
 * kept off `transform` so it doesn't fight the wave animation) to sit
 * optically centered between the initials.
 */
export function MonogramLockup({
  visible,
  reducedMotion,
  startDelay = 0,
  step = 0.09,
  className = "",
}: MonogramLockupProps) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: startDelay, staggerChildren: reducedMotion ? 0 : step },
    },
  };

  const glyph: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 14, scale: reducedMotion ? 1 : 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reducedMotion ? 0.3 : 0.6, ease: [0.34, 1.2, 0.64, 1] },
    },
  };

  return (
    <motion.h1
      className={`flex items-baseline justify-center ${className}`}
      style={{ fontSize: "clamp(4.75rem, 11vw, 10rem)", letterSpacing: "0.02em", lineHeight: 1.05 }}
      variants={container}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      {GLYPHS.map((g, i) => (
        <motion.span
          key={i}
          variants={glyph}
          className={g.amp ? "mx-2" : ""}
          style={{
            fontFamily: g.font,
            fontWeight: g.weight,
            display: "inline-block",
            ...(g.amp ? { fontSize: "0.6em", position: "relative", top: "-0.16em" } : {}),
          }}
        >
          {g.char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
