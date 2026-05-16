"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { generateSeatsForSection } from "@/lib/data";

interface SectionSeatPickerProps {
  stadiumId: string;
  stadiumName: string;
  sectionId: string;
  sectionLabel: string;
  tier: string;
  price: string;
  categoryLabel?: string;
  hasPanorama: boolean;
  matchId?: number;
  onBack: () => void;
}

export default function SectionSeatPicker({
  stadiumId,
  stadiumName,
  sectionId,
  sectionLabel,
  tier,
  price,
  categoryLabel,
  hasPanorama,
  matchId,
  onBack,
}: SectionSeatPickerProps) {
  const router = useRouter();
  const seats = generateSeatsForSection(tier);

  const openSeat = (seatId: string) => {
    if (!hasPanorama) return;
    const base = `/seat-view/${stadiumId}/${sectionId}/${seatId}`;
    router.push(matchId ? `${base}?match=${matchId}` : base);
  };

  const rows = [...new Set(seats.map((s) => s.row))].sort((a, b) => a - b);
  const seatsByRow = rows.map((row) => seats.filter((s) => s.row === row));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="mt-6 rounded-2xl border border-slate-500/15 bg-slate-950/70 p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-300/80">{stadiumName}</p>
          <h3 className="text-lg font-semibold text-white">{sectionLabel}</h3>
          <p className="text-sm text-slate-400">
            {categoryLabel ? `${categoryLabel} · ` : ""}
            {tier} · {price} · {seats.length} seats
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-lg border border-slate-500/20 px-3 py-1.5 text-sm text-slate-300 hover:border-emerald-300/40 hover:text-emerald-200"
        >
          ← Map
        </button>
      </div>


      <div className="max-h-[min(50vh,420px)] overflow-auto rounded-xl border border-slate-500/15 bg-black/30 p-3">
        <motion.div
          className="mb-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-wider text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>← Away</span>
          <span className="text-emerald-300/80">Pitch</span>
          <span>Home →</span>
        </motion.div>

        <div className="space-y-1">
          {seatsByRow.map((rowSeats) => (
            <motion.div
              key={rowSeats[0].row}
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowSeats[0].row * 0.02 }}
            >
              <span className="w-7 shrink-0 text-right text-[10px] font-medium text-slate-500">
                R{rowSeats[0].row}
              </span>
              <div className="flex flex-1 flex-wrap justify-center gap-0.5">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={!hasPanorama}
                    onClick={() => openSeat(seat.id)}
                    className={`h-6 w-6 rounded-sm text-[9px] font-medium transition-colors ${
                      hasPanorama
                        ? "cursor-pointer bg-emerald-300/15 text-emerald-200 hover:bg-emerald-300/35 hover:text-white"
                        : "cursor-not-allowed bg-slate-800/80 text-slate-600"
                    }`}
                    title={seat.label}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-500">
        {hasPanorama
          ? "Tap a seat to open the 360° view from that position"
          : "Panorama mapping available for MetLife sections"}
      </p>
    </motion.div>
  );
}
