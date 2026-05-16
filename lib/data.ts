import matchesData from "@/data/matches.json";
import stadiumsData from "@/data/stadiums.json";
import seatviewsData from "@/data/seatviews.json";
import { getMetlifeSection, metlifeLayout, type MetlifeCategory } from "@/lib/metlife-layout";

export interface Match {
  id: number;
  home: string;
  away: string;
  stadium: string;
  stadiumId: string;
  city: string;
  date: string;
  time: string;
  group: string;
}

export interface StadiumSection {
  id: string;
  label: string;
  tier: string;
  atmosphere: number;
  visibility: number;
  price: string;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number;
  coordinates: [number, number];
  sections: StadiumSection[];
}

export interface SeatView {
  panorama: string;
  description: string;
  defaultPitch?: number;
  defaultYaw?: number;
}

export interface Seat {
  id: string;
  row: number;
  number: number;
  label: string;
}

/** Panorama asset key per FIFA category (maps to section_*.jpg in seatviews). */
const CATEGORY_PANORAMA: Record<MetlifeCategory, string> = {
  "1": "101",
  "2": "401",
  "3": "301",
  "4": "201",
};

const CATEGORY_PRICES: Record<string, string> = {
  "1": "€280",
  "2": "€220",
  "3": "€180",
  "4": "€150",
};

const CATEGORY_TIERS: Record<string, string> = {
  "1": "Category 1",
  "2": "Category 2",
  "3": "Category 3",
  "4": "Category 4",
};

export const matches = matchesData as Match[];
export const stadiums = stadiumsData as Stadium[];
const seatviewsRaw = seatviewsData as Record<string, Record<string, SeatView>>;

export function getMatch(id: number): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function getStadium(id: string): Stadium | undefined {
  return stadiums.find((s) => s.id === id);
}

export function getSection(stadiumId: string, sectionId: string): StadiumSection | undefined {
  if (stadiumId === "metlife") {
    const meta = getMetlifeSectionMeta(sectionId);
    if (!meta.found) return undefined;
    return {
      id: sectionId,
      label: `Section ${sectionId}`,
      tier: meta.tier,
      atmosphere: meta.category === "1" ? 9 : meta.category === "4" ? 10 : 7,
      visibility: meta.category === "1" ? 10 : meta.category === "4" ? 6 : 8,
      price: meta.price,
    };
  }
  return getStadium(stadiumId)?.sections.find((s) => s.id === sectionId);
}

export function getMetlifeSectionMeta(sectionId: string) {
  const def = getMetlifeSection(sectionId);
  if (!def) {
    return { found: false as const, category: "1" as const, tier: "", price: "", hasPanorama: false };
  }
  const panoramaBase = metlifePanoramaBaseSection(sectionId);
  return {
    found: true as const,
    category: def.category,
    tier: CATEGORY_TIERS[def.category],
    price: CATEGORY_PRICES[def.category],
    hasPanorama: Boolean(seatviewsRaw.metlife?.[panoramaBase]),
    panoramaBase,
  };
}

/** Map any MetLife section to its category's panorama asset. */
function metlifePanoramaBaseSection(sectionId: string): string {
  const def = getMetlifeSection(sectionId);
  if (!def) return CATEGORY_PANORAMA["1"];
  return CATEGORY_PANORAMA[def.category];
}

export function generateSeatsForSection(tier: string): Seat[] {
  const t = tier.toLowerCase();
  const rows =
    t.includes("1") || t.includes("lower") ? 10 : t.includes("4") || t.includes("corner") ? 8 : 9;
  const seatsPerRow = t.includes("1") ? 14 : t.includes("3") || t.includes("upper") ? 16 : 12;
  const seats: Seat[] = [];
  for (let row = 1; row <= rows; row++) {
    for (let num = 1; num <= seatsPerRow; num++) {
      seats.push({
        id: `r${row}-s${num}`,
        row,
        number: num,
        label: `Row ${row}, Seat ${num}`,
      });
    }
  }
  return seats;
}

function seatAngles(sectionId: string, seatId: string, stadiumId: string) {
  const match = /^r(\d+)-s(\d+)$/.exec(seatId);
  if (!match) return { defaultYaw: 0, defaultPitch: -0.15 };

  const row = Number(match[1]);
  const seat = Number(match[2]);
  const base = stadiumId === "metlife" ? seatviewsRaw.metlife?.[metlifePanoramaBaseSection(sectionId)] : undefined;

  const rowT = row / 12;
  const seatT = seat / 14;
  const baseYaw = base?.defaultYaw ?? 0;

  return {
    defaultYaw: baseYaw + (seatT - 0.5) * 0.35,
    defaultPitch: (base?.defaultPitch ?? -0.15) + rowT * 0.06,
  };
}

export function getSeatView(
  stadiumId: string,
  sectionId: string,
  seatId?: string
): SeatView | undefined {
  const baseId =
    stadiumId === "metlife" ? metlifePanoramaBaseSection(sectionId) : sectionId;
  const base = seatviewsRaw[stadiumId]?.[baseId];
  if (!base) return undefined;

  if (!seatId) return base;

  const angles = seatAngles(sectionId, seatId, stadiumId);
  return {
    ...base,
    description: `${base.description} · ${seatId.replace("-", ", ").replace("r", "Row ").replace("s", "Seat ")}`,
    defaultYaw: angles.defaultYaw,
    defaultPitch: angles.defaultPitch,
  };
}

export function hasSeatPanorama(stadiumId: string, sectionId: string): boolean {
  if (stadiumId === "metlife") return getMetlifeSectionMeta(sectionId).hasPanorama;
  return Boolean(seatviewsRaw[stadiumId]?.[sectionId]);
}

export function usesDetailedLayout(stadiumId: string): boolean {
  return stadiumId === "metlife";
}

export function getLayoutCategories(stadiumId: string) {
  if (stadiumId === "metlife") return metlifeLayout.categories;
  return null;
}

/** @deprecated */
export const seatviews = seatviewsRaw;
