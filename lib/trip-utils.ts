import { matches as allMatches, getMatch, getStadium, type Match } from "@/lib/data";
import {
  STADIUM_REGION,
  ORIGIN_REGION,
  ROUTE_LEGS,
  LOCAL_FLIGHTS,
  ORIGIN_CITIES,
  estimateFlightPriceAmount,
  type OriginRegion,
  type FlightLeg,
} from "@/lib/travel";

export function getAllTeams(): string[] {
  const teams = new Set<string>();
  for (const m of allMatches) {
    if (m.group.startsWith("Group ")) {
      teams.add(m.home);
      teams.add(m.away);
    }
  }
  return [...teams].sort();
}

const DEST_TO_ORIGIN: Record<string, OriginRegion> = {
  "us-east": "us-east",
  "us-central": "us-east",
  "us-south": "us-east",
  "us-west": "us-west",
  mexico: "mexico",
  canada: "canada",
};

function getCheapestLegPrice(
  legs: [FlightLeg, FlightLeg],
  stadiumId: string,
  date: string,
): number {
  return Math.min(
    estimateFlightPriceAmount(legs[0], stadiumId, date),
    estimateFlightPriceAmount(legs[1], stadiumId, date),
  );
}

function getCheapestLegDuration(legs: [FlightLeg, FlightLeg]): string {
  const cheaper = legs[0].price <= legs[1].price ? legs[0] : legs[1];
  return cheaper.duration;
}

export function getInterCityFlightEstimate(
  fromStadiumId: string,
  toStadiumId: string,
  travelDate: string,
): { price: number; duration: string } {
  const fromRegion = STADIUM_REGION[fromStadiumId];
  const toRegion = STADIUM_REGION[toStadiumId];

  if (fromRegion === toRegion) {
    return {
      price: getCheapestLegPrice(LOCAL_FLIGHTS, toStadiumId, travelDate),
      duration: getCheapestLegDuration(LOCAL_FLIGHTS),
    };
  }

  const originRegion = DEST_TO_ORIGIN[fromRegion] ?? "us-east";
  const legs = ROUTE_LEGS[originRegion]?.[toRegion] ?? ROUTE_LEGS["us-east"]["us-central"];

  return {
    price: getCheapestLegPrice(legs, toStadiumId, travelDate),
    duration: getCheapestLegDuration(legs),
  };
}

export interface TripLeg {
  fromLabel: string;
  toLabel: string;
  flightPrice: number;
  duration: string;
  matchId?: number;
}

export interface TripCostBreakdown {
  legs: TripLeg[];
  totalFlights: number;
  totalHotels: number;
  hotelNights: number;
  total: number;
  currency: string;
}

