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
      <div className="absolute inset-0 hero-gradient opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.22em] text-emerald-300/80">
            Tournament view
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Groups and knockout paths
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Follow all 12 groups and the bracket that starts at match 73. Knockout fixtures
            stay linked to the same trip planning pages.
          </p>
        </header>

        <div className="mb-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-slate-500/20 bg-slate-950/55 p-1"
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
                    ? "bg-emerald-300 text-slate-950"
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
              Group stage · Matches 1-72
            </h2>
            <GroupStandings matches={matches} />
          </section>
        ) : (
          <section>
            <h2 className="mb-6 text-center text-lg font-semibold text-slate-300">
              Knockout stage · Matches 73-104
            </h2>
            <KnockoutBracket matches={matches} />
          </section>
        )}
      </div>
    </motion.div>
  );
}
