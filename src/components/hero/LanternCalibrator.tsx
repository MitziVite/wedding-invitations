"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { coverBox, GARDEN_INTRINSIC } from "./coverGeometry";

const GARDEN_SRC = "/images/hero/garden-desktop.png";
// Fallback until the real natural size loads; both breakpoints currently use
// the same desktop source.
const FALLBACK_INTRINSIC = { w: GARDEN_INTRINSIC.width, h: GARDEN_INTRINSIC.height };

interface CalPoint {
  id: number;
  /** Percentage of the SOURCE image content (cover-crop inverted), viewport-independent. */
  x: number;
  y: number;
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

/**
 * Dev-only overlay (mounted only when ?calibrate-lanterns=1): click the
 * garden to capture lantern positions as source-image percentages, correctly
 * inverting the object-fit: cover crop so the coordinates land on the same
 * painted feature at any screen size.
 */
export function LanternCalibrator() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [intrinsic, setIntrinsic] = useState<{ w: number; h: number }>(FALLBACK_INTRINSIC);
  const [points, setPoints] = useState<CalPoint[]>([]);
  const [copied, setCopied] = useState(false);

  // One-time mount flag: this dev overlay only exists client-side (gated by
  // a URL param), so it must render nothing on the first pass to match the
  // server HTML, then appear — a deliberate mount gate, not derived state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Read the garden's true natural size for accurate cover math.
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setIntrinsic({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = GARDEN_SRC;
  }, []);

  // Track the container size so markers stay pinned to the painting on resize.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const { renderedW, renderedH, offsetX, offsetY } = coverBox(
        rect.width,
        rect.height,
        intrinsic.w,
        intrinsic.h
      );
      const x = clamp(((cx - offsetX) / renderedW) * 100);
      const y = clamp(((cy - offsetY) / renderedH) * 100);
      setPoints((prev) => [...prev, { id: prev.length + 1, x, y }]);
      setCopied(false);
    },
    [intrinsic]
  );

  const undo = () => setPoints((p) => p.slice(0, -1).map((pt, i) => ({ ...pt, id: i + 1 })));
  const clearAll = () => setPoints([]);

  const code =
    "const lanterns = [\n" +
    points.map((p) => `  { id: ${p.id}, x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)} },`).join("\n") +
    "\n];";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted) return null;

  // Forward-map each stored image-% back to container px for the marker.
  const box = size.w > 0 ? coverBox(size.w, size.h, intrinsic.w, intrinsic.h) : null;

  return (
    <div ref={rootRef} className="absolute inset-0 z-40">
      {/* Transparent click-capture layer, exactly over the rendered image. */}
      <div className="absolute inset-0 cursor-crosshair" onClick={handleClick} />

      {/* Numbered markers, pinned to the painting via cover math. */}
      {box &&
        points.map((p) => {
          const left = box.offsetX + (p.x / 100) * box.renderedW;
          const top = box.offsetY + (p.y / 100) * box.renderedH;
          return (
            <div
              key={p.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left, top }}
            >
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-cyan-400/80 shadow-[0_0_0_2px_rgba(0,0,0,0.5)]" />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-black/70 px-1 text-[11px] font-semibold text-cyan-200 tabular-nums">
                {p.id} · {p.x.toFixed(1)},{p.y.toFixed(1)}
              </span>
            </div>
          );
        })}

      {/* Panel */}
      <div className="absolute right-4 bottom-4 z-50 w-72 max-w-[80vw] rounded-lg border border-white/15 bg-black/85 p-3 text-white shadow-xl backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
            Lantern calibration
          </span>
          <span className="text-[11px] text-white/50 tabular-nums">{points.length} pts</span>
        </div>
        <p className="mb-2 text-[11px] leading-snug text-white/55">
          Click each lantern flame. Coordinates are % of the source image (cover-crop aware).
        </p>
        <div className="mb-2 flex gap-1.5">
          <button
            type="button"
            onClick={undo}
            disabled={points.length === 0}
            className="flex-1 rounded bg-white/10 px-2 py-1.5 text-xs hover:bg-white/20 disabled:cursor-default disabled:opacity-40"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={points.length === 0}
            className="flex-1 rounded bg-white/10 px-2 py-1.5 text-xs hover:bg-white/20 disabled:cursor-default disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={points.length === 0}
            className="flex-1 rounded bg-cyan-500/80 px-2 py-1.5 text-xs font-medium hover:bg-cyan-500 disabled:cursor-default disabled:opacity-40"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="max-h-40 overflow-auto rounded bg-black/60 p-2 text-[11px] leading-relaxed text-cyan-100 select-all">
          {points.length ? code : "// click the lanterns…"}
        </pre>
      </div>
    </div>
  );
}
