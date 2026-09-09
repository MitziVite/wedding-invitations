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
  /** Which column this stop sits in — left-column content hugs the outer left edge, right-column content hugs the outer right edge, both leaving the vine a wide, airy channel down the middle instead of two centered columns pinched close together. Ignored when spanFull. */
  side: "left" | "right";
  /** Pulls this stop's whole block inward, toward the vine, by this many pixels — varying it row to row makes some rows sit closer to the vine and others farther, so the branch reaching each one reads as naturally longer or shorter instead of every branch being the same length. Ignored when spanFull. */
  insetPx?: number;
  /** Reports this stop's DOM node up to WeddingItinerary so it can measure its real center for the winding path. */
  rowRef: (el: HTMLDivElement | null) => void;
}

/**
 * One stop on the itinerary: illustration as the visual anchor with its
 * time/title/subtitle below it as one compact grouped block, left-aligned
 * within the block. Sits as a plain cell in WeddingItinerary's two-column
 * grid — its position (left or right column) comes from normal grid flow,
 * not manual pinning.
 */
export function ItineraryEvent({ event, reducedMotion, spanFull = false, side, insetPx = 0, rowRef }: ItineraryEventProps) {
  const alignClass = spanFull ? "items-center text-center" : side === "left" ? "items-start text-left" : "items-end text-left";
  // items-start hugs the LEFT edge of its content box, so pulling a
  // left-column block inward means padding its LEFT (not right) — and the
  // mirror for items-end/right. Padding the opposite side only shrinks
  // available width without moving where the aligned edge itself sits.
  const insetStyle = spanFull ? undefined : side === "left" ? { paddingLeft: insetPx } : { paddingRight: insetPx };

  return (
    <motion.div
      ref={rowRef}
      className={`relative z-10 flex flex-col gap-1 ${alignClass} ${spanFull ? "col-span-2" : ""}`}
      style={insetStyle}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reducedMotion ? 0.3 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <ItineraryIllustration src={event.image} alt={event.alt} />
      <div className={`max-w-[9rem] sm:max-w-[10.5rem] ${spanFull ? "text-center" : "text-left"}`}>
        <p className="font-body text-[9.5px] tracking-[0.12em] text-espresso/70 tabular-nums uppercase sm:text-[10px]">
          {event.time}
        </p>
        <p className="mt-0.5 font-display text-sm leading-snug text-espresso sm:text-sm">{event.title}</p>
        {event.subtitle ? (
          <p className="mt-0.5 font-body text-[10px] text-espresso/65 sm:text-[10px]">{event.subtitle}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
