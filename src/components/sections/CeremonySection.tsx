"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Ornament } from "@/components/ui/Ornament";
import { LinkButton } from "@/components/ui/LinkButton";
import { useWeddingContent } from "@/content/LanguageProvider";
import { fadeIn, fadeUp, clipRevealDown, REVEAL_DELAYS } from "@/lib/motion/sectionReveal";

/**
 * A slow, reverent reveal reserved for the temple sealing — eyebrow, then
 * heading, then the temple sketch (with a soft sunrise glow behind it), then
 * time/place, the ornament, and finally the scripture, each settling in turn
 * rather than arriving together. Every other section keeps the plain
 * Section/SectionHeading fade — this sequence is intentionally bespoke.
 */
export function CeremonySection() {
  const { ceremony, common } = useWeddingContent();
  const reducedMotion = useReducedMotion();
  const v = (variants: Variants) => (reducedMotion ? undefined : variants);

  return (
    <Section id="ceremonia" tone="parchment" paddingY="py-6 sm:py-24" fullHeight>
      <motion.div
        className="flex flex-col items-center text-center"
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.p
          variants={v(fadeIn(REVEAL_DELAYS.eyebrow))}
          className="mb-2 font-body text-xs tracking-[0.22em] text-espresso/70 uppercase sm:mb-3"
        >
          {ceremony.eyebrow}
        </motion.p>

        <motion.h2
          variants={v(fadeUp(REVEAL_DELAYS.heading))}
          className="font-display text-3xl leading-tight text-espresso sm:text-5xl sm:leading-normal"
        >
          {ceremony.title}
        </motion.h2>

        <div className="relative mx-auto mt-4 max-w-md sm:mt-8">
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
            className="mx-auto h-28 w-auto sm:h-auto sm:w-full"
            variants={v(clipRevealDown(REVEAL_DELAYS.image))}
          />
        </div>

        <motion.div variants={v(fadeUp(REVEAL_DELAYS.details))} className="mt-4 sm:mt-8">
          <p className="font-display text-2xl text-espresso sm:text-3xl">{ceremony.time}</p>
          <p className="mt-2 font-body text-base font-medium text-espresso sm:mt-3 sm:text-lg">{ceremony.place}</p>
          <p className="mt-1 font-body text-xs text-espresso/70 sm:text-sm">{ceremony.address}</p>
        </motion.div>

        <motion.div variants={v(fadeIn(REVEAL_DELAYS.ornament))} className="mt-3 sm:mt-6">
          <Ornament />
        </motion.div>

        <motion.div variants={v(fadeIn(REVEAL_DELAYS.note, 0.9))} className="mt-3 max-w-md sm:mt-4">
          <p className="font-display text-base text-espresso/80 italic sm:text-xl">{ceremony.note}</p>
          {ceremony.noteAuthor ? (
            <p className="mt-1 font-body text-xs tracking-[0.08em] text-espresso/50 uppercase sm:mt-1.5">
              — {ceremony.noteAuthor}
            </p>
          ) : null}
        </motion.div>

        <LinkButton href={ceremony.mapUrl} variant="outline" className="mt-4 sm:mt-7">
          {common.mapCta}
        </LinkButton>
      </motion.div>
    </Section>
  );
}
