"use client";

import type { EnvelopeStage } from "./useEnvelopeState";
import { EnvelopePanel } from "./EnvelopePanel";
import { WaxSeal } from "./WaxSeal";

interface EnvelopeIntroMobileProps {
  stage: EnvelopeStage;
  reducedMotion: boolean;
  onOpen: () => void;
}

/**
 * Mobile: the envelope opens left/right and is a genuinely fullscreen layer
 * (100vw x 100svh, no aspect-ratio box, no border/shadow/margin) — the
 * envelope itself IS the screen, rather than an object centered over a
 * visible background. EnvelopePanel's pre-trimmed clean assets + native
 * object-fit: cover guarantee no seam gap at any device's real aspect
 * ratio, so no fixed-aspect wrapper is needed to keep the crop safe.
 */
export function EnvelopeIntroMobile({ stage, reducedMotion, onOpen }: EnvelopeIntroMobileProps) {
  const isOpen = stage === "opening";

  return (
    <div className="absolute inset-0 md:hidden" style={{ perspective: 1800 }}>
      <div className="relative h-full w-full overflow-hidden">
        <EnvelopePanel side="left" isOpen={isOpen} reducedMotion={reducedMotion} />
        <EnvelopePanel side="right" isOpen={isOpen} reducedMotion={reducedMotion} />

        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-espresso/40 transition-opacity duration-500"
          style={{ opacity: isOpen ? 0 : 1 }}
        />

        <WaxSeal
          isOpen={isOpen}
          disabled={stage !== "idle"}
          reducedMotion={reducedMotion}
          onOpen={onOpen}
        />
      </div>
    </div>
  );
}
