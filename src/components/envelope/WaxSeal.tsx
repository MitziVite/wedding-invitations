"use client";

import { motion } from "framer-motion";

interface WaxSealProps {
  isOpen: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onOpen: () => void;
}

/**
 * wax-seal.png's visible seal is not centered in its 1024x1024 canvas — its
 * alpha-channel content sits at roughly x:124-1021, y:88-991, centered at
 * ~56% / ~53% of the canvas rather than 50%/50%. Centering the raw canvas
 * (background-position: center) therefore visibly off-centers the seal
 * itself. Zooming in slightly and repositioning by these measured values
 * recenters the seal's actual artwork instead of its canvas.
 */
const SEAL_BACKGROUND_SIZE = "118%";
const SEAL_BACKGROUND_POSITION = "89% 68%";

export function WaxSeal({ isOpen, disabled, reducedMotion, onOpen }: WaxSealProps) {
  const hoverFocusScale = reducedMotion || disabled ? undefined : { scale: 1.04 };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      aria-label="Abrir la invitación"
      className="absolute top-1/2 left-1/2 z-10 h-24 w-24 min-h-16 min-w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-no-repeat focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-default sm:h-28 sm:w-28"
      style={{
        backgroundImage: "url(/images/envelope/wax-seal.png)",
        backgroundSize: SEAL_BACKGROUND_SIZE,
        backgroundPosition: SEAL_BACKGROUND_POSITION,
      }}
      initial={false}
      whileHover={hoverFocusScale}
      whileFocus={hoverFocusScale}
      animate={
        isOpen
          ? reducedMotion
            ? { opacity: 0 }
            : { scale: 0.85, rotate: 8, opacity: 0, y: -14 }
          : { scale: 1, rotate: 0, opacity: 1, y: 0 }
      }
      transition={{ duration: reducedMotion ? 0.4 : 0.5, ease: "easeOut" }}
    />
  );
}
