"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { getCountryInfo } from "@/lib/countries";
import { teamFlag } from "@/lib/flags";

const CountryMap = dynamic(() => import("./CountryMap"), { ssr: false });

interface CountryModalProps {
  open: boolean;
  team: string;
  onClose: () => void;
}

export default function CountryModal({ open, team, onClose }: CountryModalProps) {
  const info = getCountryInfo(team);
  const flag = teamFlag(team);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!info || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-500/15 bg-[#0a0f1c] shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-500/15 p-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl leading-none">{flag}</span>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {info.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-400">{team !== info.name ? team : ""}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-500/20 text-slate-400 transition-colors hover:text-slate-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 px-6 pt-5">
                <div className="rounded-xl border border-slate-500/15 bg-slate-950/45 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Capital
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-300">
                    {info.capital}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-500/15 bg-slate-950/45 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Population
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-300">
                    {info.population}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 pt-4">
                <p className="text-sm leading-6 text-slate-300">
                  {info.description}
                </p>
              </div>

              {/* Map */}
              <div className="p-6">
                <div className="h-[200px] overflow-hidden rounded-xl border border-slate-500/15">
                  <CountryMap coordinates={info.coordinates} name={info.name} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
