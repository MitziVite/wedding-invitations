"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ItineraryPath } from "./ItineraryPath";
import { ItineraryEvent, type ItineraryEventData } from "./ItineraryEvent";
import { buildVine } from "@/lib/path/windingPath";

interface WeddingItineraryProps {
  events: ItineraryEventData[];
}

interface MeasuredPoint {
  x: number;
  y: number;
}

/**
 * The itinerary as a compact two-column grid with a central botanical vine
 * threaded behind it — a short branch reaches from the vine to each
 * stop's node. Nodes sit BETWEEN the illustration and the vine (not
 * pinned to the illustration's edge, and not at the whole event block's
 * center) so the image reads as visually associated with its node rather
 * than the vine stretching all the way out to touch the image — that's
 * what was forcing long, nearly-horizontal branches. Every measurement —
 * and the vine geometry itself — happens in one consistent pixel space
 * (the SVG viewBox matches the container's real width/height exactly), so
 * nodes sit exactly where each illustration actually is with no separate
 * positioning system to keep in sync. Positions are measured (not
 * assumed) because subtitles vary enough in length that a fixed row
 * height would either clip the long ones or waste space on the short
 * ones, so the grid sizes itself in normal flow and a ResizeObserver
 * reports the real layout back for the vine to follow.
 */
export function WeddingItinerary({ events }: WeddingItineraryProps) {
  const reducedMotion = !!useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  const [layout, setLayout] = useState<{ width: number; height: number; points: MeasuredPoint[] } | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      const containerRect = container!.getBoundingClientRect();
      const points = itemEls.current.map((el, i): MeasuredPoint => {
        if (!el) return { x: containerRect.width / 2, y: 0 };

        const eventRect = el.getBoundingClientRect();
        const illustration = el.querySelector<HTMLElement>("[data-itinerary-illustration]");
        const illustrationRect = illustration?.getBoundingClientRect() ?? eventRect;
        const isLastCentered = events.length % 2 === 1 && i === events.length - 1;

        // Final centered event: end the vine directly above the illustration.
        if (isLastCentered) {
          return {
            x: illustrationRect.left - containerRect.left + illustrationRect.width / 2,
            y: illustrationRect.top - containerRect.top - 8,
          };
        }

        // The node is NOT pinned to the illustration's edge — it lives
        // BETWEEN the illustration and the central vine, so the image
        // reads as visually associated with its node rather than the vine
        // stretching out to touch the image (which was forcing long,
        // nearly-horizontal branches).
        const illustrationCenterX = illustrationRect.left - containerRect.left + illustrationRect.width / 2;
        const illustrationCenterY = illustrationRect.top - containerRect.top + illustrationRect.height * 0.62;
        const centerX = containerRect.width / 2;
        // 0 = itinerary center, 1 = illustration center.
        const NODE_POSITION = 0.62;
        return {
          x: centerX + (illustrationCenterX - centerX) * NODE_POSITION,
          y: illustrationCenterY,
        };
      });
      setLayout({ width: container!.offsetWidth, height: container!.offsetHeight, points });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [events.length]);

  const vine = useMemo(
    () => (layout ? buildVine(layout.points, layout.width) : { mainD: "", branches: [], curls: [], leaves: [] }),
    [layout]
  );
  const isOdd = events.length % 2 === 1;

  return (
    <div
      ref={containerRef}
      className="relative mt-8 grid grid-cols-2 items-start gap-x-4 gap-y-7 sm:gap-x-8 sm:gap-y-9"
    >
      <ItineraryPath
        stops={layout?.points ?? []}
        vine={vine}
        width={layout?.width ?? 0}
        height={layout?.height ?? 0}
        reducedMotion={reducedMotion}
      />
      {events.map((event, i) => (
        <ItineraryEvent
          key={event.title}
          event={event}
          reducedMotion={reducedMotion}
          spanFull={isOdd && i === events.length - 1}
          rowRef={(el) => {
            itemEls.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
