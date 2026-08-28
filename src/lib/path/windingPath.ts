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

const CATMULL_ROM_TENSION = 5.7;

/** The cubic Bézier control points for the Catmull-Rom segment between `points[i]` and `points[i + 1]`. */
function catmullRomSegment(points: Point[], i: number): [Point, Point, Point, Point] {
  const p0 = points[i - 1] ?? points[i];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[i + 2] ?? p2;

  const c1: Point = {
    x: p1.x + (p2.x - p0.x) / CATMULL_ROM_TENSION,
    y: p1.y + (p2.y - p0.y) / CATMULL_ROM_TENSION,
  };
  const c2: Point = {
    x: p2.x - (p3.x - p1.x) / CATMULL_ROM_TENSION,
    y: p2.y - (p3.y - p1.y) / CATMULL_ROM_TENSION,
  };
  return [p1, c1, c2, p2];
}

/** Smooth Catmull-Rom spline converted to cubic Béziers. */
function smoothThroughPoints(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [, c1, c2, p2] = catmullRomSegment(points, i);
    d += ` C ${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
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

/**
 * Elegant botanical curl / tendril — a genuine mathematical spiral (like a
 * pea-tendril's coil) rather than a hand-tuned symmetric loop: it starts
 * exactly at `anchor` and winds inward, its radius shrinking as its angle
 * sweeps around, so it reads as an open, organic curl rather than a
 * closed, geometric shape. No node is attached to it — only real
 * itinerary events get dots.
 */
function curlPath(anchor: Point, size: number, dir: 1 | -1): string {
  // The spiral's center, offset from the anchor — the vector from center
  // to anchor gives the spiral's starting radius and angle, guaranteeing
  // the curve's first point is exactly `anchor`.
  const center: Point = { x: anchor.x + dir * size * 0.42, y: anchor.y - size * 0.32 };
  const startRadius = Math.hypot(anchor.x - center.x, anchor.y - center.y);
  const startAngle = Math.atan2(anchor.y - center.y, anchor.x - center.x);
  const endRadius = size * 0.05;
  const turns = 1.35;
  const steps = 18;

  // Sweeping the angle by `-dir` (not `+dir`) moves the very start of the
  // spiral AWAY from the trunk first — with the `+dir` sign, the anchor's
  // starting angle already points back toward the trunk, so the first
  // stretch of the sweep (while the radius is still largest) swung the
  // tendril's tail further across the trunk before curling inward.
  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle - dir * t * turns * 2 * Math.PI;
    const radius = startRadius - (startRadius - endRadius) * t;
    points.push({ x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius });
  }

  return smoothThroughPoints(points);
}

export interface LeafSprig {
  stemD: string;
  leaves: string[];
  /** One short line per leaf, drawn AFTER (on top of) the filled leaf shapes — a visible midrib crossing through each leaf's middle, like a real leaf's central vein, instead of the stem just touching the leaf's edge. */
  veins: string[];
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
 * of the main vine at `anchor`, with `leafCount` small oval leaves — each
 * on its OWN short pedicel stem branching off at a different point along
 * that secondary branch, alternating sides, EXCEPT the largest leaf,
 * which grows directly out of the branch's real endpoint rather than
 * another lateral pedicel — no separate pedicel, no gap, so the branch
 * reads as culminating in a leaf instead of leaving a bit of bare stem
 * dangling past the last one.
 */
function leafSprig(anchor: Point, size: number, dir: 1 | -1, leafCount: 2 | 3 = 3): LeafSprig {
  const x = anchor.x;
  const y = anchor.y;

  // Stems (the secondary branch and each pedicel) are kept short — the
  // leaves themselves are the point of emphasis, not the twigs carrying
  // them.
  const branchLength = size * 1.5;
  const p0 = anchor;
  const p1: Point = { x: x + size * 0.22 * dir, y: y - branchLength * 0.35 };
  const p2: Point = { x: x + size * 0.55 * dir, y: y - branchLength * 0.75 };
  const p3: Point = { x: x + size * 0.68 * dir, y: y - branchLength };
  let stemD = `M ${p0.x.toFixed(1)},${p0.y.toFixed(1)} C ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${p3.x.toFixed(1)},${p3.y.toFixed(1)}`;

  const leaves: string[] = [];
  const veins: string[] = [];

  function addVeinedLeaf(base: Point, angleDeg: number, length: number, width: number) {
    leaves.push(leafShape(base, angleDeg, length, width));
    const rad = (angleDeg * Math.PI) / 180;
    const veinLength = length * 0.62;
    const veinEnd: Point = { x: base.x + Math.cos(rad) * veinLength, y: base.y + Math.sin(rad) * veinLength };
    veins.push(`M ${base.x.toFixed(1)},${base.y.toFixed(1)} L ${veinEnd.x.toFixed(1)},${veinEnd.y.toFixed(1)}`);
  }

  // Every leaf but the last is a lateral one, splaying out to the side via
  // its own short pedicel partway along the branch.
  const lateralPositions = leafCount === 3 ? [0.3, 0.62] : [0.42];
  const lateralShapes =
    leafCount === 3
      ? [
          { length: size * 0.5, width: size * 0.36 }, // lower leaf — medium
          { length: size * 0.28, width: size * 0.26 }, // middle — small, roundish bud
        ]
      : [{ length: size * 0.4, width: size * 0.3 }]; // the sprig's one small side leaf
  lateralPositions.forEach((t, i) => {
    const base = cubicPoint(p0, p1, p2, p3, t);
    const side = i % 2 === 0 ? 1 : -1;
    const angle = -90 + side * 68 * dir;
    const pedicelLength = size * 0.16;
    const rad = (angle * Math.PI) / 180;
    const tip: Point = { x: base.x + Math.cos(rad) * pedicelLength, y: base.y + Math.sin(rad) * pedicelLength };

    stemD += ` M ${base.x.toFixed(1)},${base.y.toFixed(1)} L ${tip.x.toFixed(1)},${tip.y.toFixed(1)}`;
    addVeinedLeaf(tip, angle, lateralShapes[i].length, lateralShapes[i].width);
  });

  // The largest leaf grows directly out of the branch's real endpoint
  // (p3), continuing in the exact direction the branch was already
  // heading (the tangent at the end of a cubic Bézier is the direction
  // from its last control point to its endpoint).
  const endAngle = (Math.atan2(p3.y - p2.y, p3.x - p2.x) * 180) / Math.PI;
  addVeinedLeaf(p3, endAngle, size * 0.7, size * 0.44);

  return { stemD, leaves, veins };
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
  // A clearly visible botanical sway — not a rigid, barely-moving spine.
  // The floor is intentionally low (not a fixed 20px+) so narrow phones
  // (320–430px) get the smaller value the formula naturally produces
  // there, rather than being pinned up to a floor tuned for wider
  // screens — on a narrow column, that extra sway could bring the trunk
  // uncomfortably close to the event text/illustrations.
  const sway = clamp(containerWidth * 0.055, 14, 42);

  const rows: Point[][] = [];
  for (let i = 0; i < points.length; i += 2) rows.push(points.slice(i, i + 2));
  const rowYs = rows.map((row) => row.reduce((sum, p) => sum + p.y, 0) / row.length);

  // Central stem — its own independent path, not built from event nodes.
  const firstY = rowYs[0];
  const trunkStart: Point = { x: centerX + sway * 0.15, y: Math.max(0, firstY - 70) };
  const trunkPoints: Point[] = [trunkStart];
  const rowAnchors: Point[] = [];
  const intermediates: Point[] = [];

  // Mostly alternates side to side, but not on a perfectly strict
  // every-other-row schedule — occasionally continuing the same direction
  // for one extra row reads as a hand-grown vine rather than a
  // mechanically symmetric wave.
  let prevDirection: 1 | -1 = 1;
  rowYs.forEach((rowY, index) => {
    let direction: 1 | -1;
    if (index === 0) {
      direction = 1;
    } else {
      const keepDirection = rng() < 0.2;
      direction = keepDirection ? prevDirection : prevDirection === 1 ? -1 : 1;
    }
    prevDirection = direction;
    const variance = 0.5 + rng() * 0.7;
    const anchor: Point = { x: centerX + direction * sway * variance, y: rowY };
    trunkPoints.push(anchor);
    rowAnchors.push(anchor);

    const nextY = rowYs[index + 1];
    if (nextY !== undefined) {
      const mid: Point = {
        x: centerX - direction * sway * (0.3 + rng() * 0.55),
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
    const bow = clamp(distance * 0.16, 12, 30) * (0.8 + rng() * 0.35);

    branches.push(botanicalBranchPath(branchOrigin, point, isLeft ? -bow : bow));
  });

  // Decorations anchor on the trunk's real intermediate waypoints — one
  // small botanical detail between rows, never exactly where a branch
  // meets the trunk.
  const leafSize = clamp(containerWidth * 0.048, 18, 30);
  const curlSize = clamp(containerWidth * 0.036, 13, 22);
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

  // One ornamental sprig at the very top of the trunk — sampled from the
  // real first curve segment (not an approximated x,y) so it's actually
  // anchored on the visible trunk rather than floating just beside it.
  const topAnchor =
    trunkPoints.length > 1 ? cubicPoint(...catmullRomSegment(trunkPoints, 0), 0.45) : trunkStart;
  leaves.unshift(leafSprig(topAnchor, leafSize * 1.15, 1));

  // A few extra, smaller two-leaf sprigs at well-spread points further
  // down the trunk — each anchored on a real point along its segment (the
  // same guaranteed-on-curve technique as the top sprig above), not an
  // approximated point, and never on the very first segment (that one
  // already has the top sprig). Sampled past each segment's midpoint
  // (0.65, not 0.5) so the sprig sits comfortably below the row anchor at
  // the segment's start — right at that anchor is where a branch to an
  // event node begins, and a sprig too close to it collided with the
  // branch line.
  const totalSegments = trunkPoints.length - 1;
  const extraSprigCount = 3;
  const usedSegments = new Set<number>([0]);
  for (let k = 1; k <= extraSprigCount; k++) {
    const segIndex = clamp(Math.round((totalSegments * k) / (extraSprigCount + 1)), 1, totalSegments - 1);
    usedSegments.add(segIndex);
    const extraAnchor = cubicPoint(...catmullRomSegment(trunkPoints, segIndex), 0.65);
    const direction: 1 | -1 = k % 2 === 0 ? -1 : 1;
    leaves.push(leafSprig(extraAnchor, leafSize * 0.72, direction, 2));
  }

  // A few extra decorative curls, each a different size, at more points
  // along the trunk — spread across the segments the sprigs above didn't
  // already claim (plus a one-segment buffer around each, so a curl never
  // lands right next to a sprig).
  const reservedSegments = new Set<number>();
  usedSegments.forEach((s) => [s - 1, s, s + 1].forEach((n) => reservedSegments.add(n)));

  const extraCurlSizeMultipliers = [0.65, 1.2, 0.85, 1.35];
  const availableSegments: number[] = [];
  for (let segIndex = 1; segIndex < totalSegments; segIndex++) {
    if (!reservedSegments.has(segIndex)) availableSegments.push(segIndex);
  }
  // If the buffer left too few candidates (a very short itinerary), fall
  // back to just avoiding exact overlap.
  const curlCandidates =
    availableSegments.length >= extraCurlSizeMultipliers.length
      ? availableSegments
      : Array.from({ length: totalSegments - 1 }, (_, i) => i + 1).filter((s) => !usedSegments.has(s));

  extraCurlSizeMultipliers.forEach((multiplier, idx) => {
    const segIndex = curlCandidates[idx % curlCandidates.length];
    if (segIndex === undefined) return;
    const t = idx % 2 === 0 ? 0.4 : 0.6;
    const anchor = cubicPoint(...catmullRomSegment(trunkPoints, segIndex), t);
    const direction: 1 | -1 = idx % 2 === 0 ? 1 : -1;
    curls.push(curlPath(anchor, curlSize * multiplier, direction));
  });

  return { mainD, branches, curls, leaves };
}
