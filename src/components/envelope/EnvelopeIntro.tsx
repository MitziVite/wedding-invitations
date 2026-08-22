"use client";

import { useEffect } from "react";
import type { EnvelopeStage } from "./useEnvelopeState";
import { EnvelopePanel } from "./EnvelopePanel";
import { WaxSeal } from "./WaxSeal";

const OPEN_DURATION_MS = 1900;
const REDUCED_MOTION_DURATION_MS = 650;

interface EnvelopeIntroProps {
  stage: EnvelopeStage;
  reducedMotion: boolean;
  onOpen: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

export function EnvelopeIntro({
  stage,
  reducedMotion,
  onOpen,
  onComplete,
  onSkip,
}: EnvelopeIntroProps) {
  const isOpen = stage === "opening";

  useEffect(() => {
    if (stage !== "opening") return;
    const duration = reducedMotion ? REDUCED_MOTION_DURATION_MS : OPEN_DURATION_MS;
    const timer = window.setTimeout(onComplete, duration);
    return () => window.clearTimeout(timer);
  }, [stage, reducedMotion, onComplete]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ perspective: 1800 }}
    >
      <div className="relative aspect-[2/3] h-[78svh] max-h-[640px]">
        <EnvelopePanel side="left" isOpen={isOpen} reducedMotion={reducedMotion} />
        <EnvelopePanel side="right" isOpen={isOpen} reducedMotion={reducedMotion} />
        <WaxSeal
          isOpen={isOpen}
          disabled={stage !== "idle"}
          reducedMotion={reducedMotion}
          onOpen={onOpen}
        />
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="absolute right-5 bottom-5 rounded px-3 py-2 font-body text-xs tracking-wide text-champagne/80 transition-colors hover:text-champagne hover:underline focus-visible:text-champagne focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Saltar introducción
      </button>
    </div>
  );
}
