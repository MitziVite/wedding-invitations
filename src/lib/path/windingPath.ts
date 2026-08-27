interface Point {
  x: number;
  y: number;
}

/** Deterministic PRNG so the path's jitter is identical on server and client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * One (x, y) stop per event, threading gently around `center` with a little
 * deterministic jitter so the route reads as a soft hand-drawn thread rather
 * than a mechanical zigzag — used as the thin connecting line between the
 * alternating left/right rows of the itinerary, not as the row layout
 * itself. Coordinates are in an abstract 0–100 (x) by 0–stepUnits*count (y)
 * space — pair with an SVG viewBox of the same size and
 * `preserveAspectRatio="none"` to stretch it over any real container.
 */
export function windingStops(
  count: number,
  seed: number,
  stepUnits = 100,
  center = 50,
  jitter = 6
): Point[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const x = clamp(center + (rng() - 0.5) * jitter * 2, center - jitter - 2, center + jitter + 2);
    const y = (i + 0.5) * stepUnits + (rng() - 0.5) * stepUnits * 0.15;
    return { x, y };
  });
}

/**
 * Smooth Catmull-Rom spline through every point (tension 1/6, the standard
 * conversion to cubic beziers) — guarantees the curve actually passes
 * through each stop, so markers never drift off the line, while still
 * reading as a soft, continuous, hand-illustrated route rather than a
 * harsh zigzag between waypoints.
 */
export function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}
