/**
 * Deterministic "raindrop" reveal: many small, soft-edged circular drops of
 * the garden image that appear scattered and accumulate from the sunset
 * focal point outward, so the scene resolves gradually like rain filling a
 * pane rather than in a few coarse blocks. A separate full-image layer
 * fades in at the very end to guarantee 100% coverage with no pinholes.
 *
 * Positions come from a seeded PRNG so the server and client render the
 * exact same layout (no hydration mismatch), and so the look is stable
 * between reloads.
 */

export interface Raindrop {
  /** Center as a fraction of container width/height (can slightly exceed 0..1 to cover edges). */
  fx: number;
  fy: number;
  /** Diameter as a fraction of the container's smaller dimension. */
  sizeFactor: number;
  /** Seconds after the reveal starts that this drop begins appearing (pre-speed-scaling). */
  delay: number;
}

export const RAINDROP_COUNT = 50;

/** Natural pixel dimensions of the garden source, for cover-fit math. */
export const GARDEN_INTRINSIC = { width: 1672, height: 941 } as const;

export const DROP_STAGGER_WINDOW_S = 1.35;
export const DROP_DURATION_S = 0.55;
export const FULL_FADE_START_S = 1.3;
export const FULL_FADE_DURATION_S = 0.65;

/** When the whole reveal settles — typography starts after this. */
export const REVEAL_COMPLETE_S = Math.max(
  DROP_STAGGER_WINDOW_S + DROP_DURATION_S,
  FULL_FADE_START_S + FULL_FADE_DURATION_S
);

/** Debug mode stretches the whole sequence to roughly this long. */
export const DEBUG_TARGET_DURATION_S = 6;
export const DEBUG_SPEED_MULTIPLIER = DEBUG_TARGET_DURATION_S / REVEAL_COMPLETE_S;

const FOCAL = { x: 0.52, y: 0.42 };

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateRaindrops(): Raindrop[] {
  const rng = mulberry32(20260824);
  const drops = Array.from({ length: RAINDROP_COUNT }, () => {
    const fx = -0.08 + rng() * 1.16;
    const fy = -0.08 + rng() * 1.16;
    const sizeFactor = 0.16 + rng() * 0.13;
    const jitter = rng();
    const dist = Math.hypot(fx - FOCAL.x, fy - FOCAL.y);
    return { fx, fy, sizeFactor, jitter, dist };
  });

  // Center-out ordering, so the reveal grows from the sunset outward.
  drops.sort((a, b) => a.dist - b.dist);

  const maxIndex = RAINDROP_COUNT - 1;
  return drops.map((d, i) => ({
    fx: d.fx,
    fy: d.fy,
    sizeFactor: d.sizeFactor,
    // Base progression by distance rank, plus a small per-drop jitter so
    // drops at a similar radius don't pop in as a clean ring.
    delay: (i / maxIndex) * DROP_STAGGER_WINDOW_S * 0.82 + d.jitter * 0.18,
  }));
}
