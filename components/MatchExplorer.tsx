"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatchCard from "@/components/MatchCard";
import type { Match } from "@/lib/data";

const PREVIEW_COUNT = 4;

function sortMatchesByDate(matchList: Match[]): Match[] {
  return [...matchList].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return a.time.localeCompare(b.time);
  });
}

function matchesQuery(match: Match, query: string): boolean {
  const q = query.toLowerCase();
  return (
    match.home.toLowerCase().includes(q) ||
    match.away.toLowerCase().includes(q) ||
    match.city.toLowerCase().includes(q) ||
    match.stadium.toLowerCase().includes(q) ||
    match.group.toLowerCase().includes(q)
  );
}

interface MatchExplorerProps {
  matches: Match[];
}

export default function MatchExplorer({ matches }: MatchExplorerProps) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => sortMatchesByDate(matches), [matches]);

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return sorted;
    return sorted.filter((m) => matchesQuery(m, trimmed));
  }, [sorted, query]);

  const isSearching = query.trim().length > 0;
  const displayed = isSearching
    ? filtered
    : showAll
      ? sorted
      : sorted.slice(0, PREVIEW_COUNT);

  const total = matches.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-emerald-300/80">
          Fixture finder
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Start with a match
        </h2>
        <p className="mt-3 max-w-xl leading-7 text-slate-400">
          Search by team, city, stadium, or group. Each fixture opens into travel options
          and nearby seat previews.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <label className="relative block w-full sm:max-w-md">
          <span className="sr-only">Search matches</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim()) setShowAll(false);
            }}
            placeholder="Search team, city, stadium, or group…"
            className="w-full rounded-xl border border-slate-500/20 bg-slate-950/50 py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-300/40 focus:ring-1 focus:ring-emerald-300/20"
          />
        </label>

        <p className="shrink-0 text-center text-sm text-slate-500 sm:text-right">
          {isSearching ? (
            <>
              <span className="font-medium text-slate-300">{filtered.length}</span>
              {filtered.length === 1 ? " match" : " matches"} found
            </>
          ) : showAll ? (
            <>Showing all {total} matches</>
          ) : (
            <>
              Next <span className="font-medium text-slate-300">{PREVIEW_COUNT}</span> of{" "}
              <span className="font-medium text-slate-300">{total}</span>
            </>
          )}
        </p>
      </motion.div>

      <div
        className={
          showAll && !isSearching
            ? "max-h-[min(70vh,900px)] overflow-y-auto rounded-2xl pr-1"
            : undefined
        }
      >
        <AnimatePresence mode="wait">
          {displayed.length > 0 ? (
            <motion.div
              key={isSearching ? `search-${query}` : showAll ? "all" : "preview"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {displayed.map((match, i) => (
                <MatchCard key={match.id} match={match} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-slate-500/20 py-16 text-center text-slate-500"
            >
              No matches match your search. Try a different team, city, or group.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="rounded-full border border-slate-500/20 bg-slate-950/45 px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-emerald-300/30 hover:bg-emerald-300/10 hover:text-emerald-200"
          >
            {showAll ? "Show fewer matches" : `View all ${total} matches`}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
