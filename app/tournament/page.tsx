"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GroupStandings from "@/components/GroupStandings";
import KnockoutBracket from "@/components/KnockoutBracket";
import { matches } from "@/lib/data";

type Tab = "groups" | "bracket";

const tabs: { id: Tab; label: string }[] = [
  { id: "groups", label: "Groups & tables" },
  { id: "bracket", label: "Knockout bracket" },
];

export default function TournamentPage() {
  const [tab, setTab] = useState<Tab>("groups");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen px-4 pb-24 pt-28"
    >
      <div className="absolute inset-0 hero-gradient opacity-40" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-emerald-400/80">
            FIFA World Cup 2026
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            Tournament <span className="text-gradient">Centre</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            All 12 groups with standings tables and the full knockout bracket. Every
            knockout fixture is numbered to match the official match schedule (73–104).
          </p>
        </header>

        <div className="mb-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-white/10 bg-slate-900/60 p-1"
            role="tablist"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-gradient-to-r from-emerald-600/90 to-violet-600/90 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        </div>

        {tab === "groups" ? (
          <section>
            <h2 className="mb-6 text-center text-lg font-semibold text-slate-300">
              Group stage · Matches 1–72
            </h2>
            <GroupStandings matches={matches} />
          </section>
        ) : (
          <section>
            <h2 className="mb-6 text-center text-lg font-semibold text-slate-300">
              Knockout stage · Matches 73–104
            </h2>
            <KnockoutBracket matches={matches} />
          </section>
        )}
      </div>
    </motion.div>
  );
}
