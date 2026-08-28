"use client";

import { motion } from "framer-motion";
import type { VineGeometry } from "@/lib/path/windingPath";

interface Stop {
  x: number;
  y: number;
}

interface ItineraryPathProps {
  /** One real event center per stop — exactly one gold node is drawn per entry, never more. */
  stops: Stop[];
  vine: VineGeometry;
  /** Real measured pixel size of the itinerary container — the SVG viewBox matches it 1:1 in both dimensions, so every coordinate is a plain, undistorted pixel. */
  width: number;
  height: number;
  reducedMotion: boolean;
}

/**
 * The central champagne-gold botanical vine: a mostly-vertical organic
 * spine with a short branch reaching out to each event's real measured
 * center, a few decorative curls, and occasional tiny leaf sprigs — all
 * purely decorative (aria-hidden). Every event's real information lives as
 * plain text in ItineraryEvent, not here. Exactly one node is drawn per
 * entry in `stops`; curls and leaves never get their own node marker, so
 * there's no ambiguity about which dots represent real events.
 */
export function ItineraryPath({ stops, vine, width, height, reducedMotion }: ItineraryPathProps) {
  if (width <= 0 || height <= 0 || !vine.mainD) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <motion.path
        d={vine.mainD}
        className="stroke-gold"
        fill="none"
        strokeOpacity={0.88}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reducedMotion ? 0.4 : 2.4, ease: [0.65, 0, 0.35, 1] }}
      />

      <motion.g
        initial={reducedMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reducedMotion ? 0.3 : 0.8, delay: reducedMotion ? 0 : 0.5 }}
      >
        {vine.branches.map((d, i) => (
          <path
            key={`branch-${i}`}
            d={d}
            className="stroke-gold"
            fill="none"
            strokeOpacity={0.82}
            strokeWidth={1.35}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {vine.curls.map((d, i) => (
          <path
            key={`curl-${i}`}
            d={d}
            className="stroke-gold"
            fill="none"
            strokeOpacity={0.84}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {vine.leaves.map((leaf, i) => (
          <g key={`leaf-${i}`}>
            <path
              d={leaf.stemD}
              className="stroke-gold"
              fill="none"
              strokeOpacity={0.84}
              strokeWidth={1.15}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {leaf.leaves.map((d, j) => (
              <path
                key={j}
                d={d}
                fill="#ead7a7"
                fillOpacity={0.9}
                stroke="#b58d43"
                strokeWidth={0.9}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* Drawn AFTER (on top of) the leaves above — a visible midrib crossing through each leaf's middle, not just the stem touching its edge. */}
            {leaf.veins.map((d, j) => (
              <path
                key={j}
                d={d}
                className="stroke-gold"
                fill="none"
                strokeOpacity={0.75}
                strokeWidth={1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        ))}
      </motion.g>

      {stops.map((s, i) => (
        <motion.circle
          key={i}
          className="fill-gold"
          cx={s.x}
          cy={s.y}
          r={6}
          stroke="#ae894f"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 1px 2px rgba(90,60,30,0.22))" }}
          initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.6 + i * 0.06, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}
