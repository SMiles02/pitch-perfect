export interface Flight {
  id: string;
  airline: string;
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

export function getTravelData(stadiumId: string, city: string) {
  const isNY = stadiumId === "metlife";
  return {
    flights: [
      {
        id: "1",
        airline: "Aer Lingus",
        route: isNY ? "Dublin → JFK" : "London → LAX",
        departure: "08:30",
        arrival: isNY ? "11:45" : "12:20",
        duration: isNY ? "7h 15m" : "11h 50m",
        price: isNY ? "€489" : "€612",
        stops: 0,
      },
      {
        id: "2",
        airline: "United",
        route: isNY ? "Paris → Newark" : "Madrid → LAX",
        departure: "14:00",
        arrival: isNY ? "17:30" : "18:45",
        duration: isNY ? "8h 30m" : "12h 45m",
        price: isNY ? "€520" : "€580",
        stops: 1,
      },
    ] as Flight[],
    hotels: [
      {
        id: "h1",
        name: "Hilton " + city,
        distance: "0.8 km from stadium",
        rating: 4.5,
        price: isNY ? "€189/night" : "€210/night",
        coordinates: isNY ? [-74.07, 40.815] : [-118.26, 33.955],
      },
      {
        id: "h2",
        name: "Marriott Downtown",
        distance: "2.1 km from stadium",
        rating: 4.2,
        price: isNY ? "€145/night" : "€165/night",
        coordinates: isNY ? [-74.08, 40.81] : [-118.27, 33.95],
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
