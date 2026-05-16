"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import StadiumMap from "@/components/StadiumMap";
import { getStadium, usesDetailedLayout } from "@/lib/data";

function StadiumContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const stadiumId = params.id as string;
  const matchId = searchParams.get("match") ? Number(searchParams.get("match")) : undefined;
  const stadium = getStadium(stadiumId);

  if (!stadium) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <p className="text-slate-400">Stadium not found.</p>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen px-4 pb-16 pt-28">
      <div className={`mx-auto ${usesDetailedLayout(stadiumId) ? "max-w-5xl" : "max-w-4xl"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Link
            href={matchId ? `/match/${matchId}` : "/"}
            className="mb-4 inline-block text-sm text-slate-500 hover:text-emerald-400"
          >
            ← Back
          </Link>
          <p className="text-sm uppercase tracking-widest text-emerald-400">Seat Selection</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{stadium.name}</h1>
          <p className="mt-2 text-slate-400">
            {stadium.city} · Capacity {stadium.capacity.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl glass p-4 md:p-8 glow-accent"
        >
          <StadiumMap
            stadium={stadium}
            matchId={matchId}
            initialSectionId={searchParams.get("section") ?? undefined}
          />
        </motion.div>

        {usesDetailedLayout(stadiumId) ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-slate-500"
          >
            172 sections · 4 FIFA ticket categories · tap any block, then pick a seat
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {stadium.sections.map((section) => (
              <div key={section.id} className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{section.label}</p>
                    <p className="text-xs text-slate-500">
                      {section.tier} · {section.price}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p>Atmosphere {section.atmosphere}/10</p>
                    <p>Visibility {section.visibility}/10</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function StadiumPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center pt-24 text-slate-500">
          Loading stadium…
        </div>
      }
    >
      <StadiumContent />
    </Suspense>
  );
}
