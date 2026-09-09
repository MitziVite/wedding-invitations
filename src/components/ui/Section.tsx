"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CornerFloral, type FloralCorner, type FloralVariant } from "./CornerFloral";

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
  /** Quiet botanical accents tucked into corners — omit to leave the section undecorated (e.g. the itinerary already has the vine's own foliage). Usually a diagonal pair, one per opposite corner. */
  florals?: Array<{ variant: FloralVariant; corner: FloralCorner }>;
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
export function Section({
  id,
  tone = "ivory",
  children,
  className = "",
  maxWidth = "max-w-2xl",
  paddingY = "py-20 sm:py-24",
  fullHeight = false,
  florals = [],
}: SectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      className={`relative w-full px-6 ${paddingY} ${TONE_CLASS[tone]} ${fullHeight ? "flex min-h-svh flex-col justify-center" : ""}`}
    >
      {florals.map(({ variant, corner }) => (
        <CornerFloral key={corner} variant={variant} corner={corner} />
      ))}
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
