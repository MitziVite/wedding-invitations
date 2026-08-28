interface Point {
  x: number;
  y: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Stable pseudo-random generator (fixed seed) — gives the vine slight organic variation without changing every render. */
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

const VINE_SEED = 20260828;

/** Smooth Catmull-Rom spline converted to cubic Béziers. */
function smoothThroughPoints(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const tension = 5.7;
    const c1x = p1.x + (p2.x - p0.x) / tension;
    const c1y = p1.y + (p2.y - p0.y) / tension;
    const c2x = p2.x - (p3.x - p1.x) / tension;
    const c2y = p2.y - (p3.y - p1.y) / tension;

    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Short graceful branch growing out of the central trunk toward one event
 * node — grows naturally out of the trunk at first, then gradually
 * straightens as it approaches the node.
 */
function botanicalBranchPath(from: Point, to: Point, bow: number): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const direction = Math.sign(dx) || 1;

  const c1x = from.x + Math.abs(dx) * 0.18 * direction;
  const c1y = from.y + bow;
  const c2x = to.x - Math.abs(dx) * 0.22 * direction;
  const c2y = to.y - bow * 0.18 + dy * 0.05;

  return `M ${from.x.toFixed(1)},${from.y.toFixed(1)} C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${to.x.toFixed(1)},${to.y.toFixed(1)}`;
}

/** Elegant botanical curl / tendril. No node is attached to it — only real itinerary events get dots. */
function curlPath(anchor: Point, size: number, dir: 1 | -1): string {
  const x = anchor.x;
  const y = anchor.y;
  const w = size * dir;

  return [
    `M ${x.toFixed(1)},${y.toFixed(1)}`,
    `C ${(x + w * 0.25).toFixed(1)},${(y - size * 0.15).toFixed(1)}`,
    `${(x + w * 0.9).toFixed(1)},${(y - size * 0.65).toFixed(1)}`,
    `${(x + w * 0.55).toFixed(1)},${(y - size).toFixed(1)}`,
    `C ${(x + w * 0.15).toFixed(1)},${(y - size * 1.25).toFixed(1)}`,
    `${(x - w * 0.45).toFixed(1)},${(y - size * 0.95).toFixed(1)}`,
    `${(x - w * 0.15).toFixed(1)},${(y - size * 0.55).toFixed(1)}`,
    `C ${(x + w * 0.05).toFixed(1)},${(y - size * 0.35).toFixed(1)}`,
    `${(x + w * 0.35).toFixed(1)},${(y - size * 0.45).toFixed(1)}`,
    `${(x + w * 0.25).toFixed(1)},${(y - size * 0.68).toFixed(1)}`,
  ].join(" ");
}

export interface LeafSprig {
  stemD: string;
  leaves: string[];
}

/**
 * A single pointed leaf silhouette (a "vesica" shape — tapers to a point
 * at both the base and the tip, bulging in the middle) as a filled path.
 * An ellipse has no point at either end, so no amount of rotating it ever
 * reads as a leaf — it just looks like a petal or a bow. `angleDeg` is
 * the direction the leaf points away from `base` (0 = right, -90 = up,
 * screen coordinates).
 */
function leafShape(base: Point, angleDeg: number, length: number, width: number): string {
  const rad = (angleDeg * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  const perpX = -dirY;
  const perpY = dirX;

  const tipX = base.x + dirX * length;
  const tipY = base.y + dirY * length;
  const midX = base.x + dirX * length * 0.5;
  const midY = base.y + dirY * length * 0.5;
  const bulge = width / 2;

  const c1x = midX + perpX * bulge;
  const c1y = midY + perpY * bulge;
  const c2x = midX - perpX * bulge;
  const c2y = midY - perpY * bulge;

  return (
    `M ${base.x.toFixed(1)},${base.y.toFixed(1)} ` +
    `Q ${c1x.toFixed(1)},${c1y.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} ` +
    `Q ${c2x.toFixed(1)},${c2y.toFixed(1)} ${base.x.toFixed(1)},${base.y.toFixed(1)} Z`
  );
}

/**
 * Small, delicate trifoliate sprig growing directly out of the main vine:
 * one short curved stem, then three clearly-separated pointed leaflets —
 * two lower ones splaying out to either side of the stem, one at the tip
 * pointing straight up — rather than leaves stacked on top of each other
 * along the same line (which is what was fusing into one blob).
 */
/** Point at parameter `t` along a cubic Bézier defined by p0..p3. */
function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

/**
 * Small botanical sprig: a short secondary branch that visibly grows out
 * of the main vine at `anchor`, with three small oval leaves — each on
 * its OWN short pedicel stem branching off at a different point along
 * that secondary branch, alternating sides — rather than leaves attached
 * with no stem of their own at one single spot (which read as one fused
 * cluster instead of a sprig).
 */
function leafSprig(anchor: Point, size: number, dir: 1 | -1): LeafSprig {
  const x = anchor.x;
  const y = anchor.y;

  // The secondary branch: curves outward and upward from the vine.
  const branchLength = size * 2.4;
  const p0 = anchor;
  const p1: Point = { x: x + size * 0.35 * dir, y: y - branchLength * 0.35 };
  const p2: Point = { x: x + size * 0.85 * dir, y: y - branchLength * 0.75 };
  const p3: Point = { x: x + size * 1.05 * dir, y: y - branchLength };
  let stemD = `M ${p0.x.toFixed(1)},${p0.y.toFixed(1)} C ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${p3.x.toFixed(1)},${p3.y.toFixed(1)}`;

  const leaves: string[] = [];
  const pedicelPositions = [0.32, 0.62, 0.9];
  pedicelPositions.forEach((t, i) => {
    const base = cubicPoint(p0, p1, p2, p3, t);
    const side = i % 2 === 0 ? 1 : -1;
    const angle = -90 + side * 50 * dir;
    const pedicelLength = size * 0.3;
    const rad = (angle * Math.PI) / 180;
    const tip: Point = { x: base.x + Math.cos(rad) * pedicelLength, y: base.y + Math.sin(rad) * pedicelLength };

    stemD += ` M ${base.x.toFixed(1)},${base.y.toFixed(1)} L ${tip.x.toFixed(1)},${tip.y.toFixed(1)}`;
    leaves.push(leafShape(tip, angle, size * 0.34, size * 0.22));
  });

  return { stemD, leaves };
}

export interface VineGeometry {
  mainD: string;
  branches: string[];
  curls: string[];
  leaves: LeafSprig[];
}

/**
 * Creates the central botanical itinerary vine. The trunk is built
 * INDEPENDENTLY of the event nodes — one graceful anchor per row, not
 * per event — and branches grow OUT of that trunk toward each node,
 * staggered slightly in height for the left/right pair so they don't
 * originate from exactly the same point. Leaf sprigs and tendril curls
 * anchor on the trunk's real intermediate waypoints (the exact
 * coordinates the spline passes through — a separately-recomputed
 * approximation, even a close one, drifts off the actual curve and reads
 * as floating decorations disconnected from the vine), so they always sit
 * between rows rather than exactly where a branch meets the trunk. Every
 * branch, bend, and decoration gets its own small deterministic variation
 * (fixed seed, stable across re-renders/resizes) so nothing reads as a
 * stamped-out repeat of the same shape. Node positions come from
 * WeddingItinerary, which places each node BETWEEN the itinerary's
 * horizontal center and its illustration (not pinned to the illustration
 * itself) — that's what keeps branches short rather than long near-
 * horizontal lines. `points` is expected in reading order, two per row
 * (one left-column event followed by its right-column pair).
 */
export function buildVine(points: Point[], containerWidth: number): VineGeometry {
  if (points.length === 0) return { mainD: "", branches: [], curls: [], leaves: [] };

  const rng = mulberry32(VINE_SEED);
  const centerX = containerWidth / 2;
  // Very subtle movement — a botanical stem, not a sine-wave timeline.
  const sway = clamp(containerWidth * 0.022, 7, 16);

  const rows: Point[][] = [];
  for (let i = 0; i < points.length; i += 2) rows.push(points.slice(i, i + 2));
  const rowYs = rows.map((row) => row.reduce((sum, p) => sum + p.y, 0) / row.length);

  // Central stem — its own independent path, not built from event nodes.
  const firstY = rowYs[0];
  const trunkStart: Point = { x: centerX + sway * 0.15, y: Math.max(0, firstY - 70) };
  const trunkPoints: Point[] = [trunkStart];
  const rowAnchors: Point[] = [];
  const intermediates: Point[] = [];

  rowYs.forEach((rowY, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const variance = 0.55 + rng() * 0.35;
    const anchor: Point = { x: centerX + direction * sway * variance, y: rowY };
    trunkPoints.push(anchor);
    rowAnchors.push(anchor);

    const nextY = rowYs[index + 1];
    if (nextY !== undefined) {
      const mid: Point = {
        x: centerX - direction * sway * (0.35 + rng() * 0.25),
        y: rowY + (nextY - rowY) * (0.46 + rng() * 0.08),
      };
      trunkPoints.push(mid);
      intermediates.push(mid);
    }
  });

  const isOdd = points.length % 2 === 1;
  const finalPoint = points[points.length - 1];
  if (isOdd) {
    trunkPoints.push({ x: centerX, y: finalPoint.y });
  }

  const mainD = smoothThroughPoints(trunkPoints);

  // Branches grow out of their row's real trunk anchor (the exact x the
  // curve passes through), staggered slightly in y so left/right pairs
  // don't share an origin.
  const branches: string[] = [];
  points.forEach((point, eventIndex) => {
    const isFinal = isOdd && eventIndex === points.length - 1;
    if (isFinal) return;

    const rowIndex = Math.floor(eventIndex / 2);
    const rowAnchor = rowAnchors[rowIndex];
    const isLeft = eventIndex % 2 === 0;
    const verticalOffset = clamp(containerWidth * 0.018, 8, 18);

    const branchOrigin: Point = {
      x: rowAnchor.x,
      y: rowAnchor.y + (isLeft ? -verticalOffset : verticalOffset),
    };

    const distance = Math.abs(point.x - branchOrigin.x);
    const bow = clamp(distance * 0.08, 5, 14) * (0.85 + rng() * 0.25);

    branches.push(botanicalBranchPath(branchOrigin, point, isLeft ? -bow : bow));
  });

  // Decorations anchor on the trunk's real intermediate waypoints — one
  // small botanical detail between rows, never exactly where a branch
  // meets the trunk.
  const leafSize = clamp(containerWidth * 0.026, 9, 16);
  const curlSize = clamp(containerWidth * 0.024, 8, 15);
  const leaves: LeafSprig[] = [];
  const curls: string[] = [];

  intermediates.forEach((anchor, i) => {
    const direction: 1 | -1 = i % 2 === 0 ? 1 : -1;
    if (i % 3 === 1) {
      curls.push(curlPath(anchor, curlSize * (0.9 + rng() * 0.15), direction));
    } else {
      leaves.push(leafSprig(anchor, leafSize * (0.9 + rng() * 0.15), direction));
    }
  });

  // One ornamental sprig at the very top of the trunk.
  leaves.unshift(leafSprig({ x: trunkStart.x, y: Math.max(20, firstY - 35) }, leafSize * 1.15, 1));

  return { mainD, branches, curls, leaves };
}
