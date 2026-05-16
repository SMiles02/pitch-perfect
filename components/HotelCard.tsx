"use client";

import { motion } from "framer-motion";
import type { Hotel } from "@/lib/travel";

export default function HotelCard({ hotel, index = 0 }: { hotel: Hotel; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      className="rounded-xl border border-slate-500/15 bg-slate-950/45 p-4"
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-semibold text-white">{hotel.name}</p>
          <p className="text-sm text-slate-400">{hotel.distance}</p>
        </div>
        <span className="rounded-lg border border-sky-300/20 bg-sky-300/10 px-2 py-1 text-sm font-semibold text-sky-200">
          {hotel.price}
        </span>
      </div>
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < Math.floor(hotel.rating) ? "opacity-100" : "opacity-30"}>
            ★
          </span>
        ))}
        <span className="ml-1 text-xs text-slate-500">{hotel.rating}</span>
      </div>
    </motion.div>
  );
}