export function getTripCostBreakdown(
  originCityId: string,
  matchIds: number[],
): TripCostBreakdown {
  if (matchIds.length === 0) {
    return { legs: [], totalFlights: 0, totalHotels: 0, hotelNights: 0, total: 0, currency: "$" };
  }

  const origin = ORIGIN_CITIES.find((c) => c.id === originCityId) ?? ORIGIN_CITIES[0];
  const originRegion = ORIGIN_REGION[origin.id] ?? "europe";
  const currency = originRegion === "europe" ? "€" : "$";

  const tripMatches = matchIds
    .map((id) => getMatch(id))
    .filter((m): m is Match => m !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  if (tripMatches.length === 0) {
    return { legs: [], totalFlights: 0, totalHotels: 0, hotelNights: 0, total: 0, currency };
  }

  const legs: TripLeg[] = [];
  let totalFlights = 0;

  // Origin → first match
  const firstMatch = tripMatches[0];
  const firstRegion = STADIUM_REGION[firstMatch.stadiumId] ?? "us-central";
  const firstLegs = ROUTE_LEGS[originRegion]?.[firstRegion] ?? ROUTE_LEGS["us-east"]["us-central"];
  const firstPrice = getCheapestLegPrice(firstLegs, firstMatch.stadiumId, firstMatch.date);
  legs.push({
    fromLabel: origin.name,
    toLabel: firstMatch.city,
    flightPrice: firstPrice,
    duration: getCheapestLegDuration(firstLegs),
  });
  totalFlights += firstPrice;

  // Match-to-match legs
  for (let i = 1; i < tripMatches.length; i++) {
    const prev = tripMatches[i - 1];
    const curr = tripMatches[i];
    if (prev.stadiumId === curr.stadiumId) {
      legs.push({
        fromLabel: prev.city,
        toLabel: curr.city,
        flightPrice: 0,
        duration: "Same city",
        matchId: curr.id,
      });
    } else {
      const est = getInterCityFlightEstimate(prev.stadiumId, curr.stadiumId, curr.date);
      legs.push({
        fromLabel: prev.city,
        toLabel: curr.city,
        flightPrice: est.price,
        duration: est.duration,
        matchId: curr.id,
      });
      totalFlights += est.price;
    }
  }

  // Last match → origin
  const lastMatch = tripMatches[tripMatches.length - 1];
  const lastRegion = STADIUM_REGION[lastMatch.stadiumId] ?? "us-central";
  const returnLegs = ROUTE_LEGS[originRegion]?.[lastRegion] ?? ROUTE_LEGS["us-east"]["us-central"];
  const returnPrice = getCheapestLegPrice(returnLegs, lastMatch.stadiumId, lastMatch.date);
  legs.push({
    fromLabel: lastMatch.city,
    toLabel: origin.name,
    flightPrice: returnPrice,
    duration: getCheapestLegDuration(returnLegs),
  });
  totalFlights += returnPrice;

  // Hotel estimate
  const firstDate = new Date(tripMatches[0].date);
  const lastDate = new Date(tripMatches[tripMatches.length - 1].date);
  const hotelNights = Math.max(
    1,
    Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );
  const hotelPerNight = 150;
  const totalHotels = hotelNights * hotelPerNight;

  return {
    legs,
    totalFlights,
    totalHotels,
    hotelNights,
    total: totalFlights + totalHotels,
    currency,
  };
}

function haversineDistance(
  coords1: [number, number],
  coords2: [number, number],
): number {
  const R = 6371;
  const dLat = ((coords2[1] - coords1[1]) * Math.PI) / 180;
  const dLon = ((coords2[0] - coords1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coords1[1] * Math.PI) / 180) *
      Math.cos((coords2[1] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function optimizeTripOrder(
  originCityId: string,
  matchIds: number[],
): number[] {
  if (matchIds.length <= 2) return matchIds;

  const origin = ORIGIN_CITIES.find((c) => c.id === originCityId) ?? ORIGIN_CITIES[0];
  const matchData = matchIds
    .map((id) => {
      const m = getMatch(id);
      const s = m ? getStadium(m.stadiumId) : undefined;
      return m && s ? { id, match: m, coords: s.coordinates } : null;
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);

  // Sort by date first as a baseline
  matchData.sort((a, b) => a.match.date.localeCompare(b.match.date) || a.match.time.localeCompare(b.match.time));

  // Group by date — only reorder within same-day clusters
  const result: number[] = [];
  let i = 0;

  while (i < matchData.length) {
    const dayStart = i;
    const currentDate = matchData[i].match.date;
    while (i < matchData.length && matchData[i].match.date === currentDate) {
      i++;
    }

    if (i - dayStart === 1) {
      result.push(matchData[dayStart].id);
      continue;
    }

    // For same-day matches, order by nearest neighbor from previous position
    const prevCoords =
      result.length > 0
        ? matchData.find((d) => d.id === result[result.length - 1])?.coords ?? origin.coordinates
        : origin.coordinates;

    const cluster = matchData.slice(dayStart, i);
    const ordered: typeof cluster = [];
    let current = prevCoords;

    while (cluster.length > 0) {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      for (let j = 0; j < cluster.length; j++) {
        const dist = haversineDistance(current, cluster[j].coords);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = j;
        }
      }
      ordered.push(cluster[nearestIdx]);
      current = cluster[nearestIdx].coords;
      cluster.splice(nearestIdx, 1);
    }

    for (const entry of ordered) {
      result.push(entry.id);
    }
  }

  return result;
}

export function getTripMatchesSorted(matchIds: number[]): Match[] {
  return matchIds
    .map((id) => getMatch(id))
    .filter((m): m is Match => m !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

export function getTripStats(matchIds: number[]) {
  const tripMatches = getTripMatchesSorted(matchIds);
  if (tripMatches.length === 0) {
    return { matchCount: 0, cityCount: 0, dateSpan: "", cities: [] as string[] };
  }

  const cities = [...new Set(tripMatches.map((m) => m.city))];
  const firstDate = new Date(tripMatches[0].date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const lastDate = new Date(tripMatches[tripMatches.length - 1].date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const dateSpan = tripMatches.length === 1 ? firstDate : `${firstDate} - ${lastDate}`;

  return {
    matchCount: tripMatches.length,
    cityCount: cities.length,
    dateSpan,
    cities,
  };
}
