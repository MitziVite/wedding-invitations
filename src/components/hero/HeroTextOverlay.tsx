"use client";

import { motion } from "framer-motion";
import { TopDivider } from "./TopDivider";
import { BottomDivider } from "./BottomDivider";
import { WaveText } from "./WaveText";

interface HeroTextOverlayProps {
  initials: string;
  subtitle: string;
  date: string;
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
const DATE_DELAY = 1.2;

/**
 * Centered couple-names / subtitle / date composition for the garden hero,
 * revealed as a staggered per-character wave once `visible` is set (intended
 * to fire as the garden finishes resolving — see GardenHero).
 */
export function HeroTextOverlay({
  initials,
  subtitle,
  date,
  visible,
  reducedMotion,
  className = "",
}: HeroTextOverlayProps) {
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
          width: "min(88vw, 880px)",
          height: "min(64vh, 560px)",
          background:
            "radial-gradient(ellipse 62% 58% at 50% 50%, rgba(18,13,10,0.4) 0%, rgba(18,13,10,0.24) 42%, rgba(18,13,10,0) 78%)",
        }}
      />

      <div
        className="relative flex flex-col items-center text-center"
        style={{
          color: "#F2E2C8",
          textShadow: "0 1px 3px rgba(20,14,10,0.45), 0 4px 18px rgba(20,14,10,0.35)",
        }}
      >
        <WaveText
          as="h1"
          text={initials}
          visible={visible}
          reducedMotion={reducedMotion}
          startDelay={INITIALS_DELAY}
          step={0.07}
          className="font-display font-medium text-balance"
          style={{ fontSize: "clamp(5rem, 11vw, 10rem)", letterSpacing: "0.06em", lineHeight: 0.97 }}
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

        <WaveText
          text={date}
          visible={visible}
          reducedMotion={reducedMotion}
          startDelay={DATE_DELAY}
          step={0.035}
          className="font-display mt-5 font-medium"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 2rem)", letterSpacing: "0.06em", lineHeight: 1.2 }}
        />
      </div>
    </div>
  );
}
