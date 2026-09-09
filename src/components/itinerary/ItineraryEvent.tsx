"use client";

import { motion } from "framer-motion";
import { ItineraryIllustration } from "./ItineraryIllustration";

export interface ItineraryEventData {
  time: string;
  title: string;
  subtitle?: string;
  /** Path under /public. */
  image: string;
  alt: string;
}

interface ItineraryEventProps {
  event: ItineraryEventData;
  reducedMotion: boolean;
  /** This stop's position in the whole chronological sequence (0-based) — staggers its reveal so all nine appear one after another in order, not all at once. */
  index: number;
}

/** Seconds between each stop's reveal in the chronological cascade. */
export const STAGGER_STEP = 0.14;

/**
 * One stop's content: illustration on top, time/title/subtitle centered
 * below it — no DOM measurement of any kind, sizing and position come
 * purely from normal flex layout, so this looks the same regardless of how
 * tall a given card ends up or which device renders it.
 */
export function ItineraryEvent({ event, reducedMotion, index }: ItineraryEventProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 text-center sm:gap-3"
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: reducedMotion ? 0.3 : 0.5,
        delay: reducedMotion ? 0 : index * STAGGER_STEP,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <ItineraryIllustration src={event.image} alt={event.alt} />
      <div className="mx-auto max-w-[7.5rem] sm:max-w-[9.5rem]">
        <p className="font-body text-[9px] tracking-[0.1em] text-espresso/70 tabular-nums uppercase sm:text-[10px] sm:tracking-[0.12em]">
          {event.time}
        </p>
        <p className="mt-0.5 font-display text-sm leading-snug text-espresso sm:text-base">{event.title}</p>
        {event.subtitle ? (
          <p className="mt-0.5 font-body text-[11px] text-espresso/80 sm:text-xs">{event.subtitle}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
