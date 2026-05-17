"use client";

import { motion } from "framer-motion";
import { useTripContext } from "@/lib/trip-context";

interface AddToTripButtonProps {
  matchId: number;
  compact?: boolean;
}

export default function AddToTripButton({ matchId, compact }: AddToTripButtonProps) {
  const { addMatch, removeMatch, isInTrip } = useTripContext();
  const inTrip = isInTrip(matchId);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inTrip) {
      removeMatch(matchId);
    } else {
      addMatch(matchId);
    }
  };

  if (compact) {
    return (
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.9 }}
        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
          inTrip
            ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-300"
            : "border-slate-500/20 bg-slate-950/45 text-slate-400 hover:border-emerald-300/25 hover:text-emerald-300"
        }`}
        title={inTrip ? "Remove from trip" : "Add to trip"}
      >
        {inTrip ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.97 }}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
        inTrip
          ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
          : "border-slate-500/20 bg-slate-950/45 text-slate-300 hover:border-emerald-300/25 hover:text-emerald-200"
      }`}
    >
      {inTrip ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          In your trip
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add to trip
        </>
      )}
    </motion.button>
  );
}
