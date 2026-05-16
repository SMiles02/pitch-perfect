import matchesData from "@/data/matches.json";
import stadiumsData from "@/data/stadiums.json";
import seatviewsData from "@/data/seatviews.json";

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

export const matches = matchesData as Match[];
export const stadiums = stadiumsData as Stadium[];
export const seatviews = seatviewsData as Record<string, Record<string, SeatView>>;

export function getMatch(id: number): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function getStadium(id: string): Stadium | undefined {
  return stadiums.find((s) => s.id === id);
}

export function getSeatView(stadiumId: string, sectionId: string): SeatView | undefined {
  return seatviews[stadiumId]?.[sectionId];
}
