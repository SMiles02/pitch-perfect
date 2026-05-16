"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import MatchAiChat from "@/components/MatchAiChat";
import TravelPanel from "@/components/TravelPanel";
import { getMatch, getStadium } from "@/lib/data";
import { formatParticipant, getBracketSlot } from "@/lib/tournament";

export default function MatchPage() {
  const params = useParams();
  const id = Number(params.id);
  const match = getMatch(id);
  const stadium = match ? getStadium(match.stadiumId) : undefined;

  if (!match || !stadium) {
    return (
      <motion.div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <p className="text-slate-400">Match not found.</p>
      </motion.div>
    );
  }

  const date = new Date(match.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const bracketSlot = getBracketSlot(match.id);
  const homeLabel = bracketSlot ? formatParticipant(bracketSlot.home) : match.home;
  const awayLabel = bracketSlot ? formatParticipant(bracketSlot.away) : match.away;

  return (
    <div className="min-h-screen px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link href="/#matches" className="mb-4 inline-block text-sm text-slate-500 hover:text-emerald-400">
            ← Back to matches
          </Link>
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-300/80">
            Match {match.id} · {match.group}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {homeLabel} vs {awayLabel}
          </h1>
          <p className="mt-2 text-slate-400">
            {match.stadium} · {match.city} · {date} at {match.time}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="mb-6 text-xl font-semibold">Travel notes</h2>
          <TravelPanel match={match} stadiumCoords={stadium.coordinates} />
        </motion.div>

        <div className="mb-10">
          <MatchAiChat match={match} stadium={stadium} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-500/15 bg-slate-950/50 p-8 text-center shadow-2xl shadow-slate-950/20"
        >
          <h2 className="mb-2 text-xl font-semibold">Want to check the view?</h2>
          <p className="mb-6 text-slate-400">
            Choose a stadium section and open a seat-level panorama when one is available.
          </p>
          <Link
            href={`/stadium/${match.stadiumId}?match=${match.id}`}
            className="inline-block rounded-full bg-emerald-400 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/20 transition-transform hover:scale-[1.03] hover:bg-emerald-300"
          >
            Choose a section
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
