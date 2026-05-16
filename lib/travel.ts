export interface Flight {
  id: string;
  airline: string;
  bookingUrl: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  stops: number;
}

export interface Hotel {
  id: string;
  name: string;
  distance: string;
  rating: number;
  price: string;
  coordinates: [number, number];
}

export interface TransportRoute {
  mode: string;
  duration: string;
  description: string;
  color: string;
}

export interface OriginCity {
  id: string;
  name: string;
  airport: string;
  coordinates: [number, number];
}

export const ORIGIN_CITIES: OriginCity[] = [
  { id: "cork", name: "Cork", airport: "ORK", coordinates: [-8.4911, 51.8498] },
  { id: "dublin", name: "Dublin", airport: "DUB", coordinates: [-6.2603, 53.3498] },
  { id: "london", name: "London", airport: "LHR", coordinates: [-0.4543, 51.47] },
  { id: "paris", name: "Paris", airport: "CDG", coordinates: [2.5478, 49.0097] },
  { id: "madrid", name: "Madrid", airport: "MAD", coordinates: [-3.5676, 40.4719] },
  { id: "berlin", name: "Berlin", airport: "BER", coordinates: [13.5003, 52.3667] },
  { id: "toronto", name: "Toronto", airport: "YYZ", coordinates: [-79.6306, 43.6777] },
  { id: "new-york", name: "New York", airport: "JFK", coordinates: [-73.7781, 40.6413] },
  { id: "los-angeles", name: "Los Angeles", airport: "LAX", coordinates: [-118.4085, 33.9416] },
  { id: "mexico-city", name: "Mexico City", airport: "MEX", coordinates: [-99.0721, 19.4363] },
];

export const DEFAULT_ORIGIN_CITY_ID = "dublin";

const STADIUM_AIRPORT: Record<string, string> = {
  akron: "GDL",
  arrowhead: "MCI",
  att: "DFW",
  azteca: "MEX",
  bbva: "MTY",
  "bc-place": "YVR",
  "bmo-field": "YYZ",
  gillette: "BOS",
  "hard-rock": "MIA",
  levis: "SJC",
  "lincoln-financial": "PHL",
  lumen: "SEA",
  "mercedes-benz": "ATL",
  metlife: "JFK",
  nrg: "IAH",
  sofi: "LAX",
};

type DestRegion = "us-east" | "us-central" | "us-south" | "us-west" | "mexico" | "canada";

const STADIUM_REGION: Record<string, DestRegion> = {
  akron: "mexico",
  arrowhead: "us-central",
  att: "us-central",
  azteca: "mexico",
  bbva: "mexico",
  "bc-place": "canada",
  "bmo-field": "canada",
  gillette: "us-east",
  "hard-rock": "us-south",
  levis: "us-west",
  "lincoln-financial": "us-east",
  lumen: "us-west",
  "mercedes-benz": "us-south",
  metlife: "us-east",
  nrg: "us-south",
  sofi: "us-west",
};

type OriginRegion = "europe" | "canada" | "us-east" | "us-west" | "mexico";

const ORIGIN_REGION: Record<string, OriginRegion> = {
  cork: "europe",
  dublin: "europe",
  london: "europe",
  paris: "europe",
  madrid: "europe",
  berlin: "europe",
  toronto: "canada",
  "new-york": "us-east",
  "los-angeles": "us-west",
  "mexico-city": "mexico",
};

interface FlightLeg {
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
}

