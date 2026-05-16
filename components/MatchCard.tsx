"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Match } from "@/lib/data";

interface MatchCardProps {
  match: Match;
  index?: number;
}

export default function MatchCard({ match, index = 0 }: MatchCardProps) {
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
          <span className="rounded-full border border-slate-500/20 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
            {match.group}
          </span>
          <span className="text-xs text-slate-500">{match.time}</span>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <p className="text-2xl font-semibold tracking-tight">{match.home}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">vs</span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-semibold tracking-tight">{match.away}</p>
          </div>
        </div>

        <div className="mb-6 space-y-1 border-t border-slate-500/15 pt-4 text-sm text-slate-400">
          <p className="font-medium text-slate-300">{match.stadium}</p>
          <p>
            {match.city} · {date}
          </p>
        </div>

        <Link
          href={`/match/${match.id}`}
          className="block w-full rounded-xl bg-emerald-400 py-3 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
        >
          Plan this trip
        </Link>
      </div>
    </motion.article>
  );
}
