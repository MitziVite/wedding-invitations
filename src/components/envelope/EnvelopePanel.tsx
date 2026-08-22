"use client";

import { motion } from "framer-motion";

type Side = "left" | "right";

interface EnvelopePanelProps {
  side: Side;
  isOpen: boolean;
  reducedMotion: boolean;
}

const PANEL_IMAGE_SRC: Record<Side, string> = {
  left: "/images/envelope/left-panel.png",
  right: "/images/envelope/right-panel.png",
};

const OPEN_ROTATION_DEG: Record<Side, number> = {
  left: -114,
  right: 114,
};

export function EnvelopePanel({ side, isOpen, reducedMotion }: EnvelopePanelProps) {
  const isLeft = side === "left";

  return (
    <motion.div
      className={`absolute top-0 h-full w-1/2 ${isLeft ? "left-0" : "right-0"}`}
      style={{
        transformOrigin: isLeft ? "left center" : "right center",
        backfaceVisibility: "hidden",
      }}
      initial={false}
      animate={
        reducedMotion
          ? { opacity: isOpen ? 0 : 1 }
          : {
              rotateY: isOpen ? OPEN_ROTATION_DEG[side] : 0,
              opacity: isOpen ? 0 : 1,
            }
      }
      transition={{
        rotateY: { duration: 1.1, ease: [0.65, 0, 0.35, 1] },
        opacity: {
          duration: reducedMotion ? 0.45 : 0.6,
          delay: reducedMotion ? 0 : 0.55,
        },
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- needs a plain <img> for direct rotateY/opacity control via Framer Motion */}
      <img
        src={PANEL_IMAGE_SRC[side]}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
}
