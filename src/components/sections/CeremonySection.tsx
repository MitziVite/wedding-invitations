"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Ornament } from "@/components/ui/Ornament";
import { LinkButton } from "@/components/ui/LinkButton";
import { weddingContent } from "@/content/copy/es";
import { fadeIn, fadeUp, clipRevealDown, REVEAL_DELAYS } from "@/lib/motion/sectionReveal";

/**
 * A slow, reverent reveal reserved for the temple sealing — eyebrow, then
 * heading, then the temple sketch (with a soft sunrise glow behind it), then
 * time/place, the ornament, and finally the scripture, each settling in turn
 * rather than arriving together. Every other section keeps the plain
 * Section/SectionHeading fade — this sequence is intentionally bespoke.
 */
export function CeremonySection() {
  const { ceremony } = weddingContent;
  const reducedMotion = useReducedMotion();
  const v = (variants: Variants) => (reducedMotion ? undefined : variants);

  return (
    <Section id="ceremonia" tone="parchment">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.p
          variants={v(fadeIn(REVEAL_DELAYS.eyebrow))}
          className="mb-3 font-body text-xs tracking-[0.22em] text-espresso/70 uppercase"
        >
          {ceremony.eyebrow}
        </motion.p>

        <motion.h2
          variants={v(fadeUp(REVEAL_DELAYS.heading))}
          className="font-display text-4xl text-espresso sm:text-5xl"
        >
          {ceremony.title}
        </motion.h2>

        <div className="relative mx-auto mt-8 max-w-md">
          {/* Soft sunrise glow — low-opacity, heavily blurred, no ring edge. */}
          <motion.div
            aria-hidden="true"
            variants={v(fadeIn(REVEAL_DELAYS.image, 1.4))}
            className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
            style={{
              background: "radial-gradient(closest-side, rgba(190,155,77,0.28), rgba(190,155,77,0) 70%)",
            }}
          />
          <motion.img
            src={ceremony.imageSrc}
            alt={ceremony.imageAlt}
            className="h-auto w-full"
            variants={v(clipRevealDown(REVEAL_DELAYS.image))}
          />
        </div>

        <motion.div variants={v(fadeUp(REVEAL_DELAYS.details))} className="mt-8">
          <p className="font-display text-3xl text-espresso">{ceremony.time}</p>
          <p className="mt-3 font-body text-lg font-medium text-espresso">{ceremony.place}</p>
          <p className="mt-1 font-body text-sm text-espresso/70">{ceremony.address}</p>
        </motion.div>

        <motion.div variants={v(fadeIn(REVEAL_DELAYS.ornament))} className="mt-6">
          <Ornament />
        </motion.div>

        <motion.div variants={v(fadeIn(REVEAL_DELAYS.note, 0.9))} className="mt-4 max-w-md">
          <p className="font-display text-xl text-espresso/80 italic">{ceremony.note}</p>
          {ceremony.noteAuthor ? (
            <p className="mt-1.5 font-body text-xs tracking-[0.08em] text-espresso/50 uppercase">
              — {ceremony.noteAuthor}
            </p>
          ) : null}
        </motion.div>

        <LinkButton href={ceremony.mapUrl} variant="outline" className="mt-7">
          Ver mapa
        </LinkButton>
      </motion.div>
    </Section>
  );
}
