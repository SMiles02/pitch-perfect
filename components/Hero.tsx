"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      <motion.div
        className="absolute inset-0 hero-gradient grid-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-emerald-300/80"
        >
          World Cup 2026 trip planning
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mb-6 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Know the matchday view{" "}
          <span className="relative inline-block font-serif italic">
            before
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[0.08em] w-full origin-left rounded-full bg-emerald-300"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.75, ease: "easeOut" }}
            />
          </span>{" "}
          you book the trip
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-slate-300/85 md:text-xl"
        >
          Browse fixtures, check travel options from your city, and open a seat-level
          panorama before you commit to tickets.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/#matches"
            className="group relative overflow-hidden rounded-full bg-emerald-400 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-950/30 transition-transform hover:scale-[1.03]"
          >
            <span className="relative z-10">Browse Matches</span>
            <motion.span
              className="absolute inset-0 bg-white/30"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Link>
          <Link
            href="/tournament"
            className="rounded-full border border-slate-500/25 bg-slate-950/20 px-8 py-4 text-sm font-semibold text-slate-200 transition-all hover:border-emerald-300/50 hover:text-emerald-200"
          >
            Groups & Bracket
          </Link>
          <Link
            href="/stadium/metlife"
            className="rounded-full border border-slate-500/25 bg-slate-950/20 px-8 py-4 text-sm font-semibold text-slate-200 transition-all hover:border-sky-300/50 hover:text-sky-200"
          >
            Open Seat Preview
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs uppercase tracking-widest">Fixtures below</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
