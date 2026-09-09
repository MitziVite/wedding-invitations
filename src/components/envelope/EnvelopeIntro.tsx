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
}

/**
 * Orchestrates the shared, stage-driven concerns (opening timer, backdrop)
 * and renders two presentational layout variants side by side, toggled
 * purely by CSS breakpoint (matching how GardenHero already switches its
 * art via a media query rather than JS) — desktop opens top/bottom, mobile
 * opens left/right. Only one is ever visible at a time; `display:none`
 * also removes the hidden one from the tab order.
 *
 * The language toggle and skip button used to live here too, but were
 * moved out to EnvelopeControls (rendered as a sibling in page.tsx) — see
 * that file for why.
 */
export function EnvelopeIntro({ stage, reducedMotion, onOpen, onComplete }: EnvelopeIntroProps) {
  const isOpen = stage === "opening";

  useEffect(() => {
    if (stage !== "opening") return;
    const duration = reducedMotion ? REDUCED_MOTION_DURATION_MS : OPEN_DURATION_MS;
    const timer = window.setTimeout(onComplete, duration);
    return () => window.clearTimeout(timer);
  }, [stage, reducedMotion, onComplete]);

  return (
    <div className="fixed inset-0 z-50">
      <IntroBackdrop isOpen={isOpen} reducedMotion={reducedMotion} />

      <EnvelopeIntroDesktop stage={stage} reducedMotion={reducedMotion} onOpen={onOpen} />
      <EnvelopeIntroMobile stage={stage} reducedMotion={reducedMotion} onOpen={onOpen} />
    </div>
  );
}
