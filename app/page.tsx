"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import MatchCard from "@/components/MatchCard";
import { matches } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="matches" className="relative px-4 py-24">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-emerald-400/80">
              Match Explorer
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Upcoming <span className="text-gradient">World Cup</span> Matches
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Select a match to plan flights, hotels, transport, and preview your seat.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {matches.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl glass glow-accent p-10"
          >
            <h3 className="mb-4 text-2xl font-bold">The Wow Moment</h3>
            <p className="mb-6 text-slate-400">
              Select your stadium section, open the immersive viewer, and physically rotate your
              phone. The panorama moves in sync — like you&apos;re already in your seat.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/stadium/metlife"
                className="rounded-full border border-emerald-500/30 px-6 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                MetLife Stadium
              </Link>
              <Link
                href="/stadium/sofi"
                className="rounded-full border border-violet-500/30 px-6 py-2 text-sm font-medium text-violet-400 transition-colors hover:bg-violet-500/10"
              >
                SoFi Stadium
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
