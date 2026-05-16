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

const CX = 100;
const CY = 70;

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
  1: { inner: 38, outer: 52 },
  2: { inner: 52, outer: 64 },
  3: { inner: 64, outer: 76 },
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG wedge path for one section (top-down oval bowl). */
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
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `L ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export interface PlacedSection extends MetlifeSectionDef {
  path: string;
  labelX: number;
  labelY: number;
  midAngle: number;
}

/** Assign angular wedges per ring, sorted clockwise by section number. */
export function placeMetlifeSections(): PlacedSection[] {
  const byRing: Record<1 | 2 | 3, MetlifeSectionDef[]> = { 1: [], 2: [], 3: [] };

  for (const s of metlifeLayout.sections) {
    byRing[sectionRing(s.id)].push(s);
  }

  for (const ring of [1, 2, 3] as const) {
    byRing[ring].sort((a, b) => sectionSortKey(a.id) - sectionSortKey(b.id));
  }

  const placed: PlacedSection[] = [];
  const gap = 0.35;

  for (const ring of [1, 2, 3] as const) {
    const list = byRing[ring];
    const { inner, outer } = RING_BOUNDS[ring];
    const slice = (360 - list.length * gap) / Math.max(list.length, 1);
    let angle = -90;

    for (const s of list) {
      const start = angle + gap / 2;
      const end = angle + slice + gap / 2;
      const mid = (start + end) / 2;
      const labelR = (inner + outer) / 2;
      const label = polar(CX, CY, labelR, mid);

      placed.push({
        ...s,
        path: wedgePath(start, end, inner, outer),
        labelX: label.x,
        labelY: label.y,
        midAngle: mid,
      });

      angle += slice + gap;
    }
  }

  return placed;
}

export function getMetlifeSection(id: string): MetlifeSectionDef | undefined {
  return metlifeLayout.sections.find((s) => s.id === id);
}
