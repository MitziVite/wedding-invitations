"use client";

import { motion } from "framer-motion";

interface GardenHeroProps {
  revealed: boolean;
  reducedMotion: boolean;
}

export function GardenHero({ revealed, reducedMotion }: GardenHeroProps) {
  return (
    <div className="h-full w-full overflow-hidden bg-coffee">
      <motion.picture
        className="block h-full w-full"
        initial={false}
        animate={
          revealed
            ? { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }
            : { opacity: 0.5, scale: 1.08, filter: "blur(16px) brightness(0.75)" }
        }
        transition={{
          duration: reducedMotion ? 0.5 : 1.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/*
          TODO: add public/images/hero/garden-mobile.png (vertical composition)
          and point this <source> at it. Using the desktop image for both
          breakpoints as a temporary stand-in until that asset is provided.
        */}
        <source media="(min-width: 768px)" srcSet="/images/hero/garden-desktop.png" />
        {/* eslint-disable-next-line @next/next/no-img-element -- <picture> art-direction switching isn't supported by next/image */}
        <img
          src="/images/hero/garden-desktop.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.picture>
    </div>
  );
}
