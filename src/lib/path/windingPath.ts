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

// Lower tension means a STRONGER tangent pull through each knot, which
// can overshoot past the point before curving back — that's what read as
// pronounced spikes/loops, not smoothness. A higher tension hugs closer
// to the points with no overshoot, which is what actually reads as
// smooth and continuous. The trunk gets its own value (rather than
// sharing one constant with curls/leaves) so tuning the main line's
// flow doesn't also change the decorations' own shapes.
const CATMULL_ROM_TENSION = 4.2;
const TRUNK_TENSION = 7.5;

/** The cubic Bézier control points for the Catmull-Rom segment between `points[i]` and `points[i + 1]`. */
function catmullRomSegment(points: Point[], i: number, tension: number = CATMULL_ROM_TENSION): [Point, Point, Point, Point] {
  const p0 = points[i - 1] ?? points[i];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[i + 2] ?? p2;

  const c1: Point = {
    x: p1.x + (p2.x - p0.x) / tension,
    y: p1.y + (p2.y - p0.y) / tension,
  };
  const c2: Point = {
    x: p2.x - (p3.x - p1.x) / tension,
    y: p2.y - (p3.y - p1.y) / tension,
  };
  return [p1, c1, c2, p2];
}

/** Smooth Catmull-Rom spline converted to cubic Béziers. */
function smoothThroughPoints(points: Point[], tension: number = CATMULL_ROM_TENSION): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [, c1, c2, p2] = catmullRomSegment(points, i, tension);
    d += ` C ${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Radius of a node's outer hollow ring (see ItineraryPath.tsx) — branches trim back to this, so they stop right at the ring instead of running through the gap into the filled dot. */
export const NODE_OUTER_RADIUS = 10;

/**
 * Short graceful branch growing out of the central trunk toward one event
 * node — grows naturally out of the trunk at first, then gradually
 * straightens as it approaches the node. The curve's endpoint is trimmed
 * back from the node's real center by `NODE_OUTER_RADIUS`, along its own
 * incoming tangent, so it stops exactly at the outer ring — the ring is
 * hollow (no fill in the gap between it and the smaller filled dot), so a
 * line running all the way to center used to show through that gap.
 */
function botanicalBranchPath(from: Point, to: Point, bow: number): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const direction = Math.sign(dx) || 1;

  // c1y used to be `from.y + bow` — an independent vertical push with no
  // relation to which way `to` actually is. With a subtle, nearly-straight
  // trunk that read as a visible little hook right where the branch met
  // it (bowing up before heading back down to the dot). Blending most of
  // c1y toward `to.y` and keeping only a light touch of `bow` still gives
  // the branch some organic curve without doubling back on itself.
  const c1x = from.x + Math.abs(dx) * 0.18 * direction;
  const c1y = from.y + dy * 0.15 + bow * 0.3;
  const c2x = to.x - Math.abs(dx) * 0.22 * direction;
  const c2y = to.y - bow * 0.1 + dy * 0.05;

  const tx = to.x - c2x;
  const ty = to.y - c2y;
  const tLen = Math.hypot(tx, ty) || 1;
  const endX = to.x - (tx / tLen) * NODE_OUTER_RADIUS;
  const endY = to.y - (ty / tLen) * NODE_OUTER_RADIUS;

  return `M ${from.x.toFixed(1)},${from.y.toFixed(1)} C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${endX.toFixed(1)},${endY.toFixed(1)}`;
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
  /** Where this sprig's stem meets the trunk — two independently-stroked thick lines diverging sharply from the same point can leave a visible notch where their rounded caps don't quite cover each other; a small dot drawn over that point hides the seam. */
  anchor: Point;
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

/** Direction (in degrees) the curve is actually heading at parameter `t` — the Bézier's own derivative, not an assumed constant direction. */
function cubicTangentAngle(p0: Point, p1: Point, p2: Point, p3: Point, t: number): number {
  const mt = 1 - t;
  const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
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
 *
 * `startTangentDeg`, when given, is the trunk's own real direction (in
 * degrees) at `anchor` — the branch's first control point continues
 * along that direction for a short stretch before bending away toward
 * `dir`, so the branch reads as one continuous line curving out of the
 * trunk rather than forking off it at a hard angle.
 */
function leafSprig(
  anchor: Point,
  size: number,
  dir: 1 | -1,
  leafCount: 2 | 3 = 3,
  startTangentDeg?: number,
  endAngleOverrideDeg?: number,
  startAngleOverrideDeg?: number
): LeafSprig {

  // Stems (the secondary branch and each pedicel) are kept short — the
  // leaves themselves are the point of emphasis, not the twigs carrying
  // them. The branch's own x-reach is deliberately generous relative to
  // its vertical rise — with a subtle, nearly-straight trunk, a sprig
  // that grows mostly straight up reads as hugging the trunk instead of
  // visibly branching away from it.
  const branchLength = size * 1.1;
  const p0 = anchor;

  // Closer to straight up (-90°) than sideways — a sprig reaching mostly
  // for the sky, with just enough lean to read as growing off one side.
  const endAngleDeg = endAngleOverrideDeg ?? (dir === 1 ? -60 : -120);
  const endRad = (endAngleDeg * Math.PI) / 180;
  const p3: Point = { x: p0.x + Math.cos(endRad) * branchLength, y: p0.y + Math.sin(endRad) * branchLength };

  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;

  let p1: Point;
  let p2: Point;

  if (startAngleOverrideDeg !== undefined) {
    // Traced-shape mode (from the hand-drawn reference): match the exact
    // start and end tangent directions with a Hermite-style construction,
    // using a LONG arm at the start and a shorter one at the end — that
    // asymmetry is what makes the curve stay straight for a good stretch
    // before bending over, matching the traced "up, then a single turn to
    // nearly horizontal" shape, rather than curving evenly the whole way.
    const startRad = (startAngleOverrideDeg * Math.PI) / 180;
    p1 = { x: p0.x + Math.cos(startRad) * branchLength * 0.55, y: p0.y + Math.sin(startRad) * branchLength * 0.55 };
    p2 = { x: p3.x - Math.cos(endRad) * branchLength * 0.3, y: p3.y - Math.sin(endRad) * branchLength * 0.3 };
  } else {
    // A single circular-arc-like bow: both control points sit on the SAME
    // side of the straight line from p0 to p3, tapered so the curve reads
    // as one gentle, constant-direction bend — like an arc of a circle —
    // rather than matching independent tangents at each end (which, when
    // those two directions differ enough, can bend one way then the other
    // and read as a visible pointed kink partway along instead of a
    // smooth curve).
    const lineLen = Math.hypot(dx, dy) || 1;
    const perpX = dy / lineLen;
    const perpY = -dx / lineLen;
    // The trunk's own local direction (when known) nudges the bow's side
    // — a light touch, just enough that the branch leaves the trunk
    // headed roughly the way it was already going, without introducing a
    // second bend direction.
    const tangentNudge =
      startTangentDeg !== undefined ? Math.sin(((startTangentDeg - endAngleDeg) * Math.PI) / 180) * 0.15 : 0;
    const bow = branchLength * (0.26 + tangentNudge);
    p1 = { x: p0.x + dx * 0.24 + perpX * bow, y: p0.y + dy * 0.24 + perpY * bow };
    p2 = { x: p0.x + dx * 0.68 + perpX * bow * 0.75, y: p0.y + dy * 0.68 + perpY * bow * 0.75 };
  }

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
    // Splay off the branch's own real direction at this point, not an
    // assumed "-90 = straight up" — the branch itself now angles fairly
    // diagonally away from the trunk, so a fixed splay angle was pointing
    // leaves across the stem instead of away from it.
    const tangent = cubicTangentAngle(p0, p1, p2, p3, t);
    const side = i % 2 === 0 ? 1 : -1;
    const angle = tangent + side * 68;
    const pedicelLength = size * 0.32;
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

  return { stemD, leaves, veins, anchor: p0 };
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
 *
 * `channelHalf` is the measured horizontal room between the itinerary's
 * center and the nearest illustration edge. The event cards paint ON TOP
 * of this SVG, so anything drawn wider than that channel is simply
 * hidden behind them — on narrow phones the columns close in enough that
 * a sway/decoration size tuned for desktop would bury most of the vine.
 * Sizes are therefore capped to fit the channel that actually exists.
 */
export function buildVine(points: Point[], containerWidth: number, channelHalf: number): VineGeometry {
  if (points.length === 0) return { mainD: "", branches: [], curls: [], leaves: [] };

  const rng = mulberry32(VINE_SEED);
  const centerX = containerWidth / 2;
  // A clearly visible, wide S-curve — the couple's own reference sketch
  // swings noticeably side to side at each bend, not a barely-there wobble
  // — never wider than the free channel between the two columns.
  const sway = Math.min(clamp(containerWidth * 0.065, 20, 42), channelHalf * 0.45);

  const rows: Point[][] = [];
  for (let i = 0; i < points.length; i += 2) rows.push(points.slice(i, i + 2));
  const rowYs = rows.map((row) => row.reduce((sum, p) => sum + p.y, 0) / row.length);

  // Central stem — its own independent path, not built from event nodes.
  // Starts exactly on-center, right under the section ornament, rather
  // than already nudged sideways — a clean vertical entry point for the
  // top leaf sprig to fork cleanly away from, instead of both immediately
  // leaning the same direction and visually merging.
  const firstY = rowYs[0];
  const trunkStart: Point = { x: centerX, y: Math.max(0, firstY - 100) };
  const trunkPoints: Point[] = [trunkStart];
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

    const nextY = rowYs[index + 1];
    if (nextY !== undefined) {
      // A moderate ease-through-center point, not a competing second
      // peak — swinging it nearly as far as the row anchors themselves
      // forced the curve to complete almost a full wave within the short
      // gap between two knots, reading as a tight, pinched kink rather
      // than one flowing S.
      const mid: Point = {
        x: centerX - direction * sway * (0.28 + rng() * 0.18),
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

  const mainD = smoothThroughPoints(trunkPoints, TRUNK_TENSION);

  // Branches grow out of a real point ON the trunk curve, sampled just
  // before (left event) or just after (right event) that row's anchor —
  // not a hand-picked vertical offset from the anchor. A fixed small
  // offset only stays visually on the curve while the trunk is nearly
  // straight there; wherever the trunk bends more sharply, the same
  // offset can land well clear of the actual curve, reading as a branch
  // detached from the vine. Sampling the real segment guarantees the
  // origin always sits exactly on the visible line, and staggers
  // left/right naturally since they're drawn from opposite sides of the
  // anchor.
  const branches: string[] = [];
  points.forEach((point, eventIndex) => {
    const isFinal = isOdd && eventIndex === points.length - 1;
    if (isFinal) return;

    const rowIndex = Math.floor(eventIndex / 2);
    const anchorTrunkIndex = 1 + 2 * rowIndex;
    const isLeft = eventIndex % 2 === 0;

    let branchOrigin: Point;
    if (isLeft) {
      const segIndex = anchorTrunkIndex - 1;
      branchOrigin =
        segIndex >= 0 ? cubicPoint(...catmullRomSegment(trunkPoints, segIndex, TRUNK_TENSION), 0.85) : trunkPoints[anchorTrunkIndex];
    } else {
      const segIndex = anchorTrunkIndex;
      branchOrigin =
        segIndex < trunkPoints.length - 1
          ? cubicPoint(...catmullRomSegment(trunkPoints, segIndex, TRUNK_TENSION), 0.15)
          : trunkPoints[anchorTrunkIndex];
    }

    // Nearly straight, just a light bow — the reference sketch's branches
    // read as gentle, almost-flat lines reaching out to each event, not a
    // pronounced arc.
    const distance = Math.abs(point.x - branchOrigin.x);
    const bow = clamp(distance * 0.07, 5, 14) * (0.8 + rng() * 0.35);

    branches.push(botanicalBranchPath(branchOrigin, point, isLeft ? -bow : bow));
  });

  // Decorations anchor on the trunk's real intermediate waypoints — one
  // small botanical detail between rows, never exactly where a branch
  // meets the trunk. Sized to fit the free channel (minus the room the
  // trunk's own sway already takes) so they don't end up drawn behind the
  // event cards on narrow screens.
  const decorationRoom = Math.max(10, channelHalf - sway);
  const leafSize = Math.min(clamp(containerWidth * 0.044, 17, 27), decorationRoom * 0.85);
  const curlSize = Math.min(clamp(containerWidth * 0.036, 14, 22), decorationRoom * 0.7);
  const leaves: LeafSprig[] = [];
  const curls: string[] = [];

  // Every bend gets a decoration — but leaves only cluster on the upper
  // half of the trunk, exactly like the reference sketch: the two top
  // bends grow leaf sprigs, the lower bends just have curls, rather than
  // foliage spread evenly the whole way down.
  intermediates.forEach((anchor, i) => {
    // Grow toward whichever side the trunk is ALREADY leaning at this
    // exact point (the outside of the bend), not a fixed alternating
    // pattern — a decoration on the inside of a wide curve is on a
    // collision course with the trunk's own path swinging back through.
    const direction: 1 | -1 = anchor.x >= centerX ? 1 : -1;
    const isUpperHalf = i < intermediates.length / 2;

    if (!isUpperHalf) {
      curls.push(curlPath(anchor, curlSize * (0.9 + rng() * 0.15), direction));
      return;
    }

    // `intermediates[i]` is the knot at trunkPoints[2*i + 2] — its real
    // tangent (direction from the knot just before it to the one just
    // after) so the sprig starts by continuing the trunk's own flow
    // instead of forking off at a hard angle.
    const idx = 2 * i + 2;
    const before = trunkPoints[idx - 1];
    const after = trunkPoints[idx + 1] ?? trunkPoints[idx];
    const tangent = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
    // Full 3-leaf sprigs (lateral pair + a terminal leaf growing from the
    // branch's real endpoint) read as noticeably lusher and more
    // confident than a thin 2-leaf pair.
    leaves.push(leafSprig(anchor, leafSize * (1.05 + rng() * 0.2), direction, 3, tangent));
  });

  // A small cluster right at the very top of the trunk, under the section
  // ornament — three leaf sprigs (2 + 2 + 3 = 7 leaves total) plus one
  // spiral, all sampled as real points on the first curve segment (not
  // approximated x,y) so they read as genuinely growing out of the trunk.
  // Staying before t≈0.7 keeps them well clear of the row-0 branch origin
  // sampled later in this same segment (t=0.85). Sizes deliberately don't
  // just grow smoothly top-to-bottom — a tiny bud at the very top, then a
  // clearly bigger leaf, THEN the spiral (sized up so it reads as
  // prominent, not an afterthought), then smaller leaves again — that
  // varied rhythm is what makes it read as hand-grown rather than
  // mechanically graduated.
  if (trunkPoints.length > 1) {
    const openingSeg = catmullRomSegment(trunkPoints, 0, TRUNK_TENSION);
    // Starts straight up (-90°) and stays mostly vertical, ending at a
    // gentle -65° lean — reaching for the sky, not drooping sideways.
    // Sized to match the fuller sprigs elsewhere on the trunk (was
    // 0.6/0.62/0.42 — noticeably smaller and delicate, reading as a
    // different plant from the rest of the vine).
    leaves.unshift(leafSprig(trunkStart, leafSize * 0.68, 1, 2, undefined, -65, -90));
    leaves.unshift(
      leafSprig(cubicPoint(...openingSeg, 0.32), leafSize * 0.72, 1, 2, cubicTangentAngle(...openingSeg, 0.32))
    );
    // Curls toward the right — the sprig right after it is fixed to the
    // left, so they diverge in opposite directions instead of both
    // competing for the same space and overlapping.
    curls.unshift(curlPath(cubicPoint(...openingSeg, 0.5), curlSize * 0.9, 1));
    // Fixed to the left, per explicit request — angled further outward
    // still (-150°, closer to horizontal) for more clearance from the
    // trunk's own path.
    const sprig3Anchor = cubicPoint(...openingSeg, 0.66);
    leaves.unshift(
      leafSprig(sprig3Anchor, leafSize * 0.58, -1, 3, cubicTangentAngle(...openingSeg, 0.66), -150)
    );
  } else {
    leaves.unshift(leafSprig(trunkStart, leafSize * 0.4, 1));
  }

  // A few extra small sprigs just below the trunk's vertical middle —
  // otherwise every leaf clusters near the top, reading as top-heavy.
  // Each (segment, t) pair below was picked by hand to land in a real gap
  // between existing decorations: every trunk segment has a leaf or curl
  // sitting exactly at one of its two endpoints (the "mid" row-transition
  // knots) plus a branch origin sampled near t=0.15 or t=0.85 (close to
  // its "anchor" endpoint) — so the only safe window is the middle third
  // of the segment, and which third depends on which end the segment's
  // own decorated knot is on.
  const totalSegments = trunkPoints.length - 1;
  const usedSegments = new Set<number>([0]);
  const extraSprigSpots: { segIndex: number; t: number; dirOverride?: 1 | -1 }[] = [
    // Pinned left by explicit request — the default (following the
    // trunk's own lean) put it on the right.
    { segIndex: 4, t: 0.45, dirOverride: -1 as const },
    { segIndex: 5, t: 0.55 },
    { segIndex: 6, t: 0.45 },
  ].filter((spot) => spot.segIndex < totalSegments);
  extraSprigSpots.forEach(({ segIndex, t, dirOverride }) => {
    usedSegments.add(segIndex);
    const seg = catmullRomSegment(trunkPoints, segIndex, TRUNK_TENSION);
    const extraAnchor = cubicPoint(...seg, t);
    const direction: 1 | -1 = dirOverride ?? (extraAnchor.x >= centerX ? 1 : -1);
    const tangent = cubicTangentAngle(...seg, t);
    leaves.push(leafSprig(extraAnchor, leafSize * (0.72 + rng() * 0.12), direction, 2, tangent));
  });

  // A few extra decorative curls, each a different size, at more points
  // along the trunk — spread across the segments the sprigs above didn't
  // already claim (plus a one-segment buffer around each, so a curl never
  // lands right next to a sprig).
  const reservedSegments = new Set<number>();
  usedSegments.forEach((s) => [s - 1, s, s + 1].forEach((n) => reservedSegments.add(n)));

  const extraCurlSizeMultipliers = [1.0];
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
    const anchor = cubicPoint(...catmullRomSegment(trunkPoints, segIndex, TRUNK_TENSION), t);
    const direction: 1 | -1 = idx % 2 === 0 ? 1 : -1;
    curls.push(curlPath(anchor, curlSize * multiplier, direction));
  });

  return { mainD, branches, curls, leaves };
}
