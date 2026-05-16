"use client";

import { motion } from "framer-motion";
import { EMPTY_STANDINGS_ROW, getTeamsByGroup } from "@/lib/tournament";
import type { Match } from "@/lib/data";

interface GroupStandingsProps {
  matches: Match[];
}

export default function GroupStandings({ matches }: GroupStandingsProps) {
  const teamsByGroup = getTeamsByGroup(matches);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from(teamsByGroup.entries()).map(([groupName, teams], i) => (
        <motion.article
          key={groupName}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="overflow-hidden rounded-2xl glass"
        >
          <header className="border-b border-white/5 bg-emerald-500/10 px-4 py-3">
            <h3 className="text-sm font-bold tracking-wide text-emerald-400">{groupName}</h3>
          </header>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[280px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-500">
                  <th className="px-3 py-2 font-medium">Team</th>
                  <th className="w-7 px-1 py-2 text-center" title="Played">
                    P
                  </th>
                  <th className="w-7 px-1 py-2 text-center" title="Won">
                    W
                  </th>
                  <th className="w-7 px-1 py-2 text-center" title="Drawn">
                    D
                  </th>
                  <th className="w-7 px-1 py-2 text-center" title="Lost">
                    L
                  </th>
                  <th className="w-7 px-1 py-2 text-center" title="Goals for">
                    GF
                  </th>
                  <th className="w-7 px-1 py-2 text-center" title="Goals against">
                    GA
                  </th>
                  <th className="w-7 px-1 py-2 text-center" title="Goal difference">
                    GD
                  </th>
                  <th className="w-8 px-2 py-2 text-center font-semibold text-emerald-400/90">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, row) => {
                  const stats = EMPTY_STANDINGS_ROW;
                  const isQualifier = row < 2;
                  return (
                    <tr
                      key={team}
                      className={`border-b border-white/5 last:border-0 ${
                        isQualifier ? "bg-emerald-500/5" : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        <span className="font-medium text-slate-200">{team}</span>
                        {row === 0 && (
                          <span className="ml-1.5 text-[10px] text-emerald-400/80">1st</span>
                        )}
                        {row === 1 && (
                          <span className="ml-1.5 text-[10px] text-violet-400/80">2nd</span>
                        )}
                      </td>
                      <td className="px-1 py-2 text-center text-slate-500">{stats.played}</td>
                      <td className="px-1 py-2 text-center text-slate-500">{stats.won}</td>
                      <td className="px-1 py-2 text-center text-slate-500">{stats.drawn}</td>
                      <td className="px-1 py-2 text-center text-slate-500">{stats.lost}</td>
                      <td className="px-1 py-2 text-center text-slate-500">{stats.gf}</td>
                      <td className="px-1 py-2 text-center text-slate-500">{stats.ga}</td>
                      <td className="px-1 py-2 text-center text-slate-500">{stats.gd}</td>
                      <td className="px-2 py-2 text-center font-semibold text-slate-400">
                        {stats.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
          <footer className="border-t border-white/5 px-3 py-2 text-[10px] text-slate-500">
            Top 2 advance · 8 best 3rd places also qualify
          </footer>
        </motion.article>
      ))}
    </motion.div>
  );
}
