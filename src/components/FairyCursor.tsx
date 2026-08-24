"use client";

import { useEffect, useRef } from "react";

// Warm dust palette — mostly gold, occasional pale ivory for sparkle variety.
const DUST_COLORS = [
  "rgba(255,246,214,0.95)",
  "rgba(255,224,150,0.95)",
  "rgba(255,236,190,0.95)",
  "rgba(255,214,120,0.95)",
];

const EMIT_DISTANCE = 5; // px moved between dust bursts

/**
 * Replaces the pointer with a small glowing wand that trails fairy dust as it
 * moves. The pointermove handler does the bare minimum (write the wand
 * transform), so the tip tracks the cursor with no lag; the heavier dust
 * spawning runs in a separate rAF loop off the input path. Imperative
 * throughout (refs + Web Animations API, no React state per frame). Enabled
 * only on fine-pointer (mouse) devices, and disabled for reduced motion or
 * while the lantern-calibration tool is active.
 */
export function FairyCursor() {
  const wandRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const calibrating =
      new URLSearchParams(window.location.search).get("calibrate-lanterns") === "1";
    if (!finePointer || reducedMotion || calibrating) return;

    const wand = wandRef.current;
    const dust = dustRef.current;
    if (!wand || !dust) return;

    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    let x = -100;
    let y = -100;
    let emitX = 0;
    let emitY = 0;
    let shown = false;
    let raf = 0;

    const emitDust = (px: number, py: number) => {
      const span = document.createElement("span");
      const size = 3 + Math.random() * 5;
      const ox = (Math.random() - 0.5) * 14;
      const oy = (Math.random() - 0.5) * 14;
      const color = DUST_COLORS[(Math.random() * DUST_COLORS.length) | 0];
      span.style.cssText = `position:absolute;left:${px + ox}px;top:${py + oy}px;width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle,${color} 0%,rgba(255,214,140,0) 72%);transform:translate(-50%,-50%);will-change:transform,opacity;`;
      dust.appendChild(span);
      const driftX = (Math.random() - 0.5) * 28;
      const driftY = Math.random() * 34 - 10; // mostly down, some float up
      const anim = span.animate(
        [
          { opacity: 0, transform: "translate(-50%,-50%) scale(0.6)" },
          { opacity: 0.95, transform: "translate(-50%,-50%) scale(1)", offset: 0.18 },
          {
            opacity: 0,
            transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.3)`,
          },
        ],
        { duration: 950 + Math.random() * 750, easing: "cubic-bezier(0.22,1,0.36,1)" }
      );
      anim.onfinish = () => span.remove();
    };

    // Dust loop, decoupled from input so spawning never delays the wand.
    const loop = () => {
      if (shown) {
        const dx = x - emitX;
        const dy = y - emitY;
        if (dx * dx + dy * dy >= EMIT_DISTANCE * EMIT_DISTANCE) {
          emitX = x;
          emitY = y;
          const count = 4 + (Math.random() < 0.5 ? 1 : 0);
          for (let k = 0; k < count; k++) emitDust(x, y);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      wand.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!shown) {
        wand.style.opacity = "1";
        shown = true;
        emitX = x;
        emitY = y;
      }
    };
    const hide = () => {
      wand.style.opacity = "0";
      shown = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      document.body.style.cursor = prevCursor;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <>
      <div
        ref={dustRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      />
      <div
        ref={wandRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[61]"
        style={{ opacity: 0, transform: "translate3d(-100px,-100px,0)", willChange: "transform" }}
      >
        {/* Slender tapered handle, fading out at the far end. */}
        <span
          className="absolute top-0 left-0 origin-top"
          style={{
            width: 2.5,
            height: 26,
            borderRadius: 3,
            transform: "rotate(-42deg)",
            background: "linear-gradient(to bottom, #e7c979 0%, #c69a45 55%, rgba(198,154,69,0) 100%)",
          }}
        />
        {/* Head: a luminous fairy-light orb with a bright core (sits on the pointer). */}
        <span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 16,
            height: 16,
            background:
              "radial-gradient(circle, #ffffff 0%, #fff2cf 28%, rgba(255,214,140,0.75) 55%, rgba(255,214,140,0) 76%)",
            boxShadow: "0 0 9px 2px rgba(255,214,140,0.75)",
          }}
        />
        {/* A tiny sharp glint on the orb for a magical shine. */}
        <svg
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          style={{ filter: "drop-shadow(0 0 2px rgba(255,236,190,0.95))" }}
        >
          <path
            d="M12 2 C12.7 9 15 11.3 22 12 C15 12.7 12.7 15 12 22 C11.3 15 9 12.7 2 12 C9 11.3 11.3 9 12 2 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </>
  );
}
