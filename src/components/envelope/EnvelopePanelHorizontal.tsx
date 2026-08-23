"use client";

import { motion } from "framer-motion";

type Edge = "top" | "bottom";

interface EnvelopePanelHorizontalProps {
  edge: Edge;
  isOpen: boolean;
  reducedMotion: boolean;
}

const PANEL_IMAGE_SRC: Record<Edge, string> = {
  top: "/images/envelope/top-panel.png",
  bottom: "/images/envelope/bottom-panel.png",
};

const OPEN_ROTATION_DEG: Record<Edge, number> = {
  top: -114,
  bottom: 114,
};

/**
 * top-panel.png / bottom-panel.png are derived assets (see the asset-prep
 * step run alongside this component): each is the vertical door panels'
 * already-known-clean texture region, rotated 90deg into a wide landscape
 * swatch. Because that source crop already excluded the black border and
 * vignette, these images are clean edge-to-edge content on their own, so —
 * unlike EnvelopePanel — no manual content-box compensation is needed here;
 * plain `object-fit: cover` is sufficient and robust to any slot aspect.
 */
export function EnvelopePanelHorizontal({
  edge,
  isOpen,
  reducedMotion,
}: EnvelopePanelHorizontalProps) {
  const isTop = edge === "top";

  return (
    <motion.div
      className={`absolute left-0 h-1/2 w-full overflow-hidden ${isTop ? "top-0" : "bottom-0"}`}
      style={{
        transformOrigin: isTop ? "center top" : "center bottom",
        backfaceVisibility: "hidden",
      }}
      initial={false}
      animate={
        reducedMotion
          ? { opacity: isOpen ? 0 : 1 }
          : {
              rotateX: isOpen ? OPEN_ROTATION_DEG[edge] : 0,
              opacity: isOpen ? 0 : 1,
            }
      }
      transition={{
        rotateX: { duration: 1.1, ease: [0.65, 0, 0.35, 1] },
        opacity: {
          duration: reducedMotion ? 0.45 : 0.6,
          delay: reducedMotion ? 0 : 0.55,
        },
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- needs a plain <img> for direct rotateX/opacity control via Framer Motion */}
      <img
        src={PANEL_IMAGE_SRC[edge]}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </motion.div>
  );
}
