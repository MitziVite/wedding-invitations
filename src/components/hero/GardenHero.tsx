"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeroTextOverlay } from "./HeroTextOverlay";
import { GardenLanternGlow } from "./GardenLanternGlow";
import { SparkleField } from "./SparkleField";

const GARDEN_SRC = "/images/hero/garden-desktop.png";

// The garden resolves out of a soft luminous haze (a dreamy, "magical"
// focus-in), a warm dawn-bloom blooms from the sunset and fades, then the
// hero text waves in.
const IMAGE_REVEAL_S = 1.9;
const TEXT_START_S = 1.45;
const DEBUG_TARGET_S = 5.5;
const DEBUG_SPEED_MULTIPLIER = DEBUG_TARGET_S / IMAGE_REVEAL_S;

interface GardenHeroProps {
  revealed: boolean;
  reducedMotion: boolean;
  debugReveal?: boolean;
}

interface LanternSpot {
  x: number;
  y: number;
  size: number;
  delay: number;
  pulseDuration: number;
}

const LANTERN_SPOTS: LanternSpot[] = [
  { x: 8, y: 47, size: 70, delay: 0.9, pulseDuration: 3.2 },
  { x: 24, y: 83, size: 60, delay: 1.05, pulseDuration: 3.6 },
  { x: 52, y: 66, size: 55, delay: 0.75, pulseDuration: 4.0 },
  { x: 83, y: 76, size: 65, delay: 1.2, pulseDuration: 4.4 },
];

export function GardenHero({ revealed, reducedMotion, debugReveal = false }: GardenHeroProps) {
  const speed = debugReveal ? DEBUG_SPEED_MULTIPLIER : 1;

  // Read once at mount: a returning visitor within the session (revealed
  // already true) starts settled, without replaying the reveal.
  const [typographyVisible, setTypographyVisible] = useState(revealed);

  useEffect(() => {
    if (!revealed || typographyVisible) return;
    const delayMs = reducedMotion ? 300 : TEXT_START_S * speed * 1000;
    const timer = window.setTimeout(() => setTypographyVisible(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [revealed, reducedMotion, typographyVisible, speed]);

  const imageDuration = reducedMotion ? 0.45 : IMAGE_REVEAL_S * speed;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Warm dark ground beneath the haze, so there's no hard flash. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 52% 42%, #2a1d15 0%, #1a120d 55%, #120d0a 100%)",
        }}
      />

      {/* Garden: resolves from a soft, dim, desaturated haze into full clarity. */}
      <motion.picture
        className="absolute inset-0 block h-full w-full"
        initial={false}
        animate={
          revealed
            ? { opacity: 1, scale: 1, filter: "blur(0px) saturate(1) brightness(1)" }
            : { opacity: 0, scale: 1.06, filter: "blur(9px) saturate(0.8) brightness(0.82)" }
        }
        transition={{ duration: imageDuration, ease: [0.22, 1, 0.36, 1] }}
      >
        <source media="(min-width: 768px)" srcSet={GARDEN_SRC} />
        {/* eslint-disable-next-line @next/next/no-img-element -- <picture> art-direction switching isn't supported by next/image */}
        <img src={GARDEN_SRC} alt="" className="h-full w-full object-cover" />
      </motion.picture>

      {/* Dawn bloom: a warm glow swells from the sunset and dissolves. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 52% 40%, rgba(255,214,150,0.6) 0%, rgba(255,196,120,0.22) 32%, rgba(255,196,120,0) 58%)",
          mixBlendMode: "screen",
        }}
        initial={false}
        animate={revealed ? { opacity: [0, 0.9, 0] } : { opacity: 0 }}
        transition={{ duration: imageDuration, times: [0, 0.35, 1], ease: "easeOut" }}
      />

      <SparkleField revealed={revealed} reducedMotion={reducedMotion} />

      {/* A few lanterns gently illuminating as the scene resolves. */}
      {LANTERN_SPOTS.map((spot, i) => (
        <GardenLanternGlow
          key={i}
          revealed={revealed}
          reducedMotion={reducedMotion}
          x={spot.x}
          y={spot.y}
          size={spot.size}
          delay={spot.delay * speed}
          pulseDuration={spot.pulseDuration}
        />
      ))}

      <HeroTextOverlay
        initials="J & M"
        subtitle="Our forever begins here"
        date="November 7, 2026"
        visible={typographyVisible}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
