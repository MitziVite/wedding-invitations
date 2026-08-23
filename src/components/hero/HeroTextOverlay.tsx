"use client";

import { motion, type Variants } from "framer-motion";
import { TopDivider } from "./TopDivider";
import { BottomDivider } from "./BottomDivider";

interface HeroTextOverlayProps {
  initials: string;
  subtitle: string;
  date: string;
  visible: boolean;
  reducedMotion: boolean;
  className?: string;
}

/**
 * Centered couple-names / subtitle / date composition for the garden hero.
 * Animates in as a staggered sequence (initials -> divider -> subtitle ->
 * divider -> date) once `visible` is set — intended to fire after the
 * garden's own painterly reveal completes (see GardenHero), not on mount.
 */
export function HeroTextOverlay({
  initials,
  subtitle,
  date,
  visible,
  reducedMotion,
  className = "",
}: HeroTextOverlayProps) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reducedMotion ? 0 : 0.16 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0.3 : 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center px-6 ${className}`}
    >
      {/* Soft radial contrast layer — a gentle spotlight dimming behind the
          text, not a visible box, so the copy separates from the busiest
          part of the garden image without flattening it. */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(88vw, 880px)",
          height: "min(64vh, 560px)",
          background:
            "radial-gradient(ellipse 62% 58% at 50% 50%, rgba(18,13,10,0.4) 0%, rgba(18,13,10,0.24) 42%, rgba(18,13,10,0) 78%)",
        }}
      />

      <motion.div
        className="relative flex flex-col items-center text-center"
        style={{
          color: "#F2E2C8",
          textShadow: "0 1px 3px rgba(20,14,10,0.45), 0 4px 18px rgba(20,14,10,0.35)",
        }}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        variants={container}
      >
        <motion.h1
          variants={item}
          className="font-display font-medium text-balance"
          style={{
            fontSize: "clamp(5rem, 11vw, 10rem)",
            letterSpacing: "0.06em",
            lineHeight: 0.97,
          }}
        >
          {initials}
        </motion.h1>

        <motion.div variants={item} className="mt-5">
          <TopDivider />
        </motion.div>

        <motion.p
          variants={item}
          className="font-display text-balance mt-6 italic"
          style={{
            fontSize: "clamp(1.6rem, 3.2vw, 3.2rem)",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          {subtitle}
        </motion.p>

        <motion.div variants={item} className="mt-5">
          <BottomDivider />
        </motion.div>

        <motion.p
          variants={item}
          className="font-display mt-5 font-medium"
          style={{
            fontSize: "clamp(1.1rem, 1.8vw, 2rem)",
            letterSpacing: "0.06em",
            lineHeight: 1.2,
          }}
        >
          {date}
        </motion.p>
      </motion.div>
    </div>
  );
}
