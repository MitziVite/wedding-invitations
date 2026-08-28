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
}

const TONE_CLASS: Record<Tone, string> = {
  ivory: "bg-ivory text-espresso",
  parchment: "bg-parchment text-espresso",
  blush: "bg-blush text-espresso",
  celadon: "bg-celadon text-espresso",
  cocoa: "bg-cocoa text-ivory",
};

/**
 * A content section with consistent vertical rhythm and a gentle fade-up as
 * it scrolls into view (once). Tone sets the palette so sections can
 * alternate. Reveal is disabled for reduced motion.
 */
export function Section({ id, tone = "ivory", children, className = "", maxWidth = "max-w-2xl" }: SectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section id={id} className={`w-full px-6 py-20 sm:py-24 ${TONE_CLASS[tone]}`}>
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
