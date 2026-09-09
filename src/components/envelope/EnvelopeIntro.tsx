"use client";

import { useEffect } from "react";
import type { EnvelopeStage } from "./useEnvelopeState";
import { IntroBackdrop } from "./IntroBackdrop";
import { EnvelopeIntroDesktop } from "./EnvelopeIntroDesktop";
import { EnvelopeIntroMobile } from "./EnvelopeIntroMobile";
import { useLanguage, useWeddingContent } from "@/content/LanguageProvider";

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
  const { language, setLanguage } = useLanguage();
  const { common } = useWeddingContent();

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

      {/* A small pill toggle with both options always visible — the active
          language sits on a gold chip (the same selected-state treatment
          used on the RSVP form's cards), so it reads as a real switch
          rather than a link, while staying compact and quiet. Explicit
          z-index (not just later DOM order) — on real iOS Safari, a
          sibling with a 3D transform context (the mobile envelope's
          `perspective`) can otherwise end up painted on top regardless of
          DOM order. */}
      <div className="absolute top-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ivory/25 bg-black/15 p-1 backdrop-blur-sm">
        {(["es", "en"] as const).map((lang) => {
          const selected = language === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              aria-pressed={selected}
              className={`rounded-full px-3 py-1.5 font-body text-xs tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                selected ? "bg-gold text-espresso font-medium" : "text-ivory/70 hover:text-ivory"
              }`}
            >
              {lang === "es" ? "Español" : "English"}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="absolute right-5 bottom-5 z-20 rounded px-3 py-2 font-body text-xs tracking-wide text-ivory/80 transition-colors hover:text-ivory hover:underline focus-visible:text-ivory focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {common.skipIntro}
      </button>
    </div>
  );
}
