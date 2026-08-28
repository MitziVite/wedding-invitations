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
  /** The last stop, when the total is odd, spans both grid columns so it sits centered instead of leaving an empty cell beside it. */
  spanFull?: boolean;
  /** Reports this stop's DOM node up to WeddingItinerary so it can measure its real center for the winding path. */
  rowRef: (el: HTMLDivElement | null) => void;
}

/**
 * One stop on the itinerary: illustration as the visual anchor with its
 * time/title/subtitle centered below it as one compact grouped block. Sits
 * as a plain cell in WeddingItinerary's two-column grid — its position
 * (left or right column) comes from normal grid flow, not manual pinning.
 */
export function ItineraryEvent({ event, reducedMotion, spanFull = false, rowRef }: ItineraryEventProps) {
  return (
    <motion.div
      ref={rowRef}
      className={`relative z-10 flex flex-col items-center gap-1.5 text-center ${spanFull ? "col-span-2" : ""}`}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reducedMotion ? 0.3 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <ItineraryIllustration src={event.image} alt={event.alt} />
      <div className="max-w-[9rem] sm:max-w-[10.5rem]">
        <p className="font-body text-[9.5px] tracking-[0.12em] text-espresso/70 tabular-nums uppercase sm:text-[10.5px]">
          {event.time}
        </p>
        <p className="mt-0.5 font-display text-sm leading-snug text-espresso sm:text-base">{event.title}</p>
        {event.subtitle ? (
          <p className="mt-0.5 font-body text-[10px] text-espresso/65 sm:text-[11px]">{event.subtitle}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
