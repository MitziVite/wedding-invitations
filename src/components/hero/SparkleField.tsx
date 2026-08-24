"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface SparkleFieldProps {
  revealed: boolean;
  reducedMotion: boolean;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  driftY: number;
  duration: number;
  delay: number;
  maxOpacity: number;
}

const SPARKLE_COUNT = 14;

/** mulberry32 — deterministic PRNG so server and client render identical sparkles. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A few soft floating motes of warm light — "fairy dust" drifting and
 * twinkling over the garden. Kept low-count and low-opacity so it reads as
 * enchanted atmosphere, not a loaded particle system. Disabled entirely for
 * reduced motion.
 */
export function SparkleField({ revealed, reducedMotion }: SparkleFieldProps) {
  const sparkles = useMemo<Sparkle[]>(() => {
    const rng = mulberry32(731013);
    return Array.from({ length: SPARKLE_COUNT }, () => ({
      x: 4 + rng() * 92,
      y: 12 + rng() * 78,
      size: 3 + rng() * 5,
      driftY: -(26 + rng() * 30),
      duration: 4.5 + rng() * 3,
      delay: rng() * 4,
      maxOpacity: 0.3 + rng() * 0.35,
    }));
  }, []);

  if (reducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
    >
      {sparkles.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background:
              "radial-gradient(circle, rgba(255,244,214,0.95) 0%, rgba(255,214,150,0.5) 45%, rgba(255,214,150,0) 75%)",
            filter: "blur(0.4px)",
          }}
          animate={{
            opacity: [0, s.maxOpacity, 0],
            y: [0, s.driftY],
            scale: [0.6, 1, 0.6],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
