"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BRACKET_ROUNDS,
  BRACKET_TREE,
  formatParticipant,
  getBracketSlot,
} from "@/lib/tournament";
import type { Match } from "@/lib/data";

interface KnockoutBracketProps {
  matches: Match[];
}

function formatMatchDate(date: string, time: string): string {
  const d = new Date(`${date}T${time}:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function BracketMatchCard({ match }: { match: Match }) {
  const slot = getBracketSlot(match.id);
  const homeLabel = slot ? formatParticipant(slot.home) : match.home;
  const awayLabel = slot ? formatParticipant(slot.away) : match.away;
  const isThirdPlace = match.group === "Third Place";

  return (
    <Link
      href={`/match/${match.id}`}
      className={`group block rounded-xl border border-white/10 bg-slate-900/70 p-3 transition-colors hover:border-emerald-500/40 hover:bg-slate-900 ${
        isThirdPlace ? "border-amber-500/20" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 flex items-center justify-between gap-2"
      >
        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-emerald-400">
          Match {match.id}
        </span>
        <span className="truncate text-[10px] text-slate-500">
          {formatMatchDate(match.date, match.time)} · {match.city}
        </span>
      </motion.div>
      <div className="space-y-1.5">
        <p className="truncate text-xs font-medium leading-snug text-slate-200 group-hover:text-emerald-300/90">
          {homeLabel}
        </p>
        <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          vs
        </p>
        <p className="truncate text-xs font-medium leading-snug text-slate-200 group-hover:text-emerald-300/90">
          {awayLabel}
        </p>
      </div>
      {isThirdPlace && (
        <p className="mt-2 text-[10px] text-amber-400/80">Third-place play-off</p>
      )}
    </Link>
  );
}

export default function KnockoutBracket({ matches }: KnockoutBracketProps) {
  const matchById = new Map(matches.map((m) => [m.id, m]));

  return (
    <div className="space-y-8">
      <p className="text-center text-sm text-slate-500">
        Knockout pairings follow the official FIFA World Cup 2026 schedule. Third-placed
        team slots show eligible groups until the group stage ends.
      </p>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[900px] gap-4 md:min-w-[1100px] md:gap-6">
          {BRACKET_ROUNDS.map((round) => (
            <div key={round.id} className="flex min-w-[160px] flex-1 flex-col">
              <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-emerald-400/90">
                {round.label}
              </h3>
              <div
                className={`flex flex-1 flex-col justify-around gap-3 ${
                  round.id === "finals" ? "items-stretch" : ""
                }`}
              >
                {BRACKET_TREE[round.id].map((matchId) => {
                  const match = matchById.get(matchId);
                  if (!match) return null;
                  return <BracketMatchCard key={matchId} match={match} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <details className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-300">
          Round of 32 — all 16 fixtures (matches 73–88)
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BRACKET_TREE.r32.map((matchId) => {
            const match = matchById.get(matchId);
            if (!match) return null;
            return <BracketMatchCard key={matchId} match={match} />;
          })}
        </div>
      </details>
    </div>
  );
}
