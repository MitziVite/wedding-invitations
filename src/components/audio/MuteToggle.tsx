"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useBackgroundMusic } from "./BackgroundMusicProvider";

/** Small, elegant music mute/unmute control — meant to appear once the envelope has opened. */
export function MuteToggle() {
  const { isMuted, toggleMute } = useBackgroundMusic();
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={toggleMute}
      aria-label={isMuted ? "Activar música" : "Silenciar música"}
      aria-pressed={isMuted}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reducedMotion ? 0 : 0.6, duration: reducedMotion ? 0.2 : 0.6, ease: "easeOut" }}
      className="fixed right-5 bottom-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-coffee/75 text-champagne shadow-sm backdrop-blur-sm transition-colors hover:bg-coffee/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {isMuted ? <MutedIcon /> : <UnmutedIcon />}
    </motion.button>
  );
}

function UnmutedIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
      <path d="M16.3 8.7a5 5 0 0 1 0 6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M19 6a9 9 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
      <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
