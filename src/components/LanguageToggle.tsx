"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/content/LanguageProvider";

/**
 * A small, persistent ES/EN switch — visible throughout the page (not just
 * once, on the envelope) so a guest who picked the wrong language, or
 * never saw the envelope's toggle, can still correct it at any point.
 * Same corner-pill treatment as MuteToggle, opposite corner so the two
 * don't collide.
 */
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reducedMotion ? 0 : 0.6, duration: reducedMotion ? 0.2 : 0.6, ease: "easeOut" }}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-1 rounded-full border border-gold/40 bg-espresso/75 p-1 shadow-sm backdrop-blur-sm"
    >
      {(["es", "en"] as const).map((lang) => {
        const selected = language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={selected}
            aria-label={lang === "es" ? "Español" : "English"}
            className={`rounded-full px-2.5 py-1.5 font-body text-[11px] font-medium tracking-wide uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              selected ? "bg-gold text-espresso" : "text-soft-white/70 hover:text-soft-white"
            }`}
          >
            {lang}
          </button>
        );
      })}
    </motion.div>
  );
}
