"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import FlightCard from "./FlightCard";
import HotelCard from "./HotelCard";
import {
  getTravelData,
  ORIGIN_CITIES,
} from "@/lib/travel";
import type { Match } from "@/lib/data";
import { useTripContext } from "@/lib/trip-context";

const StadiumMapView = dynamic(() => import("./StadiumMapView"), { ssr: false });

interface TravelPanelProps {
  match: Match;
  stadiumCoords: [number, number];
}

export default function TravelPanel({ match, stadiumCoords }: TravelPanelProps) {
  const { originCityId, setOriginCityId } = useTripContext();

  const travel = getTravelData(match.stadiumId, match.city, originCityId, match.date, stadiumCoords);
  const hotelCoords = travel.hotels.map((h) => h.coordinates);
  const originCity = ORIGIN_CITIES.find((c) => c.id === originCityId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <label className="block text-sm font-medium text-slate-400">
        Departing from
        <select
          value={originCityId}
          onChange={(e) => setOriginCityId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-500/20 bg-slate-950/55 px-4 py-3 text-sm text-slate-200 outline-none transition-colors focus:border-emerald-300/40 focus:ring-1 focus:ring-emerald-300/20 sm:max-w-xs"
        >
          {ORIGIN_CITIES.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name} ({city.airport})
            </option>
          ))}
        </select>
      </label>
      {originCity && (
        <p className="mt-2 text-xs text-slate-500">
          Showing sample flights to {match.city} from {originCity.name}
        </p>
      )}
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-8 lg:grid-cols-2"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-[320px] lg:h-[480px] lg:min-h-0"
      >
        <StadiumMapView
          key={originCityId}
          originCoords={originCity?.coordinates ?? ORIGIN_CITIES[0].coordinates}
          originLabel={originCity?.name ?? "Origin"}
          stadiumCoords={stadiumCoords}
          hotelCoords={hotelCoords}
          className="h-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Flights
          </h3>
          <motion.div layout className="space-y-3">
            {travel.flights.map((f, i) => (
              <FlightCard key={`${originCityId}-${f.id}`} flight={f} index={i} />
            ))}
          </motion.div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Hotels
          </h3>
          <motion.div layout className="space-y-3">
            {travel.hotels.map((h, i) => (
              <HotelCard key={h.id} hotel={h} index={i} />
            ))}
          </motion.div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Transport to stadium
          </h3>
          <motion.div className="grid gap-3 sm:grid-cols-2">
            {travel.transport.map((t) => (
              <motion.div
                key={t.mode}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-slate-500/15 bg-slate-950/45 p-4"
                style={{ borderLeft: `3px solid ${t.color}` }}
              >
                <p className="font-semibold text-white">{t.mode}</p>
                <p className="text-2xl font-semibold text-emerald-300">{t.duration}</p>
                <p className="text-xs text-slate-500">{t.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </motion.div>
    </motion.div>
    </motion.div>
  );
}
