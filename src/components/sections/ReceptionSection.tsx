"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Ornament } from "@/components/ui/Ornament";
import { LinkButton } from "@/components/ui/LinkButton";
import { weddingContent } from "@/content/copy/es";
import { fadeIn, fadeUp, clipRevealDown, REVEAL_DELAYS } from "@/lib/motion/sectionReveal";

/** Same slow, reverent reveal as the ceremony section — kept in sync via lib/motion/sectionReveal. */
export function ReceptionSection() {
  const { reception } = weddingContent;
  const reducedMotion = useReducedMotion();
  const v = (variants: Variants) => (reducedMotion ? undefined : variants);

  return (
    <Section id="recepcion" tone="ivory">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.p
          variants={v(fadeIn(REVEAL_DELAYS.eyebrow))}
          className="mb-3 font-body text-xs tracking-[0.22em] text-wine uppercase"
        >
          {reception.eyebrow}
        </motion.p>

        <motion.h2
          variants={v(fadeUp(REVEAL_DELAYS.heading))}
          className="font-display text-4xl text-coffee sm:text-5xl"
        >
          {reception.title}
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
            src={reception.imageSrc}
            alt={reception.imageAlt}
            className="h-auto w-full"
            variants={v(clipRevealDown(REVEAL_DELAYS.image))}
          />
        </div>

        <motion.div variants={v(fadeUp(REVEAL_DELAYS.details))} className="mt-8">
          <p className="font-display text-3xl text-wine">{reception.time}</p>
          <p className="mt-3 font-body text-lg font-medium text-coffee">{reception.place}</p>
          <p className="mt-1 font-body text-sm text-coffee/70">{reception.address}</p>
        </motion.div>

        <motion.div variants={v(fadeIn(REVEAL_DELAYS.ornament))} className="mt-6">
          <Ornament tone="gold" />
        </motion.div>

        {reception.note ? (
          <motion.p
            variants={v(fadeIn(REVEAL_DELAYS.note, 0.9))}
            className="mt-4 max-w-md font-display text-xl text-coffee/80 italic"
          >
            {reception.note}
          </motion.p>
        ) : null}

        <LinkButton href={reception.mapUrl} variant="outline" className="mt-7">
          Ver mapa
        </LinkButton>
      </motion.div>
    </Section>
  );
}
