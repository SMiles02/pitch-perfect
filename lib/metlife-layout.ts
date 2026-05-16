import metlifeData from "@/data/layouts/metlife-sections.json";

export type MetlifeCategory = "1" | "2" | "3" | "4";

export interface MetlifeSectionDef {
  id: string;
  category: MetlifeCategory;
}

export interface MetlifeLayoutConfig {
  viewBox: [number, number, number, number];
  field: { x: number; y: number; w: number; h: number };
  categories: Record<
    MetlifeCategory,
    { label: string; fill: string; stroke: string }
  >;
  sections: MetlifeSectionDef[];
}

export const metlifeLayout = metlifeData as MetlifeLayoutConfig;

const CX = 130;
const CY = 55;

/** Horizontal stretch for football-pitch proportions (touchlines long, goals short). */
const STRETCH_X = 1.42;
const STRETCH_Y = 0.78;

/** Parse leading number from section id (e.g. 111A → 111). */
export function sectionSortKey(id: string): number {
  const m = id.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

/** Bowl ring: 1=lower (100s), 2=club (200s), 3=upper (300s). */
export function sectionRing(id: string): 1 | 2 | 3 {
  const n = sectionSortKey(id);
  if (n >= 300) return 3;
  if (n >= 200) return 2;
  return 1;
}

const RING_BOUNDS: Record<1 | 2 | 3, { inner: number; outer: number }> = {
  1: { inner: 34, outer: 48 },
  2: { inner: 48, outer: 58 },
  3: { inner: 58, outer: 68 },
};

/**
 * Map section number → compass angle (deg). Uses the tens digit within each
 * century so 106 / 206 / 306 share an azimuth; corner blocks 306, 321, 331, 346
 * sit on the four diagonal corners of the elliptical bowl.
 */
const AZIMUTH_ANCHORS: { local: number; angle: number }[] = [
  { local: 1, angle: -90 },
  { local: 6, angle: -45 },
  { local: 21, angle: 45 },
  { local: 31, angle: 135 },
  { local: 46, angle: 225 },
  { local: 50, angle: 270 },
];

function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a <= -180) a += 360;
  return a;
}

function lerpAngle(a0: number, a1: number, t: number): number {
  let delta = a1 - a0;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return a0 + delta * t;
}

export function sectionNumToAngle(sectionNum: number): number {
  const local = sectionNum % 100;
  if (local <= AZIMUTH_ANCHORS[0].local) {
    return AZIMUTH_ANCHORS[0].angle;
  }
  for (let i = 0; i < AZIMUTH_ANCHORS.length - 1; i++) {
    const a0 = AZIMUTH_ANCHORS[i];
    const a1 = AZIMUTH_ANCHORS[i + 1];
    if (local <= a1.local) {
      const t = (local - a0.local) / (a1.local - a0.local);
      return lerpAngle(a0.angle, a1.angle, t);
    }
  }
  const last = AZIMUTH_ANCHORS[AZIMUTH_ANCHORS.length - 1];
  return last.angle;
}

/** Sort key: stadium azimuth with tiny suffix offset for 111A / 111B / 111C. */
export function sectionSortAngle(id: string): number {
  const num = sectionSortKey(id);
  const base = sectionNumToAngle(num);
  const suffix = id.match(/^\d+([A-Z]+)/)?.[1];
  const bump = suffix ? (suffix.charCodeAt(0) - 64) * 0.08 : 0;
  return base + bump;
}

const CORNER_LOCALS = [6, 21, 31, 46] as const;
const SECTION_GAP = 0.35;
const RING_START = -90;

function sliceWidth(count: number): number {
  return (360 - count * SECTION_GAP) / count;
}

function slotMidAt(index: number, count: number, ringOffset: number): number {
  const slice = sliceWidth(count);
  const step = slice + SECTION_GAP;
  return ringOffset + (RING_START + SECTION_GAP / 2 + index * step + slice / 2);
}

/** Match corner spokes (106/206/306 …) to equal slots; return shared rotation (deg). */
function computeRingOffset(list: MetlifeSectionDef[]): number {
  const sorted = [...list].sort((a, b) => sectionSortAngle(a.id) - sectionSortAngle(b.id));
  const n = sorted.length;
  const slice = sliceWidth(n);
  const step = slice + SECTION_GAP;

  let sumSin = 0;
  let sumCos = 0;

  for (const local of CORNER_LOCALS) {
    const target = sectionNumToAngle(300 + local);
    let best = sorted[0];
    let bestDist = 999;
    for (const s of sorted) {
      const l = sectionSortKey(s.id) % 100;
      let dist = Math.abs(l - local);
      if (dist > 50) dist = 100 - dist;
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
    const idx = sorted.indexOf(best);
    const slotMid = RING_START + SECTION_GAP / 2 + idx * step + slice / 2;
    const delta = normalizeAngle(target - slotMid);
    const rad = (delta * Math.PI) / 180;
    sumSin += Math.sin(rad);
    sumCos += Math.cos(rad);
  }

  return (Math.atan2(sumSin, sumCos) * 180) / Math.PI;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: cx + r * STRETCH_X * Math.cos(rad),
    y: cy + r * STRETCH_Y * Math.sin(rad),
  };
}

