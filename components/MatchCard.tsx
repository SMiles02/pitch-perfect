"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Match } from "@/lib/data";
import AddToTripButton from "./AddToTripButton";
import TeamName from "./TeamName";

interface MatchCardProps {
  match: Match;
  index?: number;
  isFavorite?: boolean;
}

export default function MatchCard({ match, index = 0, isFavorite }: MatchCardProps) {
  const date = new Date(match.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-500/15 bg-slate-950/55 shadow-xl shadow-slate-950/15 transition-colors hover:border-emerald-300/25"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/20 to-transparent" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-300/8 blur-3xl" />

      <div className="relative p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="rounded-full border border-slate-500/20 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
              {match.group}
            </span>
            {isFavorite && (
              <svg className="h-3.5 w-3.5 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            )}
          </span>
          <span className="text-xs text-slate-500">{match.time}</span>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <TeamName name={match.home} className="text-2xl font-semibold tracking-tight" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">vs</span>
          </div>
          <div className="flex-1 text-center">
            <TeamName name={match.away} className="text-2xl font-semibold tracking-tight" />
          </div>
        </div>

        <div className="mb-6 space-y-1 border-t border-slate-500/15 pt-4 text-sm text-slate-400">
          <p className="font-medium text-slate-300">{match.stadium}</p>
          <p>
            {match.city} · {date}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/match/${match.id}`}
            className="block flex-1 rounded-xl bg-emerald-400 py-3 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            Plan this trip
          </Link>
          <AddToTripButton matchId={match.id} compact />
        </div>
      </div>
    </motion.article>
  );
}
