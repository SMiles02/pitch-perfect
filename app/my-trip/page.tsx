"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useTripContext } from "@/lib/trip-context";
import { getMatch, getStadium, type Match } from "@/lib/data";
import { ORIGIN_CITIES } from "@/lib/travel";
import {
  getTripCostBreakdown,
  getTripStats,
  getTripMatchesSorted,
  optimizeTripOrder,
} from "@/lib/trip-utils";
import { formatParticipant, getBracketSlot } from "@/lib/tournament";
import TeamName from "@/components/TeamName";

const TripMapView = dynamic(() => import("@/components/TripMapView"), {
  ssr: false,
});

function MatchLabel({ match }: { match: Match }) {
  const bracketSlot = getBracketSlot(match.id);
  const home = bracketSlot ? formatParticipant(bracketSlot.home) : match.home;
  const away = bracketSlot ? formatParticipant(bracketSlot.away) : match.away;
  return (
    <>
      <TeamName name={match.home} label={home} /> vs <TeamName name={match.away} label={away} />
    </>
  );
}

export default function MyTripPage() {
  const { tripMatchIds, removeMatch, originCityId, setOriginCityId, clearTrip } =
    useTripContext();
  const [optimized, setOptimized] = useState(false);

  const origin = ORIGIN_CITIES.find((c) => c.id === originCityId) ?? ORIGIN_CITIES[0];

  const orderedIds = useMemo(() => {
    if (optimized) return optimizeTripOrder(originCityId, tripMatchIds);
    return getTripMatchesSorted(tripMatchIds).map((m) => m.id);
  }, [tripMatchIds, originCityId, optimized]);

  const tripMatches = useMemo(
    () =>
      orderedIds
        .map((id) => getMatch(id))
        .filter((m): m is Match => m !== undefined),
    [orderedIds],
  );

  const stats = useMemo(
    () => getTripStats(tripMatchIds),
    [tripMatchIds],
  );

  const cost = useMemo(
    () => getTripCostBreakdown(originCityId, orderedIds),
    [originCityId, orderedIds],
  );

  const mapStops = useMemo(() => {
    const seen = new Map<string, { label: string; coordinates: [number, number]; matchCount: number }>();
    for (const m of tripMatches) {
      const stadium = getStadium(m.stadiumId);
      if (!stadium) continue;
      const key = m.city;
      const existing = seen.get(key);
      if (existing) {
        existing.matchCount++;
      } else {
        seen.set(key, {
          label: m.city,
          coordinates: stadium.coordinates,
          matchCount: 1,
        });
      }
    }
    // Maintain order of first appearance
    const result: { label: string; coordinates: [number, number]; matchCount: number }[] = [];
    const addedCities = new Set<string>();
    for (const m of tripMatches) {
      if (!addedCities.has(m.city)) {
        const entry = seen.get(m.city);
        if (entry) result.push(entry);
        addedCities.add(m.city);
      }
    }
    return result;
  }, [tripMatches]);

  if (tripMatchIds.length === 0) {
    return (
      <div className="min-h-screen px-4 pb-16 pt-28">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="mb-2 text-sm uppercase tracking-[0.22em] text-emerald-300/80">
              My Trip
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Plan your World Cup journey
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 rounded-2xl border border-dashed border-slate-500/20 py-20 text-center"
          >
            <svg
              className="mx-auto mb-4 h-12 w-12 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
            <p className="mb-2 text-lg font-medium text-slate-300">
              Your trip is empty
            </p>
            <p className="mb-6 text-sm text-slate-500">
              Browse matches and tap the + button to build your itinerary
            </p>
            <Link
              href="/#matches"
              className="inline-block rounded-full bg-emerald-400 px-8 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.03] hover:bg-emerald-300"
            >
              Browse Matches
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="mb-2 text-sm uppercase tracking-[0.22em] text-emerald-300/80">
            My Trip
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Your World Cup Journey
            </h1>
            <button
              type="button"
              onClick={clearTrip}
              className="shrink-0 text-xs text-slate-500 transition-colors hover:text-red-400"
            >
              Clear trip
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: "Matches", value: stats.matchCount },
            { label: "Cities", value: stats.cityCount },
            { label: "Dates", value: stats.dateSpan },
            {
              label: "Est. Total",
              value: `${cost.currency}${cost.total.toLocaleString()}`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-500/15 bg-slate-950/45 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-300">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Origin + Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <label className="flex items-center gap-3 text-sm text-slate-400">
            Departing from
            <select
              value={originCityId}
              onChange={(e) => setOriginCityId(e.target.value)}
              className="rounded-xl border border-slate-500/20 bg-slate-950/55 px-4 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-emerald-300/40"
            >
              {ORIGIN_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.airport})
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setOptimized((prev) => !prev)}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              optimized
                ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                : "border-slate-500/20 bg-slate-950/45 text-slate-400 hover:border-emerald-300/25 hover:text-emerald-200"
            }`}
          >
            <svg
              className="mr-1.5 inline h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
            {optimized ? "Optimized route" : "Optimize route"}
          </button>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 h-[400px] lg:h-[480px]"
        >
          <TripMapView
            key={`${originCityId}-${orderedIds.join("-")}`}
            originCoords={origin.coordinates}
            originLabel={origin.name}
            stops={mapStops}
            className="h-full"
          />
        </motion.div>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="mb-6 text-xl font-semibold">Itinerary</h2>
          <div className="space-y-3">
            {/* Departure leg */}
            {cost.legs.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 text-xs text-slate-500">
                <svg className="h-4 w-4 shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                <span>
                  {cost.legs[0].fromLabel} → {cost.legs[0].toLabel}
                  {cost.legs[0].flightPrice > 0 && (
                    <span className="ml-2 text-slate-400">
                      ~{cost.currency}{cost.legs[0].flightPrice} · {cost.legs[0].duration}
                    </span>
                  )}
                </span>
              </div>
            )}

            <AnimatePresence>
              {tripMatches.map((match, i) => {
                const date = new Date(match.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
                const leg = cost.legs[i + 1];

                return (
                  <motion.div key={match.id} layout exit={{ opacity: 0, x: -20 }}>
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-500/15 bg-slate-950/55 p-5 transition-colors hover:border-slate-500/25">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-sm font-bold text-emerald-300">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-semibold">
                              <MatchLabel match={match} />
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {match.stadium} · {match.city}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {date} at {match.time} · {match.group}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/match/${match.id}`}
                            className="hidden rounded-lg border border-slate-500/20 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200 sm:block"
                          >
                            Details
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeMatch(match.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-500/20 text-slate-500 transition-colors hover:border-red-400/30 hover:text-red-400"
                            title="Remove from trip"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Travel connector to next match */}
                    {leg && i < tripMatches.length - 1 && (
                      <div className="flex items-center gap-3 px-4 py-2 text-xs text-slate-500">
                        <svg className="h-4 w-4 shrink-0 text-emerald-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                        </svg>
                        {leg.flightPrice > 0 ? (
                          <span>
                            → {leg.toLabel} · ~{cost.currency}{leg.flightPrice} · {leg.duration}
                          </span>
                        ) : (
                          <span>Same city</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Return leg */}
            {cost.legs.length > 1 && (
              <div className="flex items-center gap-3 px-4 py-2 text-xs text-slate-500">
                <svg className="h-4 w-4 shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                <span>
                  {cost.legs[cost.legs.length - 1].fromLabel} → {cost.legs[cost.legs.length - 1].toLabel}
                  {cost.legs[cost.legs.length - 1].flightPrice > 0 && (
                    <span className="ml-2 text-slate-400">
                      ~{cost.currency}{cost.legs[cost.legs.length - 1].flightPrice} · {cost.legs[cost.legs.length - 1].duration}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cost Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-500/15 bg-slate-950/55 p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Cost Breakdown</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span>Flights ({cost.legs.length} legs)</span>
              <span className="font-medium text-slate-200">
                {cost.currency}{cost.totalFlights.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Hotels (~{cost.hotelNights} nights)</span>
              <span className="font-medium text-slate-200">
                {cost.currency}{cost.totalHotels.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-slate-500/15 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-xl font-bold text-emerald-300">
                  {cost.currency}{cost.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            Estimates based on sample pricing. Actual costs may vary.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
