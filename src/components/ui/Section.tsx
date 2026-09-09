"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Tone = "ivory" | "parchment" | "blush" | "celadon" | "cocoa";

interface SectionProps {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  /** Override the default max-w-2xl content column — e.g. the timeline wants more room to wind. */
  maxWidth?: string;
  /** Override the default py-20 sm:py-24 vertical rhythm — e.g. the timeline needs to fit tighter to a single screen. */
  paddingY?: string;
  /** At least one full viewport tall, content vertically centered — matches the hero and welcome sections. Content taller than the viewport (e.g. the itinerary) still grows past it normally. */
  fullHeight?: boolean;
  /** A near-invisible paper-grain overlay — same technique as the envelope's grain in IntroBackdrop, just tuned coarser/fibrous. Experimental: opt in per section while we try it out. */
  textured?: boolean;
}

const TONE_CLASS: Record<Tone, string> = {
  ivory: "bg-ivory text-espresso",
  parchment: "bg-parchment text-espresso",
  blush: "bg-blush text-espresso",
  celadon: "bg-celadon text-espresso",
  cocoa: "bg-cocoa text-ivory",
};

/** Tiled fractal-noise SVG, coarser/more fibrous than the envelope's grain — reads as paper, not leather. */
const PAPER_GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * A content section with consistent vertical rhythm and a gentle fade-up as
 * it scrolls into view (once). Tone sets the palette so sections can
 * alternate. Reveal is disabled for reduced motion.
 */
export function Section({
  id,
  tone = "ivory",
  children,
  className = "",
  maxWidth = "max-w-2xl",
  paddingY = "py-20 sm:py-24",
  fullHeight = false,
  textured = false,
}: SectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      className={`relative w-full px-6 ${paddingY} ${TONE_CLASS[tone]} ${fullHeight ? "flex min-h-dvh flex-col justify-center" : ""}`}
    >
      {textured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("${PAPER_GRAIN_SVG}")`,
            backgroundRepeat: "repeat",
            opacity: 0.12,
            mixBlendMode: "overlay",
          }}
        />
      )}
      <motion.div
        className={`mx-auto w-full ${maxWidth} ${className}`}
        initial={reducedMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reducedMotion ? 0.3 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
