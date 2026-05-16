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
        <div className="absolute inset-0 hero-gradient opacity-35" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-6xl"
        >
          <MatchExplorer matches={matches} />
        </motion.div>
      </section>

      <section className="border-t border-white/10 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-slate-500/15 bg-slate-950/45 p-8 shadow-2xl shadow-slate-950/20 md:p-10"
          >
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
              Seat previews
            </p>
            <h3 className="mb-4 text-2xl font-semibold tracking-tight">
              Check the sightline before you pick a section
            </h3>
            <p className="mb-6 max-w-2xl leading-7 text-slate-400">
              Start with a stadium map, choose a section, then open the panorama from an
              available seat. On mobile, motion controls let you look around by moving the phone.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/stadium/metlife"
                className="rounded-full border border-emerald-300/25 px-6 py-2 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-300/10"
              >
                MetLife Stadium
              </Link>
              <Link
                href="/stadium/sofi"
                className="rounded-full border border-sky-300/25 px-6 py-2 text-sm font-medium text-sky-200 transition-colors hover:bg-sky-300/10"
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
