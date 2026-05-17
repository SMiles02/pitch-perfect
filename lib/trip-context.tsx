"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_ORIGIN_CITY_ID, ORIGIN_CITIES } from "@/lib/travel";

interface TripContextValue {
  favoriteTeams: string[];
  toggleFavoriteTeam: (team: string) => void;
  isFavoriteTeam: (team: string) => boolean;
  clearFavoriteTeams: () => void;

  tripMatchIds: number[];
  addMatch: (id: number) => void;
  removeMatch: (id: number) => void;
  isInTrip: (id: number) => boolean;
  clearTrip: () => void;

  originCityId: string;
  setOriginCityId: (id: string) => void;
}

const TripContext = createContext<TripContextValue | null>(null);

const KEYS = {
  favoriteTeams: "pitch-perfect-favorite-teams",
  tripMatches: "pitch-perfect-trip-matches",
  originCity: "pitch-perfect-origin-city",
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readString(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [tripMatchIds, setTripMatchIds] = useState<number[]>([]);
  const [originCityId, setOriginCityIdState] = useState(DEFAULT_ORIGIN_CITY_ID);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavoriteTeams(readJson<string[]>(KEYS.favoriteTeams, []));
    setTripMatchIds(readJson<number[]>(KEYS.tripMatches, []));
    const stored = readString(KEYS.originCity, DEFAULT_ORIGIN_CITY_ID);
    if (ORIGIN_CITIES.some((c) => c.id === stored)) {
      setOriginCityIdState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEYS.favoriteTeams, JSON.stringify(favoriteTeams));
  }, [favoriteTeams, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEYS.tripMatches, JSON.stringify(tripMatchIds));
  }, [tripMatchIds, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEYS.originCity, originCityId);
  }, [originCityId, hydrated]);

  const toggleFavoriteTeam = useCallback((team: string) => {
    setFavoriteTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team],
    );
  }, []);

  const isFavoriteTeam = useCallback(
    (team: string) => favoriteTeams.includes(team),
    [favoriteTeams],
  );

  const clearFavoriteTeams = useCallback(() => setFavoriteTeams([]), []);

  const addMatch = useCallback((id: number) => {
    setTripMatchIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeMatch = useCallback((id: number) => {
    setTripMatchIds((prev) => prev.filter((m) => m !== id));
  }, []);

  const isInTrip = useCallback(
    (id: number) => tripMatchIds.includes(id),
    [tripMatchIds],
  );

  const clearTrip = useCallback(() => setTripMatchIds([]), []);

  const setOriginCityId = useCallback((id: string) => {
    if (ORIGIN_CITIES.some((c) => c.id === id)) {
      setOriginCityIdState(id);
    }
  }, []);

  return (
    <TripContext.Provider
      value={{
        favoriteTeams,
        toggleFavoriteTeam,
        isFavoriteTeam,
        clearFavoriteTeams,
        tripMatchIds,
        addMatch,
        removeMatch,
        isInTrip,
        clearTrip,
        originCityId,
        setOriginCityId,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripContext must be used within TripProvider");
  return ctx;
}
