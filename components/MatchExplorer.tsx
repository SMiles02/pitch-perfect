"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatchCard from "@/components/MatchCard";
import type { Match } from "@/lib/data";
import { useTripContext } from "@/lib/trip-context";

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
  const [myTeamsOnly, setMyTeamsOnly] = useState(false);
  const { favoriteTeams, isFavoriteTeam } = useTripContext();
  const hasFavorites = favoriteTeams.length > 0;

  const sorted = useMemo(() => {
    const byDate = sortMatchesByDate(matches);
    if (!hasFavorites) return byDate;
    return [...byDate].sort((a, b) => {
      const aFav = isFavoriteTeam(a.home) || isFavoriteTeam(a.away) ? 0 : 1;
      const bFav = isFavoriteTeam(b.home) || isFavoriteTeam(b.away) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      const byDateCmp = a.date.localeCompare(b.date);
      if (byDateCmp !== 0) return byDateCmp;
      return a.time.localeCompare(b.time);
    });
  }, [matches, hasFavorites, isFavoriteTeam]);

  const filtered = useMemo(() => {
    let result = sorted;
    const trimmed = query.trim();
    if (trimmed) {
      result = result.filter((m) => matchesQuery(m, trimmed));
    }
    if (myTeamsOnly && hasFavorites) {
      result = result.filter((m) => isFavoriteTeam(m.home) || isFavoriteTeam(m.away));
    }
    return result;
  }, [sorted, query, myTeamsOnly, hasFavorites, isFavoriteTeam]);

  const isSearching = query.trim().length > 0 || myTeamsOnly;
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
        {hasFavorites && (
          <button
            type="button"
            onClick={() => {
              setMyTeamsOnly((prev) => !prev);
              setShowAll(false);
            }}
            className={`shrink-0 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              myTeamsOnly
                ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                : "border-slate-500/20 bg-slate-950/45 text-slate-400 hover:border-emerald-300/25 hover:text-emerald-200"
            }`}
          >
            <svg className="mr-1.5 inline h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            My Teams
          </button>
        )}

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
                <MatchCard
                  key={match.id}
                  match={match}
                  index={i}
                  isFavorite={hasFavorites && (isFavoriteTeam(match.home) || isFavoriteTeam(match.away))}
                />
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
