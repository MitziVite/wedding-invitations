import type { Variants } from "framer-motion";

/**
 * Shared timing for the reverent, staggered reveals used by the ceremony and
 * reception sections — kept in one place so slowing/speeding the sequence
 * stays a single edit instead of two files drifting apart.
 */
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export function fadeIn(delay: number, duration = 0.75): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration, delay, ease: REVEAL_EASE } },
  };
}

export function fadeUp(delay: number, duration = 0.85, distance = 14): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease: REVEAL_EASE } },
  };
}

export function clipRevealDown(delay: number, duration = 1.35): Variants {
  return {
    hidden: { clipPath: "inset(0 0 100% 0)" },
    visible: { clipPath: "inset(0 0 0% 0)", transition: { duration, delay, ease: REVEAL_EASE } },
  };
}

/** Delay offsets for the shared sequence: eyebrow → heading → image+glow → details → ornament → note. */
export const REVEAL_DELAYS = {
  eyebrow: 0,
  heading: 0.2,
  image: 0.45,
  details: 1.35,
  ornament: 1.65,
  note: 1.9,
} as const;
