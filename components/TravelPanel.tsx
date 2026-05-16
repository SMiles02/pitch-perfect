"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import FlightCard from "./FlightCard";
import HotelCard from "./HotelCard";
import { getTravelData } from "@/lib/travel";
import type { Match } from "@/lib/data";

const StadiumMapView = dynamic(() => import("./StadiumMapView"), { ssr: false });

interface TravelPanelProps {
  match: Match;
  stadiumCoords: [number, number];
}

export default function TravelPanel({ match, stadiumCoords }: TravelPanelProps) {
  const travel = getTravelData(match.stadiumId, match.city);
  const hotelCoords = travel.hotels.map((h) => h.coordinates);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-[320px] lg:h-[480px] lg:min-h-0"
      >
        <StadiumMapView
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
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <span>✈️</span> Flights
          </h3>
          <div className="space-y-3">
            {travel.flights.map((f, i) => (
              <FlightCard key={f.id} flight={f} index={i} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <span>🏨</span> Hotels
          </h3>
          <div className="space-y-3">
            {travel.hotels.map((h, i) => (
              <HotelCard key={h.id} hotel={h} index={i} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <span>🚇</span> Transport to Stadium
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {travel.transport.map((t) => (
              <motion.div
                key={t.mode}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl glass p-4"
                style={{ borderLeft: `3px solid ${t.color}` }}
              >
                <p className="font-semibold text-white">{t.mode}</p>
                <p className="text-2xl font-bold text-emerald-400">{t.duration}</p>
                <p className="text-xs text-slate-500">{t.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
