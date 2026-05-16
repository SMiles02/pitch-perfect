"use client";

import { motion } from "framer-motion";
import type { Flight } from "@/lib/travel";

export default function FlightCard({ flight, index = 0 }: { flight: Flight; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-slate-500/15 bg-slate-950/45 p-4"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-semibold text-white">{flight.airline}</p>
          <p className="text-sm text-slate-400">{flight.route}</p>
        </div>
        <span className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-sm font-semibold text-emerald-200">
          Est. {flight.price}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-lg font-mono font-semibold">{flight.departure}</p>
          <p className="text-xs text-slate-500">Depart</p>
        </div>
        <div className="flex flex-1 flex-col items-center px-4">
          <motion.div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
          <p className="mt-1 text-xs text-slate-500">
            {flight.duration} · {flight.stops === 0 ? "Direct" : `${flight.stops} stop`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-mono font-semibold">{flight.arrival}</p>
          <p className="text-xs text-slate-500">Arrive</p>
        </div>
      </div>
      <a
        href={flight.bookingUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-slate-500/20 bg-slate-900/60 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-emerald-100"
        aria-label="Search all flights for this match trip"
      >
        Search all flights
      </a>
    </motion.div>
  );
}
