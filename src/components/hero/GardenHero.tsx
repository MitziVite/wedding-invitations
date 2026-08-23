"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  animate as animateMotionValue,
} from "framer-motion";
import { HeroTextOverlay } from "./HeroTextOverlay";
import { GardenLanternGlow } from "./GardenLanternGlow";

interface GardenHeroProps {
  revealed: boolean;
  reducedMotion: boolean;
}

const REVEAL_DURATION_S = 2.1;
const MAX_MASK_SIZE_PX = 4200;

/**
 * A single irregular, blurred blob (hand-authored — see the asset-prep
 * script run alongside this component) used as a CSS mask. Scaling this
 * shape's mask-size from 0 up to a large pixel value, anchored at the
 * sunset/path focal point, gives an organic, soft-edged "painted into
 * existence" reveal rather than a geometric wipe. Pixel (not percentage)
 * mask-size keeps the blob's own aspect intact regardless of the
 * container's shape.
 */
const REVEAL_MASK_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>` +
      `<filter id='b' x='-60%' y='-60%' width='220%' height='220%'>` +
      `<feGaussianBlur stdDeviation='30'/>` +
      `</filter>` +
      `<path d='M 520,300 C 523.4,331.8 466.1,365.6 441.6,402.9 C 417,440.1 406.5,508.9 372.6,523.5 ` +
      `C 338.7,538.1 271.2,512.3 238.2,490.2 C 205.2,468.1 199.3,422.8 174.6,391.1 ` +
      `C 149.9,359.4 102.1,339.2 90,300 C 77.9,260.8 76.1,184.5 101.8,156 ` +
      `C 127.5,127.5 200.8,137.3 244.4,128.8 C 288,120.3 333.9,91.2 363.3,105 ` +
      `C 392.8,118.9 395.2,179.3 421.4,211.8 C 447.5,244.3 516.6,268.2 520,300 Z' ` +
      `fill='white' filter='url(#b)'/>` +
      `</svg>`
  );

interface LanternSpot {
  x: number;
  y: number;
  size: number;
  glowRange: [number, number];
  pulseDuration: number;
}

/** Approximate positions of a few visible lanterns in the garden artwork, as % of the image. */
const LANTERN_SPOTS: LanternSpot[] = [
  { x: 8, y: 47, size: 70, glowRange: [0.6, 0.76], pulseDuration: 3.2 },
  { x: 24, y: 83, size: 60, glowRange: [0.66, 0.82], pulseDuration: 3.6 },
  { x: 52, y: 66, size: 55, glowRange: [0.73, 0.89], pulseDuration: 4.0 },
  { x: 83, y: 76, size: 65, glowRange: [0.8, 0.96], pulseDuration: 4.4 },
];

export function GardenHero({ revealed, reducedMotion }: GardenHeroProps) {
  // Initial values read `revealed` once, at mount, only — correctly
  // starting already-settled for a returning visitor within the same
  // session (revealed is true from the very first render in that case)
  // without replaying the painterly reveal.
  const progress = useMotionValue(revealed ? 1 : 0);
  const [typographyVisible, setTypographyVisible] = useState(revealed);

  useEffect(() => {
    if (!revealed || progress.get() >= 1) return;
    // A 0-duration animate() still resolves through the same onComplete
    // path, so reduced motion reuses this one code path instead of a
    // separate synchronous branch.
    const controls = animateMotionValue(progress, 1, {
      duration: reducedMotion ? 0 : REVEAL_DURATION_S,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setTypographyVisible(true),
    });
    return () => controls.stop();
  }, [revealed, reducedMotion, progress]);

  const maskSizePx = useTransform(progress, [0, 1], [0, MAX_MASK_SIZE_PX]);
  const maskSize = useMotionTemplate`${maskSizePx}px ${maskSizePx}px`;

  return (
    <div className="relative h-full w-full overflow-hidden bg-coffee">
      {/* Base layer: always slightly blurred, desaturated, and dark — the
          "rough sketch" the clear scene gets painted over. Static filter,
          not animated, so nothing expensive runs per frame. */}
      <picture className="absolute inset-0 block h-full w-full">
        <source media="(min-width: 768px)" srcSet="/images/hero/garden-desktop.png" />
        <img
          src="/images/hero/garden-desktop.png"
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: "blur(10px) saturate(0.72) brightness(0.72)" }}
        />
      </picture>

      {/* Clear layer: full clarity, revealed by the growing blob mask. */}
      <motion.picture
        className="absolute inset-0 block h-full w-full"
        style={{
          maskImage: `url("${REVEAL_MASK_SVG}")`,
          WebkitMaskImage: `url("${REVEAL_MASK_SVG}")`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "52% 46%",
          WebkitMaskPosition: "52% 46%",
          maskSize,
          WebkitMaskSize: maskSize,
        }}
      >
        <source media="(min-width: 768px)" srcSet="/images/hero/garden-desktop.png" />
        {/* eslint-disable-next-line @next/next/no-img-element -- <picture> art-direction switching isn't supported by next/image */}
        <img src="/images/hero/garden-desktop.png" alt="" className="h-full w-full object-cover" />
      </motion.picture>

      {/* A few lanterns gently illuminating as the reveal nears completion. */}
      {LANTERN_SPOTS.map((spot, i) => (
        <GardenLanternGlow
          key={i}
          progress={progress}
          reducedMotion={reducedMotion}
          x={spot.x}
          y={spot.y}
          size={spot.size}
          glowRange={spot.glowRange}
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
