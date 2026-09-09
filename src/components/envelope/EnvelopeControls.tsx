"use client";

import { useLanguage, useWeddingContent } from "@/content/LanguageProvider";

interface EnvelopeControlsProps {
  onSkip: () => void;
}

/**
 * The envelope's language pill + skip link — deliberately rendered as a
 * sibling of EnvelopeIntro rather than nested inside its tree. On real iOS
 * Safari, sitting alongside the mobile envelope's perspective/rotateY
 * panels made these invisible on first paint (only appearing after a
 * reload) — a known class of WebKit bug where a 3D-transformed sibling
 * gets promoted to its own compositing layer that isn't reliably ordered
 * against plain 2D content on the very first paint. Two independent
 * `fixed` elements with no 3D-transformed sibling anywhere near them
 * sidesteps the bug entirely, the same way the always-reliable persistent
 * LanguageToggle (shown after the envelope opens) already does.
 */
export function EnvelopeControls({ onSkip }: EnvelopeControlsProps) {
  const { language, setLanguage } = useLanguage();
  const { common } = useWeddingContent();

  return (
    <>
      <div className="fixed top-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-ivory/25 bg-black/15 p-1 backdrop-blur-sm">
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
        className="fixed right-5 bottom-5 z-50 rounded px-3 py-2 font-body text-xs tracking-wide text-ivory/80 transition-colors hover:text-ivory hover:underline focus-visible:text-ivory focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {common.skipIntro}
      </button>
    </>
  );
}
