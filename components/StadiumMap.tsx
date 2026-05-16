"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Stadium, StadiumSection } from "@/lib/data";

interface StadiumMapProps {
  stadium: Stadium;
  matchId?: number;
}

const sectionPositions: Record<string, Record<string, { x: number; y: number; w: number; h: number }>> = {
  metlife: {
    "101": { x: 35, y: 55, w: 30, h: 18 },
    "201": { x: 30, y: 35, w: 40, h: 14 },
    "301": { x: 25, y: 18, w: 50, h: 12 },
    "401": { x: 8, y: 40, w: 18, h: 25 },
  },
  sofi: {
    "101": { x: 32, y: 58, w: 36, h: 16 },
    "201": { x: 28, y: 38, w: 44, h: 14 },
    "301": { x: 22, y: 15, w: 56, h: 14 },
    "401": { x: 72, y: 38, w: 20, h: 28 },
  },
};

export default function StadiumMap({ stadium, matchId }: StadiumMapProps) {
  const router = useRouter();
  const positions = sectionPositions[stadium.id] || {};

  const goToSection = (sectionId: string) => {
    const base = `/seat-view/${stadium.id}/${sectionId}`;
    const href = matchId ? `${base}?match=${matchId}` : base;
    router.push(href);
  };

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <motion.svg
        viewBox="0 0 100 80"
        className="w-full drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <defs>
          <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="50" cy="40" rx="48" ry="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <ellipse cx="50" cy="40" rx="42" ry="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />

        <rect x="30" y="32" width="40" height="16" rx="1" fill="url(#fieldGrad)" stroke="#22c55e" strokeWidth="0.3" />
        <line x1="50" y1="32" x2="50" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
        <circle cx="50" cy="40" r="3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" />

        {stadium.sections.map((section: StadiumSection) => {
          const pos = positions[section.id];
          if (!pos) return null;
          return (
            <g
              key={section.id}
              onClick={() => goToSection(section.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && goToSection(section.id)}
            >
              <motion.rect
                x={pos.x}
                y={pos.y}
                width={pos.w}
                height={pos.h}
                rx={2}
                fill="rgba(0, 255, 136, 0.15)"
                stroke="#00ff88"
                strokeWidth="0.4"
                whileHover={{ fill: "rgba(0, 255, 136, 0.35)" }}
                transition={{ duration: 0.2 }}
              />
              <text
                x={pos.x + pos.w / 2}
                y={pos.y + pos.h / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#00ff88"
                fontSize="3.5"
                fontWeight="600"
                pointerEvents="none"
              >
                {section.id}
              </text>
            </g>
          );
        })}
      </motion.svg>

      <p className="mt-4 text-center text-sm text-slate-500">
        Tap a section to preview your seat view
      </p>
    </div>
  );
}
