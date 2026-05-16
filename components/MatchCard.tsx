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
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl glass glow-accent transition-shadow hover:shadow-emerald-500/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-emerald-400">
            {match.group}
          </span>
          <span className="text-xs text-slate-500">{match.time}</span>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{match.home}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">vs</span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold">{match.away}</p>
          </div>
        </div>

        <div className="mb-6 space-y-1 border-t border-white/5 pt-4 text-sm text-slate-400">
          <p className="font-medium text-slate-300">{match.stadium}</p>
          <p>
            {match.city} · {date}
          </p>
        </div>

        <Link
          href={`/match/${match.id}`}
          className="block w-full rounded-xl bg-gradient-to-r from-emerald-600/90 to-violet-600/90 py-3 text-center text-sm font-semibold text-white transition-all hover:from-emerald-500 hover:to-violet-500"
        >
          Plan My Trip
        </Link>
      </div>
    </motion.article>
  );
}
