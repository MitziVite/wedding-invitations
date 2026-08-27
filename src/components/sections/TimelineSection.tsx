"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { weddingContent } from "@/content/copy/es";
import { TimelineIcon, type TimelineIconKey } from "./timelineIcons";
import { windingStops, smoothPath } from "@/lib/path/windingPath";

// Fixed seed (not random) so the thread's hand-drawn jitter is stable across
// renders/reloads instead of reshuffling every time.
const SEED = 20261107;
const STEP_UNITS = 100;
// Real vertical space per row — compact on purpose: icon + time + title +
// description sit side by side (not stacked), so each row is only as tall
// as the illustration frame needs to be.
const ROW_PX = 132;
const ICON_BOX = 84;

interface TimelineEvent {
  time: string;
  title: string;
  description?: string;
  icon: TimelineIconKey;
  /** Path under /public — overrides the built-in icon with a real illustration once one exists. */
  iconSrc?: string;
}

function IllustrationFrame({ event }: { event: TimelineEvent }) {
  return (
    <span
      className="mx-auto flex shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-ivory text-wine shadow-sm"
      style={{ width: ICON_BOX, height: ICON_BOX }}
    >
      {event.iconSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- small fixed-size illustration slot, swapped in per event
        <img src={event.iconSrc} alt="" className="h-full w-full rounded-2xl object-cover" />
      ) : (
        <TimelineIcon icon={event.icon} className="h-9 w-9" />
      )}
    </span>
  );
}

function EventText({ event }: { event: TimelineEvent }) {
  return (
    <div className="text-left">
      <p className="font-body text-[11px] tracking-[0.14em] text-wine tabular-nums uppercase">{event.time}</p>
      <p className="mt-0.5 font-display text-lg leading-snug text-coffee">{event.title}</p>
      {event.description ? <p className="mt-0.5 font-body text-xs text-coffee/65">{event.description}</p> : null}
    </div>
  );
}

/**
 * The itinerary as a compact, illustrated route rather than a tall vertical
 * list: rows alternate illustration/text left-right, tied together by one
 * thin thread winding gently down the center gap — same idea as before, but
 * far less vertical space per stop, closer to a printed two-column keepsake
 * itinerary than a scrolling timeline.
 */
export function TimelineSection() {
  const { timeline } = weddingContent;
  const events: TimelineEvent[] = [...timeline.events];
  const reducedMotion = useReducedMotion();

  const { stops, pathD, viewBoxHeight } = useMemo(() => {
    const points = windingStops(events.length, SEED, STEP_UNITS, 50, 5);
    return { stops: points, pathD: smoothPath(points), viewBoxHeight: events.length * STEP_UNITS };
  }, [events.length]);

  const containerHeight = events.length * ROW_PX;

  return (
    <Section id="itinerario" tone="blush">
      <SectionHeading eyebrow={timeline.eyebrow} title={timeline.title} />

      <div className="relative mt-8" style={{ height: containerHeight }}>
        <svg
          className="absolute inset-0 h-full w-full stroke-gold"
          viewBox={`0 0 100 ${viewBoxHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={pathD}
            fill="none"
            strokeOpacity={0.5}
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeDasharray="0.5 5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Plain HTML dots, not SVG — a circle drawn in the path's distorted
            (non-uniformly scaled) coordinate space would render as an
            ellipse; a fixed-px span stays perfectly round regardless. */}
        {stops.map((s, i) => (
          <span
            key={i}
            className="bg-gold absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${s.x}%`, top: `${(s.y / viewBoxHeight) * 100}%` }}
            aria-hidden="true"
          />
        ))}

        {events.map((event, i) => {
          const illustrationFirst = i % 2 === 0;
          return (
            <motion.div
              key={event.title}
              className="absolute inset-x-0 grid grid-cols-2 items-center gap-x-4 px-1"
              style={{ top: i * ROW_PX, height: ROW_PX }}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: reducedMotion ? 0.3 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {illustrationFirst ? (
                <>
                  <IllustrationFrame event={event} />
                  <EventText event={event} />
                </>
              ) : (
                <>
                  <EventText event={event} />
                  <IllustrationFrame event={event} />
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
