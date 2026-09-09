"use client";

import { useReducedMotion } from "framer-motion";
import { ItineraryEvent, STAGGER_STEP, type ItineraryEventData } from "./ItineraryEvent";
import { ItineraryRowLine, ItineraryNode } from "./ItineraryLine";

interface WeddingItineraryProps {
  events: ItineraryEventData[];
}

const ROW_SIZE = 3;
/** Matches ItineraryRowLine's own left-[16.6%]/right-[16.6%] span, so a row's connector lines up exactly with its outer nodes. */
const EDGE_OFFSET = "16.6%";

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/**
 * A short vertical drop connecting the end of one row to the start of the
 * next — physical `left`/`right` CSS offsets are unaffected by a
 * direction:rtl parent, so this lines up correctly regardless of which row
 * it's following.
 */
function RowConnector({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative h-12 sm:h-16" aria-hidden="true">
      <div className="absolute top-0 bottom-0 w-px bg-gold/50" style={{ [side]: EDGE_OFFSET }} />
    </div>
  );
}

/**
 * The wedding-day itinerary: rows of three stops, read boustrophedon-style
 * ("as the ox plows") — row one left-to-right, row two right-to-left, row
 * three left-to-right again — so the nine stops read as one continuous
 * winding path down the page instead of three disconnected groups, while
 * still only needing three rows of height.
 *
 * Reversed rows flip via CSS `direction: rtl` on the grid (which reverses
 * visual column order without touching DOM order, so time/reading order
 * stays chronological for anyone tabbing through) — each event's own
 * content resets `direction: ltr` so its text still reads normally.
 *
 * Still has NO layout measurement of any kind — every line and node
 * position comes from the fixed 3-column grid via plain CSS, so nothing
 * here can end up mismatched with the real content on any device.
 */
export function WeddingItinerary({ events }: WeddingItineraryProps) {
  const reducedMotion = !!useReducedMotion();
  const rows = chunk(events, ROW_SIZE);

  return (
    <div className="px-2 sm:px-8 md:px-16 lg:px-24">
      {rows.map((row, ri) => {
        const reversed = ri % 2 === 1;
        return (
          <div key={ri}>
            <div
              className="relative grid grid-cols-3 gap-x-2 sm:gap-x-6"
              style={{ direction: reversed ? "rtl" : "ltr" }}
            >
              <ItineraryRowLine />
              {row.map((event, ci) => {
                const index = ri * ROW_SIZE + ci;
                return (
                  <div
                    key={event.title}
                    className="relative z-10 flex flex-col items-center gap-5 sm:gap-7"
                    style={{ direction: "ltr" }}
                  >
                    <ItineraryNode reducedMotion={reducedMotion} delay={index * STAGGER_STEP} />
                    <ItineraryEvent event={event} reducedMotion={reducedMotion} index={index} />
                  </div>
                );
              })}
            </div>
            {ri < rows.length - 1 && <RowConnector side={reversed ? "left" : "right"} />}
          </div>
        );
      })}
    </div>
  );
}
