"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeroTextOverlay } from "./HeroTextOverlay";
import { GardenLanternGlow } from "./GardenLanternGlow";
import { SparkleField } from "./SparkleField";
import { LanternCalibrator } from "./LanternCalibrator";
import { useElementSize } from "./useElementSize";
import { coverBox, GARDEN_INTRINSIC } from "./coverGeometry";

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
  calibrate?: boolean;
}

interface LanternSpot {
  /** Position as a percentage of the source garden image (cover-crop aware). */
  x: number;
  y: number;
  size: number;
  revealDelay: number;
  flickerDuration: number;
  flickerDelay: number;
}

// Calibrated against the actual garden artwork with ?calibrate-lanterns=1.
// x/y are percentages of the SOURCE image, so they stay pinned to each
// painted flame at any viewport once mapped through the cover crop below.
// Optional `size` overrides the default: smaller for distant faint lanterns,
// a touch larger for the nearer, bigger ones.
const LANTERN_COORDS: ReadonlyArray<{ x: number; y: number; size?: number }> = [
  { x: 19.58, y: 7.06 },
  { x: 15.48, y: 8.43 },
  { x: 3.45, y: 6.43 },
  { x: 2.44, y: 18.59 },
  { x: 7.8, y: 28.21 },
  { x: 20.83, y: 37.31 },
  { x: 31.25, y: 33.18 },
  { x: 16.73, y: 88.92 },
  { x: 23.69, y: 83.32 },
  { x: 32.44, y: 85.64, size: 48 }, // near / larger
  { x: 35.48, y: 80.88 },
  { x: 41.31, y: 76.23 },
  { x: 41.61, y: 65.55 },
  { x: 50.0, y: 61.95 },
  { x: 56.79, y: 72.53 },
  { x: 63.39, y: 61.85 },
  { x: 36.49, y: 50.95, size: 15 }, // distant / smaller
  { x: 39.4, y: 52.54, size: 15 }, // distant / smaller
  { x: 42.68, y: 54.34, size: 15 }, // distant / smaller
  { x: 64.82, y: 83.1, size: 48 }, // near / larger
  { x: 73.21, y: 91.67 },
  { x: 78.93, y: 90.51, size: 48 }, // near / larger
  { x: 82.2, y: 63.43 },
];

// Deterministic 0..1 hash, so each lantern gets a stable but organically
// scattered value (no visible modulo pattern) between renders.
function hash01(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Per-lantern size + flicker timing. flickerDuration spans a wide range so
// some flames twinkle quickly (~0.9s) and others breathe slowly (~3.3s),
// each with its own phase, so they're clearly out of step.
const LANTERN_SPOTS: LanternSpot[] = LANTERN_COORDS.map((c, i) => ({
  x: c.x,
  y: c.y,
  size: c.size ?? 26 + ((i * 7) % 20),
  revealDelay: 0.7 + ((i * 5) % 13) * 0.05,
  flickerDuration: 0.9 + hash01(i + 1) * 2.4,
  flickerDelay: hash01((i + 1) * 7.3) * 2.6,
}));

export function GardenHero({
  revealed,
  reducedMotion,
  debugReveal = false,
  calibrate = false,
}: GardenHeroProps) {
  const speed = debugReveal ? DEBUG_SPEED_MULTIPLIER : 1;
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>();

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

  // Map each lantern's source-image % to a container pixel through the same
  // cover crop the <img> uses, so glows stay pinned to the painted flames.
  const box =
    width > 0 && height > 0
      ? coverBox(width, height, GARDEN_INTRINSIC.width, GARDEN_INTRINSIC.height)
      : null;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Warm dark ground beneath the haze, so there's no hard flash. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 52% 42%, #2a1d15 0%, #1a120d 55%, #120d0a 100%)",
        }}
      />

      {/* Ken Burns layer: once revealed, the whole scene breathes with an
          almost-imperceptible slow zoom + drift so the painting feels alive.
          Kept on a wrapper so it never fights the picture's own reveal scale;
          a small constant zoom (>1) guarantees the drift never exposes edges.
          Frozen for reduced motion. */}
      <motion.div
        className="absolute inset-0"
        style={{ willChange: "transform" }}
        initial={false}
        animate={
          reducedMotion
            ? { scale: 1 }
            : revealed
              ? { scale: [1.04, 1.105, 1.04], x: [0, -23, 0], y: [0, 13, 0] }
              : { scale: 1.04 }
        }
        transition={
          reducedMotion || !revealed
            ? { duration: 0 }
            : { duration: 20, delay: imageDuration, repeat: Infinity, ease: "easeInOut" }
        }
      >
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

        {/* Lanterns live INSIDE the Ken Burns layer so they share its exact
            transform — the flames stay pinned to the painted lanterns as the
            scene zooms and drifts. */}
        {box &&
          LANTERN_SPOTS.map((spot, i) => (
            <GardenLanternGlow
              key={i}
              revealed={revealed}
              reducedMotion={reducedMotion}
              left={box.offsetX + (spot.x / 100) * box.renderedW}
              top={box.offsetY + (spot.y / 100) * box.renderedH}
              size={spot.size}
              revealDelay={spot.revealDelay * speed}
              flickerDuration={spot.flickerDuration}
              flickerDelay={spot.flickerDelay}
            />
          ))}
      </motion.div>

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

      <HeroTextOverlay
        subtitle="Our forever begins here"
        date="November 7, 2026"
        visible={typographyVisible}
        reducedMotion={reducedMotion}
      />

      {calibrate && <LanternCalibrator />}
    </div>
  );
}
