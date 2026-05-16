"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  metlifeLayout,
  placeMetlifeSections,
  type MetlifeCategory,
  type PlacedSection,
} from "@/lib/metlife-layout";
import SectionSeatPicker from "@/components/SectionSeatPicker";
import { getMetlifeSectionMeta } from "@/lib/data";

interface MetLifeStadiumMapProps {
  matchId?: number;
  initialSectionId?: string;
}

export default function MetLifeStadiumMap({ matchId, initialSectionId }: MetLifeStadiumMapProps) {
  const sections = useMemo(() => placeMetlifeSections(), []);
  const [selected, setSelected] = useState<PlacedSection | null>(() => {
    if (!initialSectionId) return null;
    return sections.find((s) => s.id === initialSectionId) ?? null;
  });
  const [hovered, setHovered] = useState<string | null>(null);

  const field = metlifeLayout.field;
  const vb = metlifeLayout.viewBox.join(" ");

  const selectedMeta = selected ? getMetlifeSectionMeta(selected.id) : null;

  return (
    <motion.div className="relative mx-auto w-full max-w-3xl">
      <div className="mb-4 flex flex-wrap justify-center gap-3 text-xs">
        {(Object.entries(metlifeLayout.categories) as [MetlifeCategory, (typeof metlifeLayout.categories)["1"]][]).map(
          ([key, cat]) => (
            <span key={key} className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: cat.fill, border: `1px solid ${cat.stroke}` }}
              />
              {cat.label}
            </span>
          )
        )}
      </div>

      <motion.svg
        viewBox={vb}
        className="w-full rounded-xl bg-slate-950/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="img"
        aria-label="MetLife Stadium seating plan from above"
      >
        <defs>
          <linearGradient id="metlifeField" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>

        <ellipse
          cx="100"
          cy="70"
          rx="92"
          ry="62"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {sections.map((sec) => {
          const cat = metlifeLayout.categories[sec.category];
          const isSelected = selected?.id === sec.id;
          const isHovered = hovered === sec.id;
          const hasPanorama = getMetlifeSectionMeta(sec.id).hasPanorama;

          return (
            <g
              key={sec.id}
              onClick={() => setSelected(sec)}
              onMouseEnter={() => setHovered(sec.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelected(sec)}
            >
              <path
                d={sec.path}
                fill={isSelected ? "rgba(0,255,136,0.55)" : isHovered ? cat.fill.replace("0.55", "0.75") : cat.fill}
                stroke={isSelected ? "#00ff88" : isHovered ? "#fff" : cat.stroke}
                strokeWidth={isSelected ? 0.5 : 0.25}
                strokeLinejoin="round"
              />
              {(isSelected || isHovered || parseInt(sec.id) % 7 === 0) && (
                <text
                  x={sec.labelX}
                  y={sec.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? "#fff" : hasPanorama ? "#e2e8f0" : "#94a3b8"}
                  fontSize={isSelected ? 3.2 : 2.2}
                  fontWeight={isSelected ? 700 : 500}
                  pointerEvents="none"
                >
                  {sec.id}
                </text>
              )}
              <title>
                Section {sec.id} · {cat.label}
                {hasPanorama ? " · 360° preview" : ""}
              </title>
            </g>
          );
        })}

        <rect
          x={field.x}
          y={field.y}
          width={field.w}
          height={field.h}
          rx={1}
          fill="url(#metlifeField)"
          stroke="#22c55e"
          strokeWidth="0.6"
          pointerEvents="none"
        />
        <line
          x1={field.x + field.w / 2}
          y1={field.y}
          x2={field.x + field.w / 2}
          y2={field.y + field.h}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.35"
          pointerEvents="none"
        />
        <circle
          cx={field.x + field.w / 2}
          cy={field.y + field.h / 2}
          r="3"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.25"
          pointerEvents="none"
        />
        <rect
          x={field.x}
          y={field.y + field.h / 2 - 5}
          width="8"
          height="10"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.25"
          pointerEvents="none"
        />
        <rect
          x={field.x + field.w - 8}
          y={field.y + field.h / 2 - 5}
          width="8"
          height="10"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.25"
          pointerEvents="none"
        />
      </motion.svg>

      <p className="mt-3 text-center text-xs text-slate-500">
        Based on{" "}
        <a
          href="https://ticket-compare.com/stadiums/metlife-stadium/seating-plan/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-500/80 hover:text-emerald-400"
        >
          Ticket-Compare MetLife seating plan
        </a>
        {" "}· tap a section
      </p>

      <AnimatePresence mode="wait">
        {selected && selectedMeta && (
          <SectionSeatPicker
            key={selected.id}
            stadiumId="metlife"
            stadiumName="MetLife Stadium"
            sectionId={selected.id}
            sectionLabel={`Section ${selected.id}`}
            tier={selectedMeta.tier}
            price={selectedMeta.price}
            categoryLabel={metlifeLayout.categories[selected.category].label}
            hasPanorama={selectedMeta.hasPanorama}
            matchId={matchId}
            onBack={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
