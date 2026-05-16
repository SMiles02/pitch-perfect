"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Stadium, StadiumSection } from "@/lib/data";
import MetLifeStadiumMap from "@/components/MetLifeStadiumMap";
import { usesDetailedLayout } from "@/lib/data";

interface StadiumMapProps {
  stadium: Stadium;
  matchId?: number;
  initialSectionId?: string;
}

const lower = { x: 35, y: 55, w: 30, h: 18 };
const club = { x: 30, y: 35, w: 40, h: 14 };
const upper = { x: 25, y: 18, w: 50, h: 12 };
const cornerLeft = { x: 8, y: 40, w: 18, h: 25 };
const cornerRight = { x: 72, y: 38, w: 20, h: 28 };

function zoneForSection(section: StadiumSection) {
  const tier = section.tier.toLowerCase();
  if (tier.includes("end") || tier.includes("cabecera")) return cornerRight;
  if (tier.includes("corner")) return cornerLeft;
  if (tier === "lower") return lower;
  if (tier.includes("club") || tier.includes("preferente")) return club;
  return upper;
}

const sectionPositions: Record<string, Record<string, { x: number; y: number; w: number; h: number }>> = {
  akron: { "105": lower, "T1-36": club, "T2-29": upper, "T2-35": cornerLeft },
  arrowhead: { "118": lower, "205": club, "301": upper, "136": cornerLeft },
  att: { "101": lower, "201": club, "317": upper, "142": cornerLeft },
  azteca: { "103": lower, "207": club, "303": upper, "314": cornerRight },
  bbva: { "101": lower, "208": club, "243": upper, "136": cornerLeft },
  "bc-place": { "214": lower, "218": club, "229": upper, "206": cornerLeft },
  "bmo-field": { "108": lower, "123": club, "208": upper, "204": cornerRight },
  gillette: { "101": lower, "201": club, "301": upper, "140": cornerLeft },
  "hard-rock": { "122": lower, "213": club, "313": upper, "107": cornerRight },
  levis: { "101": lower, "201": club, "301": upper, "148": cornerLeft },
  "lincoln-financial": { "101": lower, "201": club, "301": upper, "140": cornerLeft },
  lumen: { "101": lower, "201": club, "301": upper, "136": cornerLeft },
  "mercedes-benz": { "101": lower, "201": club, "337": upper, "243": cornerRight },
  nrg: { "101": lower, "201": club, "301": upper, "136": cornerLeft },
  sofi: { "101": { x: 32, y: 58, w: 36, h: 16 }, "201": club, "301": { x: 22, y: 15, w: 56, h: 14 }, "401": cornerRight },
};

function GenericStadiumMap({ stadium, matchId }: StadiumMapProps) {
  const router = useRouter();
  const positions = sectionPositions[stadium.id] || {};

  const goToSection = (sectionId: string) => {
    const base = `/stadium/${stadium.id}?section=${sectionId}`;
    const href = matchId ? `${base}&match=${matchId}` : base;
    router.push(href);
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <svg viewBox="0 0 100 80" className="w-full drop-shadow-2xl" role="img">
        <defs>
          <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="40" rx="48" ry="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="30" y="32" width="40" height="16" rx="1" fill="url(#fieldGrad)" stroke="#4ade80" strokeWidth="0.3" />
        {stadium.sections.map((section) => {
          const pos = positions[section.id] ?? zoneForSection(section);
          return (
            <g
              key={section.id}
              onClick={() => goToSection(section.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <rect
                x={pos.x}
                y={pos.y}
                width={pos.w}
                height={pos.h}
                rx={2}
                fill="rgba(74, 222, 128, 0.14)"
                stroke="#4ade80"
                strokeWidth="0.4"
              />
              <text
                x={pos.x + pos.w / 2}
                y={pos.y + pos.h / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#bbf7d0"
                fontSize="3.5"
                fontWeight="600"
                pointerEvents="none"
              >
                {section.id}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-4 text-center text-sm text-slate-500">Tap a section to choose a seat</p>
    </motion.div>
  );
}

export default function StadiumMap({ stadium, matchId, initialSectionId }: StadiumMapProps) {
  if (usesDetailedLayout(stadium.id)) {
    return <MetLifeStadiumMap matchId={matchId} initialSectionId={initialSectionId} />;
  }
  return <GenericStadiumMap stadium={stadium} matchId={matchId} />;
}