const ROUTE_LEGS: Record<OriginRegion, Record<DestRegion, [FlightLeg, FlightLeg]>> = {
  europe: {
    "us-east": [
      { airline: "Aer Lingus", departure: "08:30", arrival: "11:45", duration: "7h 15m", price: 489, stops: 0 },
      { airline: "United", departure: "14:00", arrival: "17:30", duration: "8h 30m", price: 520, stops: 1 },
    ],
    "us-central": [
      { airline: "Lufthansa", departure: "09:15", arrival: "13:40", duration: "9h 25m", price: 545, stops: 1 },
      { airline: "British Airways", departure: "11:00", arrival: "16:20", duration: "10h 20m", price: 575, stops: 1 },
    ],
    "us-south": [
      { airline: "Air France", departure: "10:20", arrival: "15:10", duration: "9h 50m", price: 560, stops: 1 },
      { airline: "Iberia", departure: "13:45", arrival: "19:30", duration: "10h 45m", price: 590, stops: 1 },
    ],
    "us-west": [
      { airline: "British Airways", departure: "07:45", arrival: "12:20", duration: "11h 35m", price: 612, stops: 0 },
      { airline: "United", departure: "15:30", arrival: "21:15", duration: "12h 45m", price: 580, stops: 1 },
    ],
    mexico: [
      { airline: "Iberia", departure: "09:00", arrival: "14:25", duration: "12h 25m", price: 640, stops: 1 },
      { airline: "Air France", departure: "16:10", arrival: "22:40", duration: "13h 30m", price: 670, stops: 1 },
    ],
    canada: [
      { airline: "Air Canada", departure: "08:00", arrival: "11:35", duration: "8h 35m", price: 505, stops: 0 },
      { airline: "Lufthansa", departure: "12:30", arrival: "17:05", duration: "9h 35m", price: 535, stops: 1 },
    ],
  },
  canada: {
    "us-east": [
      { airline: "Air Canada", departure: "07:20", arrival: "09:05", duration: "1h 45m", price: 210, stops: 0 },
      { airline: "Porter", departure: "14:50", arrival: "16:45", duration: "1h 55m", price: 185, stops: 0 },
    ],
    "us-central": [
      { airline: "Air Canada", departure: "08:40", arrival: "10:55", duration: "3h 15m", price: 265, stops: 0 },
      { airline: "WestJet", departure: "11:15", arrival: "14:00", duration: "3h 45m", price: 240, stops: 0 },
    ],
    "us-south": [
      { airline: "Air Canada", departure: "09:30", arrival: "12:50", duration: "3h 20m", price: 280, stops: 0 },
      { airline: "WestJet", departure: "16:00", arrival: "19:40", duration: "3h 40m", price: 255, stops: 0 },
    ],
    "us-west": [
      { airline: "Air Canada", departure: "06:45", arrival: "09:30", duration: "5h 45m", price: 320, stops: 0 },
      { airline: "WestJet", departure: "13:20", arrival: "16:35", duration: "6h 15m", price: 295, stops: 0 },
    ],
    mexico: [
      { airline: "Air Canada", departure: "08:15", arrival: "14:40", duration: "6h 25m", price: 410, stops: 1 },
      { airline: "WestJet", departure: "12:00", arrival: "18:50", duration: "7h 50m", price: 385, stops: 1 },
    ],
    canada: [
      { airline: "Air Canada", departure: "09:00", arrival: "11:20", duration: "2h 20m", price: 195, stops: 0 },
      { airline: "WestJet", departure: "17:30", arrival: "19:55", duration: "2h 25m", price: 175, stops: 0 },
    ],
  },
  "us-east": {
    "us-east": [
      { airline: "Delta", departure: "07:00", arrival: "08:25", duration: "1h 25m", price: 145, stops: 0 },
      { airline: "JetBlue", departure: "15:40", arrival: "17:10", duration: "1h 30m", price: 128, stops: 0 },
    ],
    "us-central": [
      { airline: "United", departure: "08:30", arrival: "10:45", duration: "3h 15m", price: 220, stops: 0 },
      { airline: "American", departure: "13:15", arrival: "16:00", duration: "3h 45m", price: 198, stops: 0 },
    ],
    "us-south": [
      { airline: "Delta", departure: "09:20", arrival: "12:05", duration: "2h 45m", price: 205, stops: 0 },
      { airline: "Spirit", departure: "18:00", arrival: "21:10", duration: "3h 10m", price: 165, stops: 0 },
    ],
    "us-west": [
      { airline: "United", departure: "07:15", arrival: "10:40", duration: "6h 25m", price: 340, stops: 0 },
      { airline: "American", departure: "14:30", arrival: "18:20", duration: "6h 50m", price: 315, stops: 0 },
    ],
    mexico: [
      { airline: "JetBlue", departure: "08:45", arrival: "13:30", duration: "4h 45m", price: 385, stops: 0 },
      { airline: "United", departure: "11:20", arrival: "16:55", duration: "5h 35m", price: 360, stops: 1 },
    ],
    canada: [
      { airline: "Air Canada", departure: "10:00", arrival: "12:15", duration: "1h 15m", price: 190, stops: 0 },
      { airline: "Porter", departure: "16:45", arrival: "18:50", duration: "1h 05m", price: 175, stops: 0 },
    ],
  },
  "us-west": {
    "us-east": [
      { airline: "United", departure: "06:30", arrival: "14:55", duration: "5h 25m", price: 355, stops: 0 },
      { airline: "Delta", departure: "09:45", arrival: "18:30", duration: "5h 45m", price: 330, stops: 0 },
    ],
    "us-central": [
      { airline: "Southwest", departure: "08:00", arrival: "12:40", duration: "3h 40m", price: 245, stops: 0 },
      { airline: "United", departure: "14:15", arrival: "19:05", duration: "3h 50m", price: 228, stops: 0 },
    ],
    "us-south": [
      { airline: "American", departure: "07:50", arrival: "13:20", duration: "4h 30m", price: 275, stops: 0 },
      { airline: "Delta", departure: "12:30", arrival: "18:15", duration: "4h 45m", price: 260, stops: 0 },
    ],
    "us-west": [
      { airline: "Alaska", departure: "08:20", arrival: "09:35", duration: "1h 15m", price: 120, stops: 0 },
      { airline: "Southwest", departure: "17:00", arrival: "18:20", duration: "1h 20m", price: 109, stops: 0 },
    ],
    mexico: [
      { airline: "Alaska", departure: "09:40", arrival: "15:25", duration: "3h 45m", price: 295, stops: 0 },
      { airline: "United", departure: "13:55", arrival: "20:10", duration: "4h 15m", price: 310, stops: 0 },
    ],
    canada: [
      { airline: "Air Canada", departure: "07:30", arrival: "13:45", duration: "5h 15m", price: 305, stops: 0 },
      { airline: "WestJet", departure: "11:10", arrival: "17:30", duration: "5h 20m", price: 288, stops: 0 },
    ],
  },
  mexico: {
    "us-east": [
      { airline: "Aeroméxico", departure: "07:15", arrival: "12:40", duration: "4h 25m", price: 365, stops: 0 },
      { airline: "Volaris", departure: "14:20", arrival: "20:15", duration: "5h 55m", price: 290, stops: 1 },
    ],
    "us-central": [
      { airline: "Aeroméxico", departure: "08:50", arrival: "12:30", duration: "2h 40m", price: 195, stops: 0 },
      { airline: "Volaris", departure: "16:00", arrival: "19:55", duration: "2h 55m", price: 165, stops: 0 },
    ],
    "us-south": [
      { airline: "Aeroméxico", departure: "09:30", arrival: "12:15", duration: "2h 45m", price: 210, stops: 0 },
      { airline: "Volaris", departure: "18:45", arrival: "21:40", duration: "2h 55m", price: 178, stops: 0 },
    ],
    "us-west": [
      { airline: "Aeroméxico", departure: "06:40", arrival: "09:55", duration: "3h 15m", price: 240, stops: 0 },
      { airline: "Volaris", departure: "12:25", arrival: "16:10", duration: "3h 45m", price: 205, stops: 0 },
    ],
    mexico: [
      { airline: "Aeroméxico", departure: "08:00", arrival: "09:35", duration: "1h 35m", price: 135, stops: 0 },
      { airline: "Volaris", departure: "17:20", arrival: "19:00", duration: "1h 40m", price: 98, stops: 0 },
    ],
    canada: [
      { airline: "Aeroméxico", departure: "07:55", arrival: "15:30", duration: "6h 35m", price: 420, stops: 1 },
      { airline: "Air Canada", departure: "11:40", arrival: "19:25", duration: "7h 45m", price: 445, stops: 1 },
    ],
  },
};