/** SVG wedge path on an elliptical bowl (top-down football stadium). */
export function wedgePath(
  startDeg: number,
  endDeg: number,
  innerR: number,
  outerR: number
): string {
  const p1 = polar(CX, CY, innerR, startDeg);
  const p2 = polar(CX, CY, outerR, startDeg);
  const p3 = polar(CX, CY, outerR, endDeg);
  const p4 = polar(CX, CY, innerR, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;

  const oRx = outerR * STRETCH_X;
  const oRy = outerR * STRETCH_Y;
  const iRx = innerR * STRETCH_X;
  const iRy = innerR * STRETCH_Y;

  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `A ${oRx.toFixed(2)} ${oRy.toFixed(2)} 0 ${large} 1 ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `L ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    `A ${iRx.toFixed(2)} ${iRy.toFixed(2)} 0 ${large} 0 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export interface PlacedSection extends MetlifeSectionDef {
  path: string;
  labelX: number;
  labelY: number;
  midAngle: number;
  startDeg: number;
  endDeg: number;
  innerR: number;
  outerR: number;
}

export interface PlacedSeat {
  id: string;
  row: number;
  number: number;
  label: string;
  cx: number;
  cy: number;
  r: number;
}

/** Equal wedge per ring; order & corners from section numbers (Ticket-Compare layout). */
export function placeMetlifeSections(): PlacedSection[] {
  const byRing: Record<1 | 2 | 3, MetlifeSectionDef[]> = { 1: [], 2: [], 3: [] };

  for (const s of metlifeLayout.sections) {
    byRing[sectionRing(s.id)].push(s);
  }

  const ringOffset = computeRingOffset(byRing[3]);
  const placed: PlacedSection[] = [];

  for (const ring of [1, 2, 3] as const) {
    const list = [...byRing[ring]].sort(
      (a, b) => sectionSortAngle(a.id) - sectionSortAngle(b.id)
    );
    const { inner, outer } = RING_BOUNDS[ring];
    const n = list.length;
    const halfSlice = sliceWidth(n) / 2;

    for (let i = 0; i < n; i++) {
      const s = list[i];
      const mid = slotMidAt(i, n, ringOffset);
      const start = mid - halfSlice;
      const end = mid + halfSlice;
      const labelR = (inner + outer) / 2;
      const label = polar(CX, CY, labelR, mid);

      placed.push({
        ...s,
        path: wedgePath(start, end, inner, outer),
        labelX: label.x,
        labelY: label.y,
        midAngle: mid,
        startDeg: start,
        endDeg: end,
        innerR: inner,
        outerR: outer,
      });
    }
  }

  return placed;
}

export function getMetlifeSection(id: string): MetlifeSectionDef | undefined {
  return metlifeLayout.sections.find((s) => s.id === id);
}

/** ViewBox string zoomed to a single section wedge. */
export function getSectionViewBox(sec: PlacedSection, padding = 6): string {
  const samples = 14;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const span = sec.endDeg - sec.startDeg;

  for (let i = 0; i <= samples; i++) {
    const d = sec.startDeg + (i / samples) * span;
    for (const r of [sec.innerR, sec.outerR]) {
      const p = polar(CX, CY, r, d);
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }

  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
}

/** Row × seat grid inside a section wedge (row 1 = pitch side). */
export function placeSeatsInWedge(
  sec: PlacedSection,
  seats: { id: string; row: number; number: number; label: string }[]
): PlacedSeat[] {
  const rows = [...new Set(seats.map((s) => s.row))].sort((a, b) => a - b);
  const span = sec.endDeg - sec.startDeg;
  const depth = sec.outerR - sec.innerR;
  const placed: PlacedSeat[] = [];

  for (const row of rows) {
    const rowSeats = seats.filter((s) => s.row === row).sort((a, b) => a.number - b.number);
    const rowIdx = rows.indexOf(row);
    const rowT = (rowIdx + 0.5) / rows.length;
    const r = sec.innerR + rowT * depth;

    rowSeats.forEach((seat, i) => {
      const seatT = (i + 0.5) / rowSeats.length;
      const deg = sec.startDeg + seatT * span;
      const { x, y } = polar(CX, CY, r, deg);
      const radial = depth / rows.length;
      const arc = (span / rowSeats.length) * (Math.PI / 180) * r * STRETCH_X;
      const seatR = Math.min(0.55, radial * 0.38, arc * 0.32);

      placed.push({
        ...seat,
        cx: x,
        cy: y,
        r: Math.max(seatR, 0.28),
      });
    });
  }

  return placed;
}

/**
 * Pitch rectangle fully inside the lower-bowl hole (r < inner).
 * Uses the largest axis-aligned rectangle inscribed in the inner ellipse,
 * then scales down so corners stay clear of the seat wedges.
 */
export function getMetlifeField(padding = 0.92): { x: number; y: number; w: number; h: number } {
  const inner = RING_BOUNDS[1].inner;
  const a = inner * STRETCH_X;
  const b = inner * STRETCH_Y;
  const scale = padding / Math.SQRT2;
  const w = 2 * a * scale;
  const h = 2 * b * scale;
  return {
    x: CX - w / 2,
    y: CY - h / 2,
    w,
    h,
  };
}

export { CX, CY, STRETCH_X, STRETCH_Y, RING_BOUNDS };
