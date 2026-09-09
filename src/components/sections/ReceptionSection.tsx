"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Ornament } from "@/components/ui/Ornament";
import { LinkButton } from "@/components/ui/LinkButton";
import { useWeddingContent } from "@/content/LanguageProvider";
import { fadeIn, fadeUp, clipRevealDown, REVEAL_DELAYS } from "@/lib/motion/sectionReveal";

/** Same slow, reverent reveal as the ceremony section — kept in sync via lib/motion/sectionReveal. */
export function ReceptionSection() {
  const { reception, common } = useWeddingContent();
  const reducedMotion = useReducedMotion();
  const v = (variants: Variants) => (reducedMotion ? undefined : variants);

  return (
    <Section
      id="recepcion"
      tone="ivory"
      paddingY="py-6 sm:py-24"
      fullHeight
      florals={[
        { variant: "sprig", corner: "bottom-left" },
        { variant: "flower", corner: "top-right" },
      ]}
    >
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
          {reception.eyebrow}
        </motion.p>

        <motion.h2
          variants={v(fadeUp(REVEAL_DELAYS.heading))}
          className="font-display text-3xl leading-tight text-espresso sm:text-5xl sm:leading-normal"
        >
          {reception.title}
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
            src={reception.imageSrc}
            alt={reception.imageAlt}
            className="mx-auto h-28 w-auto sm:h-auto sm:w-full"
            variants={v(clipRevealDown(REVEAL_DELAYS.image))}
          />
        </div>

        <motion.div variants={v(fadeUp(REVEAL_DELAYS.details))} className="mt-4 sm:mt-8">
          <p className="font-display text-2xl text-espresso sm:text-3xl">{reception.time}</p>
          <p className="mt-2 font-body text-base font-medium text-espresso sm:mt-3 sm:text-lg">{reception.place}</p>
          <p className="mt-1 font-body text-xs text-espresso/70 sm:text-sm">{reception.address}</p>
        </motion.div>

        <motion.div variants={v(fadeIn(REVEAL_DELAYS.ornament))} className="mt-3 sm:mt-6">
          <Ornament />
        </motion.div>

        {reception.note ? (
          <motion.p
            variants={v(fadeIn(REVEAL_DELAYS.note, 0.9))}
            className="mt-3 max-w-md font-display text-base text-espresso/80 italic sm:mt-4 sm:text-xl"
          >
            {reception.note}
          </motion.p>
        ) : null}

        <LinkButton href={reception.mapUrl} variant="outline" className="mt-4 sm:mt-7">
          {common.mapCta}
        </LinkButton>
      </motion.div>
    </Section>
  );
}