const LOCAL_FLIGHTS: [FlightLeg, FlightLeg] = [
  { airline: "Regional Express", departure: "09:00", arrival: "10:15", duration: "1h 15m", price: 95, stops: 0 },
  { airline: "Shuttle Air", departure: "16:30", arrival: "17:40", duration: "1h 10m", price: 88, stops: 0 },
];

function formatPrice(amount: number, originRegion: OriginRegion): string {
  if (originRegion === "europe") return `€${amount}`;
  if (originRegion === "mexico") return `$${amount} MXN`;
  return `$${amount}`;
}

function getMatchDemandMultiplier(matchDate: string): number {
  const date = new Date(`${matchDate}T00:00:00Z`);
  const tournamentStart = new Date("2026-06-11T00:00:00Z");
  const daysFromStart = Math.floor(
    (date.getTime() - tournamentStart.getTime()) / (1000 * 60 * 60 * 24),
  );
  const dayOfWeek = date.getUTCDay();
  const isWeekendMatch = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

  let multiplier = 1;

  if (daysFromStart <= 2) multiplier += 0.15;
  else if (daysFromStart >= 31) multiplier += 0.45;
  else if (daysFromStart >= 24) multiplier += 0.3;
  else if (daysFromStart >= 18) multiplier += 0.2;
  else if (daysFromStart >= 11) multiplier += 0.1;

  if (isWeekendMatch) multiplier += 0.08;

  return multiplier;
}

function getStadiumDemandMultiplier(stadiumId: string): number {
  const marqueeStadiums = new Set(["azteca", "att", "metlife", "sofi"]);

  return marqueeStadiums.has(stadiumId) ? 1.08 : 1;
}

function estimateFlightPriceAmount(leg: FlightLeg, stadiumId: string, matchDate: string): number {
  const directFlightMultiplier = leg.stops === 0 ? 1.06 : 0.96;
  const estimatedPrice = leg.price
    * directFlightMultiplier
    * getMatchDemandMultiplier(matchDate)
    * getStadiumDemandMultiplier(stadiumId);

  return Math.round(estimatedPrice / 5) * 5;
}

