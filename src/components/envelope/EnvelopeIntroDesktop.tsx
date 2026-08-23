"use client";

import type { EnvelopeStage } from "./useEnvelopeState";
import { EnvelopePanelHorizontal } from "./EnvelopePanelHorizontal";
import { WaxSeal } from "./WaxSeal";

interface EnvelopeIntroDesktopProps {
  stage: EnvelopeStage;
  reducedMotion: boolean;
  onOpen: () => void;
}

/**
 * Desktop: the envelope fills the entire viewport (no visible background
 * around it) and opens top/bottom — the top half lifts up and away, the
 * bottom half drops down and away, hinged at their own outer edges.
 */
export function EnvelopeIntroDesktop({ stage, reducedMotion, onOpen }: EnvelopeIntroDesktopProps) {
  const isOpen = stage === "opening";

  return (
    <div
      className="absolute inset-0 hidden items-center justify-center md:flex"
      style={{ perspective: 1800 }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <EnvelopePanelHorizontal edge="top" isOpen={isOpen} reducedMotion={reducedMotion} />
        <EnvelopePanelHorizontal edge="bottom" isOpen={isOpen} reducedMotion={reducedMotion} />

        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-coffee/40 transition-opacity duration-500"
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
