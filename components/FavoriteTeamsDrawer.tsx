"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTripContext } from "@/lib/trip-context";
import { getTeamsByGroup } from "@/lib/tournament";
import { teamFlag } from "@/lib/flags";
import CountryModal from "./CountryModal";

interface FavoriteTeamsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function FavoriteTeamsDrawer({ open, onClose }: FavoriteTeamsDrawerProps) {
  const { favoriteTeams, toggleFavoriteTeam, clearFavoriteTeams } = useTripContext();
  const [search, setSearch] = useState("");
  const [infoTeam, setInfoTeam] = useState<string | null>(null);

  const teamsByGroup = useMemo(() => getTeamsByGroup(), []);

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result: [string, string[]][] = [];
    for (const [group, teams] of teamsByGroup) {
      const filtered = q ? teams.filter((t) => t.toLowerCase().includes(q)) : teams;
      if (filtered.length > 0) result.push([group, filtered]);
    }
    return result;
  }, [teamsByGroup, search]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-slate-500/15 bg-[#0a0f1c] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-500/15 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">Favorite Teams</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {favoriteTeams.length} selected
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-500/20 text-slate-400 transition-colors hover:text-slate-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams..."
                className="w-full rounded-xl border border-slate-500/20 bg-slate-950/50 py-2.5 pl-4 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-colors focus:border-emerald-300/40 focus:ring-1 focus:ring-emerald-300/20"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {filteredGroups.map(([group, teams]) => (
                <div key={group} className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {group}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {teams.map((team) => {
                      const selected = favoriteTeams.includes(team);
                      return (
                        <span key={team} className="inline-flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => toggleFavoriteTeam(team)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              selected
                                ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                                : "border-slate-500/20 bg-slate-950/45 text-slate-400 hover:border-slate-400/30 hover:text-slate-300"
                            }`}
                          >
                            {selected && (
                              <svg className="mr-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {teamFlag(team)} {team}
                          </button>
                          <button
                            type="button"
                            onClick={() => setInfoTeam(team)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-slate-600 transition-colors hover:text-emerald-300"
                            title={`About ${team}`}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {favoriteTeams.length > 0 && (
              <div className="border-t border-slate-500/15 px-6 py-4">
                <button
                  type="button"
                  onClick={clearFavoriteTeams}
                  className="text-xs text-slate-500 transition-colors hover:text-slate-300"
                >
                  Clear all favorites
                </button>
              </div>
            )}
          </motion.aside>
          {infoTeam && (
            <CountryModal
              open={!!infoTeam}
              team={infoTeam}
              onClose={() => setInfoTeam(null)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