function estimateFlightPrice(leg: FlightLeg, originRegion: OriginRegion, stadiumId: string, matchDate: string): string {
  return formatPrice(estimateFlightPriceAmount(leg, stadiumId, matchDate), originRegion);
}

function formatFlightSearchDate(matchDate: string, dayOffset: number): string {
  const date = new Date(`${matchDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + dayOffset);

  return date.toISOString().slice(0, 10);
}

function buildFlightSearchUrl(originAirport: string, destinationAirport: string, matchDate: string): string {
  const outboundDate = formatFlightSearchDate(matchDate, -1);
  const returnDate = formatFlightSearchDate(matchDate, 1);
  const query = `flights ${originAirport} to ${destinationAirport} ${outboundDate} returning ${returnDate}`;

  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
}

export function getOriginCity(id: string): OriginCity {
  return ORIGIN_CITIES.find((c) => c.id === id) ?? ORIGIN_CITIES[0];
}

export function getOriginCoordinates(originCityId: string): [number, number] {
  return getOriginCity(originCityId).coordinates;
}

function hotelCoordsNearStadium(stadiumCoords: [number, number]): [number, number][] {
  const [lng, lat] = stadiumCoords;
  return [
    [lng + 0.012, lat + 0.006],
    [lng - 0.01, lat - 0.005],
  ];
}

export function getDestinationAirport(stadiumId: string, city: string): string {
  return STADIUM_AIRPORT[stadiumId] ?? city.slice(0, 3).toUpperCase();
}

export function getFlights(originCityId: string, stadiumId: string, matchDate: string): Flight[] {
  const origin = getOriginCity(originCityId);
  const destAirport = getDestinationAirport(stadiumId, "");
  const destRegion = STADIUM_REGION[stadiumId] ?? "us-central";
  const originRegion = ORIGIN_REGION[origin.id] ?? "europe";
  const buildFlight = (leg: FlightLeg, i: number) => ({
    id: String(i + 1),
    airline: leg.airline,
    bookingUrl: buildFlightSearchUrl(origin.airport, destAirport, matchDate),
    route: `${origin.name} → ${destAirport}`,
    departure: leg.departure,
    arrival: leg.arrival,
    duration: leg.duration,
    price: estimateFlightPrice(leg, originRegion, stadiumId, matchDate),
    stops: leg.stops,
    estimatedPrice: estimateFlightPriceAmount(leg, stadiumId, matchDate),
  });
  const toCheapestFlight = (legs: [FlightLeg, FlightLeg]): Flight[] => {
    const cheapest = legs
      .map(buildFlight)
      .sort((a, b) => a.estimatedPrice - b.estimatedPrice)[0];

    return [{
      id: cheapest.id,
      airline: cheapest.airline,
      bookingUrl: cheapest.bookingUrl,
      route: cheapest.route,
      departure: cheapest.departure,
      arrival: cheapest.arrival,
      duration: cheapest.duration,
      price: cheapest.price,
      stops: cheapest.stops,
    }];
  };

  if (origin.airport === destAirport) {
    return toCheapestFlight(LOCAL_FLIGHTS);
  }

  const legs =
    ROUTE_LEGS[originRegion]?.[destRegion] ?? ROUTE_LEGS.europe["us-central"];

  return toCheapestFlight(legs);
}

export function getTravelData(
  stadiumId: string,
  city: string,
  originCityId: string,
  matchDate: string,
  stadiumCoords: [number, number],
) {
  const isNY = stadiumId === "metlife";
  const isLA = stadiumId === "sofi";
  const hotelCoords = hotelCoordsNearStadium(stadiumCoords);

  return {
    flights: getFlights(originCityId, stadiumId, matchDate),
    hotels: [
      {
        id: "h1",
        name: "Hilton " + city,
        distance: "0.8 km from stadium",
        rating: 4.5,
        price: isNY ? "€189/night" : isLA ? "€210/night" : "$175/night",
        coordinates: hotelCoords[0],
      },
      {
        id: "h2",
        name: "Marriott Downtown",
        distance: "2.1 km from stadium",
        rating: 4.2,
        price: isNY ? "€145/night" : isLA ? "€165/night" : "$140/night",
        coordinates: hotelCoords[1],
      },
    ] as Hotel[],
    transport: [
      {
        mode: "Subway",
        duration: "22 min",
        description: "Direct line to stadium station",
        color: "#00d4aa",
      },
      {
        mode: "Rideshare",
        duration: "14 min",
        description: "Uber/Lyft from hotel district",
        color: "#7c5cff",
      },
    ] as TransportRoute[],
  };
}
