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
          className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400/80"
        >
          FIFA World Cup 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Experience Your World Cup Seat{" "}
          <span className="text-gradient">Before You Travel</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl"
        >
          Fans spend thousands travelling to the World Cup without knowing what their
          actual experience will feel like. Preview your view, plan your trip, and
          rotate your phone to step inside the stadium.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/#matches"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105"
          >
            <span className="relative z-10">Explore Matches</span>
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Link>
          <Link
            href="/tournament"
            className="rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-slate-300 transition-all hover:border-emerald-500/50 hover:text-emerald-400"
          >
            Groups & Bracket
          </Link>
          <Link
            href="/stadium/metlife"
            className="rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-slate-300 transition-all hover:border-violet-500/50 hover:text-violet-400"
          >
            Try Seat Preview
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
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
