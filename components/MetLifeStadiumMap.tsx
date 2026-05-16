"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  metlifeLayout,
  placeMetlifeSections,
  getMetlifeField,
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

  const field = getMetlifeField();
  const vb = metlifeLayout.viewBox.join(" ");
  const fx = field.x;
  const fy = field.y;
  const fw = field.w;
  const fh = field.h;
  const fcx = fx + fw / 2;
  const fcy = fy + fh / 2;

  const selectedMeta = selected ? getMetlifeSectionMeta(selected.id) : null;

  return (
    <motion.div className="relative mx-auto w-full max-w-4xl">
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
          cx="130"
          cy="55"
          rx="98"
          ry="50"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {/* Pitch drawn beneath sections so lower bowl wraps around it */}
        <g pointerEvents="none">
          <rect
            x={fx}
            y={fy}
            width={fw}
            height={fh}
            rx={0.8}
            fill="url(#metlifeField)"
            stroke="#22c55e"
            strokeWidth="0.5"
          />
          <line
            x1={fcx}
            y1={fy}
            x2={fcx}
            y2={fy + fh}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.3"
          />
          <circle
            cx={fcx}
            cy={fcy}
            r={fh * 0.12}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.25"
          />
          <rect
            x={fx}
            y={fcy - fh * 0.22}
            width={fw * 0.16}
            height={fh * 0.44}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.2"
          />
          <rect
            x={fx + fw - fw * 0.16}
            y={fcy - fh * 0.22}
            width={fw * 0.16}
            height={fh * 0.44}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.2"
          />
        </g>

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
              {isHovered && (
                <text
                  x={sec.labelX}
                  y={sec.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="3"
                  fontWeight="700"
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
