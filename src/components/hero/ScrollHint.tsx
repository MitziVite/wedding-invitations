"use client";

import { motion } from "framer-motion";
import { useWeddingContent } from "@/content/LanguageProvider";

interface ScrollHintProps {
  visible: boolean;
  reducedMotion: boolean;
}

const CHEVRONS = [0, 1];

/**
 * A quiet "scroll down" cue at the bottom of the hero: two stacked
 * chevrons that drift down and fade in a soft, offset loop, reading as a
 * gentle downward flow rather than a mechanical bounce. Frozen (no loop)
 * under reduced motion, but still shown — it's the one hint that the page
 * continues below the fold. Doubles as a real control: clicking it
 * scrolls to the welcome section just below.
 */
export function ScrollHint({ visible, reducedMotion }: ScrollHintProps) {
  const { common } = useWeddingContent();

  function handleClick() {
    document.getElementById("bienvenida")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={common.scrollDownAria}
      className={`absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:bottom-10 ${
        visible ? "pointer-events-auto cursor-pointer" : "pointer-events-none"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.2, delay: visible ? 1.8 : 0, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center" style={{ color: "#F5E7C6" }}>
        {CHEVRONS.map((i) => (
          <motion.svg
            key={i}
            width="52"
            height="30"
            viewBox="0 0 52 30"
            fill="none"
            className={i > 0 ? "-mt-5" : ""}
            style={{ filter: "drop-shadow(0 1px 4px rgba(18,12,8,0.6))" }}
            animate={reducedMotion ? undefined : { y: [0, 12, 0], opacity: [0.35, 1, 0.35] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.28 }
            }
          >
            <path
              d="M4 4l22 20 22-20"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ))}
      </div>
    </motion.button>
  );
}
