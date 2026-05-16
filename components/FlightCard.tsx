"use client";

import { motion } from "framer-motion";
import type { Flight } from "@/lib/travel";

export default function FlightCard({ flight, index = 0 }: { flight: Flight; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl glass p-4"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-semibold text-white">{flight.airline}</p>
          <p className="text-sm text-slate-400">{flight.route}</p>
        </div>
        <span className="rounded-lg bg-emerald-500/20 px-2 py-1 text-sm font-bold text-emerald-400">
          {flight.price}
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
    </motion.div>
  );
}
