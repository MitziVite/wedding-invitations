"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useBackgroundMusic } from "./BackgroundMusicProvider";

/** Small, elegant music control — an icon that opens a volume slider on click. Meant to appear once the envelope has opened. */
export function MuteToggle() {
  const { isMuted, volume, maxVolume, setVolume } = useBackgroundMusic();
  const reducedMotion = useReducedMotion();
  const [showSlider, setShowSlider] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Closes the slider on an outside click/tap, same as any other popover.
  useEffect(() => {
    if (!showSlider) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSlider(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [showSlider]);

  const muted = isMuted || volume === 0;

  return (
    <div ref={containerRef} className="fixed right-5 bottom-5 z-50 flex items-center gap-2">
      {showSlider && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-11 items-center rounded-full border border-gold/40 bg-espresso/75 px-4 shadow-sm backdrop-blur-sm"
        >
          <input
            type="range"
            min={0}
            max={maxVolume}
            step={maxVolume / 100}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volumen de la música"
            className="h-1 w-24 cursor-pointer accent-gold"
          />
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={() => setShowSlider((s) => !s)}
        aria-label={muted ? "Activar música" : "Ajustar volumen de la música"}
        aria-pressed={showSlider}
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.6, duration: reducedMotion ? 0.2 : 0.6, ease: "easeOut" }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-espresso/75 text-soft-white shadow-sm backdrop-blur-sm transition-colors hover:bg-espresso/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {muted ? <MutedIcon /> : <UnmutedIcon />}
      </motion.button>
    </div>
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
