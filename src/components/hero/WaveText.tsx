"use client";

import { Fragment, type CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";

interface WaveTextProps {
  text: string;
  visible: boolean;
  reducedMotion: boolean;
  /** Seconds to wait (after `visible`) before this text's wave begins. */
  startDelay: number;
  /** Per-character stagger — the spacing of the wave. */
  step: number;
  as?: "h1" | "p";
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders text so each character rises and fades in one after another,
 * producing a gentle left-to-right wave — the letters appearing as if
 * conjured. Spaces are real breakable text nodes, so multi-word lines still
 * wrap naturally. Reduced motion collapses the wave to a single soft fade.
 */
export function WaveText({
  text,
  visible,
  reducedMotion,
  startDelay,
  step,
  as = "p",
  className,
  style,
}: WaveTextProps) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: startDelay,
        staggerChildren: reducedMotion ? 0 : step,
      },
    },
  };

  const char: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reducedMotion ? 0.3 : 0.55, ease: [0.34, 1.2, 0.64, 1] },
    },
  };

  const MotionTag = as === "h1" ? motion.h1 : motion.p;

  return (
    <MotionTag
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <Fragment key={i}> </Fragment>
        ) : (
          <motion.span key={i} variants={char} className="inline-block">
            {ch}
          </motion.span>
        )
      )}
    </MotionTag>
  );
}
