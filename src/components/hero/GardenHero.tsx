"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HeroTextOverlay } from "./HeroTextOverlay";
import { GardenLanternGlow } from "./GardenLanternGlow";
import { RaindropCell } from "./RaindropCell";
import { useElementSize } from "./useElementSize";
import {
  generateRaindrops,
  GARDEN_INTRINSIC,
  FULL_FADE_START_S,
  FULL_FADE_DURATION_S,
  REVEAL_COMPLETE_S,
  DEBUG_SPEED_MULTIPLIER,
} from "./gardenRaindrops";

const GARDEN_SRC = "/images/hero/garden-desktop.png";

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

/** Positions of a few visible lanterns in the garden artwork, timed to ignite as the reveal fills in. */
const LANTERN_SPOTS: LanternSpot[] = [
  { x: 8, y: 47, size: 70, delay: 1.0, pulseDuration: 3.2 },
  { x: 24, y: 83, size: 60, delay: 1.2, pulseDuration: 3.6 },
  { x: 52, y: 66, size: 55, delay: 0.7, pulseDuration: 4.0 },
  { x: 83, y: 76, size: 65, delay: 1.35, pulseDuration: 4.4 },
];

export function GardenHero({ revealed, reducedMotion, debugReveal = false }: GardenHeroProps) {
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>();
  const drops = useMemo(() => generateRaindrops(), []);
  const speed = debugReveal ? DEBUG_SPEED_MULTIPLIER : 1;

  // Read once at mount: a returning visitor within the session (revealed
  // already true) skips straight to the settled state; reduced motion also
  // skips the raindrops for a plain quick fade.
  const [typographyVisible, setTypographyVisible] = useState(revealed);
  const [dropsMounted, setDropsMounted] = useState(!revealed && !reducedMotion);

  useEffect(() => {
    if (!revealed || typographyVisible) return;
    const revealMs = reducedMotion ? 300 : REVEAL_COMPLETE_S * speed * 1000 + 150;
    const textTimer = window.setTimeout(() => setTypographyVisible(true), revealMs);
    // Free the per-drop compositor layers once the full image has taken
    // over (skip in debug so the drops stay inspectable).
    const dropTimer =
      debugReveal || reducedMotion
        ? undefined
        : window.setTimeout(() => setDropsMounted(false), revealMs + 400);
    return () => {
      window.clearTimeout(textTimer);
      if (dropTimer) window.clearTimeout(dropTimer);
    };
  }, [revealed, reducedMotion, typographyVisible, debugReveal, speed]);

  // Cover-fit math so each drop's slice of the image lines up exactly with
  // the full-image layer underneath/over it.
  const coverScale =
    width > 0 && height > 0
      ? Math.max(width / GARDEN_INTRINSIC.width, height / GARDEN_INTRINSIC.height)
      : 0;
  const coverW = GARDEN_INTRINSIC.width * coverScale;
  const coverH = GARDEN_INTRINSIC.height * coverScale;
  const offsetX = (width - coverW) / 2;
  const offsetY = (height - coverH) / 2;
  const minDim = Math.min(width, height);
  const canRenderDrops = dropsMounted && width > 0 && height > 0;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Warm dark ground — the only thing visible before the reveal starts. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 52% 42%, #2a1d15 0%, #1a120d 55%, #120d0a 100%)",
        }}
      />

      {/* Raindrops: each falls, ripples, and reveals its slice of the garden. */}
      {canRenderDrops &&
        drops.map((drop, i) => {
          const diameter = drop.sizeFactor * minDim;
          const r = diameter / 2;
          const left = drop.fx * width - r;
          const top = drop.fy * height - r;
          return (
            <RaindropCell
              key={i}
              revealed={revealed}
              baseDelay={drop.delay * speed}
              speed={speed}
              debug={debugReveal}
              left={left}
              top={top}
              diameter={diameter}
              backgroundSize={`${coverW}px ${coverH}px`}
              backgroundPosition={`${offsetX - left}px ${offsetY - top}px`}
            />
          );
        })}

      {/* Full garden layer: fades in at the end to complete coverage seamlessly. */}
      <motion.picture
        className="absolute inset-0 block h-full w-full"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{
          delay: reducedMotion ? 0 : FULL_FADE_START_S * speed,
          duration: reducedMotion ? 0.4 : FULL_FADE_DURATION_S * speed,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <source media="(min-width: 768px)" srcSet={GARDEN_SRC} />
        {/* eslint-disable-next-line @next/next/no-img-element -- <picture> art-direction switching isn't supported by next/image */}
        <img src={GARDEN_SRC} alt="" className="h-full w-full object-cover" />
      </motion.picture>

      {/* A few lanterns gently illuminating as the scene fills in. */}
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
