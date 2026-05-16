"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import MatchExplorer from "@/components/MatchExplorer";
import { matches } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="matches" className="relative px-4 py-24">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-6xl"
        >
          <MatchExplorer matches={matches} />
        </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
