"use client";

import { motion } from "framer-motion";
import { TopDivider } from "./TopDivider";
import { BottomDivider } from "./BottomDivider";
import { WaveText } from "./WaveText";
import { MonogramLockup } from "./MonogramLockup";

interface HeroTextOverlayProps {
  subtitle: string;
  visible: boolean;
  reducedMotion: boolean;
  className?: string;
}

// Each block's wave begins a beat after the previous one, so the whole
// composition assembles top-to-bottom like it's being written by magic.
const INITIALS_DELAY = 0;
const DIVIDER1_DELAY = 0.4;
const SUBTITLE_DELAY = 0.55;
const DIVIDER2_DELAY = 1.05;

/**
 * Centered couple-names / subtitle composition for the garden hero, revealed
 * as a staggered per-character wave once `visible` is set (intended to fire
 * as the garden finishes resolving — see GardenHero). The date is left to
 * the welcome card just below, which already gives it a proper framed
 * treatment — repeating it here read as redundant right under the monogram.
 */
export function HeroTextOverlay({ subtitle, visible, reducedMotion, className = "" }: HeroTextOverlayProps) {
  const dividerTransition = (delay: number) => ({
    delay: reducedMotion ? 0 : delay,
    duration: reducedMotion ? 0.3 : 0.6,
    ease: [0.22, 1, 0.36, 1] as const,
  });

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center px-6 ${className}`}
    >
      {/* Soft radial contrast layer — a gentle spotlight, not a visible box. */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(92vw, 940px)",
          height: "min(70vh, 600px)",
          background:
            "radial-gradient(ellipse 62% 58% at 50% 50%, rgba(16,11,8,0.62) 0%, rgba(16,11,8,0.42) 44%, rgba(16,11,8,0) 80%)",
        }}
      />

      <div
        className="relative flex flex-col items-center text-center"
        style={{
          color: "#F5E7C6",
          textShadow: "0 1px 4px rgba(18,12,8,0.7), 0 6px 24px rgba(18,12,8,0.55)",
        }}
      >
        <MonogramLockup
          visible={visible}
          reducedMotion={reducedMotion}
          startDelay={INITIALS_DELAY}
          className="fairy-initials"
        />

        <motion.div
          className="mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={dividerTransition(DIVIDER1_DELAY)}
        >
          <TopDivider />
        </motion.div>

        <WaveText
          text={subtitle}
          visible={visible}
          reducedMotion={reducedMotion}
          startDelay={SUBTITLE_DELAY}
          step={0.024}
          className="font-display text-balance mt-6 italic"
          style={{ fontSize: "clamp(1.6rem, 3.2vw, 3.2rem)", letterSpacing: "0.02em", lineHeight: 1.2 }}
        />

        <motion.div
          className="mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={dividerTransition(DIVIDER2_DELAY)}
        >
          <BottomDivider />
        </motion.div>
      </div>
    </div>
  );
}
