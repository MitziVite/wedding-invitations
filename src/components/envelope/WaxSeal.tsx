"use client";

import { motion } from "framer-motion";

interface WaxSealProps {
  isOpen: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onOpen: () => void;
}

export function WaxSeal({ isOpen, disabled, reducedMotion, onOpen }: WaxSealProps) {
  const hoverFocusScale = reducedMotion || disabled ? undefined : { scale: 1.04 };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      aria-label="Abrir la invitación"
      className="absolute top-1/2 left-1/2 z-10 h-20 w-20 min-h-16 min-w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-contain bg-center bg-no-repeat focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-default sm:h-24 sm:w-24"
      style={{ backgroundImage: "url(/images/envelope/wax-seal.png)" }}
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
