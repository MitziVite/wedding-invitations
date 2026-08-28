"use client";

import { useEffect } from "react";
import type { EnvelopeStage } from "./useEnvelopeState";
import { IntroBackdrop } from "./IntroBackdrop";
import { EnvelopeIntroDesktop } from "./EnvelopeIntroDesktop";
import { EnvelopeIntroMobile } from "./EnvelopeIntroMobile";

const OPEN_DURATION_MS = 1900;
const REDUCED_MOTION_DURATION_MS = 650;

interface EnvelopeIntroProps {
  stage: EnvelopeStage;
  reducedMotion: boolean;
  onOpen: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

/**
 * Orchestrates the shared, stage-driven concerns (opening timer, backdrop,
 * skip control) and renders two presentational layout variants side by
 * side, toggled purely by CSS breakpoint (matching how GardenHero already
 * switches its art via a media query rather than JS) — desktop opens
 * top/bottom, mobile opens left/right. Only one is ever visible at a time;
 * `display:none` also removes the hidden one from the tab order.
 */
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
    <div className="absolute inset-0">
      <IntroBackdrop isOpen={isOpen} reducedMotion={reducedMotion} />

      <EnvelopeIntroDesktop stage={stage} reducedMotion={reducedMotion} onOpen={onOpen} />
      <EnvelopeIntroMobile stage={stage} reducedMotion={reducedMotion} onOpen={onOpen} />

      <button
        type="button"
        onClick={onSkip}
        className="absolute right-5 bottom-5 rounded px-3 py-2 font-body text-xs tracking-wide text-ivory/80 transition-colors hover:text-ivory hover:underline focus-visible:text-ivory focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Saltar introducción
      </button>
    </div>
  );
}
