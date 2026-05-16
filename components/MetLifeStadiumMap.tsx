"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  metlifeLayout,
  placeMetlifeSections,
  getMetlifeField,
  getSectionViewBox,
  placeSeatsInWedge,
  type MetlifeCategory,
  type PlacedSection,
} from "@/lib/metlife-layout";
import { generateSeatsForSection, getMetlifeSectionMeta } from "@/lib/data";

interface MetLifeStadiumMapProps {
  matchId?: number;
  initialSectionId?: string;
}

export default function MetLifeStadiumMap({ matchId, initialSectionId }: MetLifeStadiumMapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sections = useMemo(() => placeMetlifeSections(), []);

  const [selected, setSelected] = useState<PlacedSection | null>(() => {
    if (!initialSectionId) return null;
    return sections.find((s) => s.id === initialSectionId) ?? null;
  });
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const field = getMetlifeField();
  const fullVb = metlifeLayout.viewBox.join(" ");
  const zoomVb = selected ? getSectionViewBox(selected) : fullVb;

  const fx = field.x;
  const fy = field.y;
  const fw = field.w;
  const fh = field.h;
  const fcx = fx + fw / 2;
  const fcy = fy + fh / 2;

  const selectedMeta = selected ? getMetlifeSectionMeta(selected.id) : null;

  const placedSeats = useMemo(() => {
    if (!selected || !selectedMeta) return [];
    const seats = generateSeatsForSection(selectedMeta.tier);
    return placeSeatsInWedge(selected, seats);
  }, [selected, selectedMeta]);

  const updateSectionParam = useCallback(
    (sectionId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (sectionId) params.set("section", sectionId);
      else params.delete("section");
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const selectSection = (sec: PlacedSection) => {
    setSelected(sec);
    updateSectionParam(sec.id);
  };

  const clearSection = useCallback(() => {
    setSelected(null);
    setHoveredSeat(null);
    updateSectionParam(null);
  }, [updateSectionParam]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selected) clearSection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, clearSection]);

  const openSeat = (seatId: string) => {
    if (!selected || !selectedMeta?.hasPanorama) return;
    const base = `/seat-view/metlife/${selected.id}/${seatId}`;
    router.push(matchId ? `${base}?match=${matchId}` : base);
  };

  return (
    <motion.div className="relative mx-auto w-full max-w-4xl">
      <div className="mb-4 flex flex-wrap justify-center gap-3 text-xs">
        {(Object.entries(metlifeLayout.categories) as [MetlifeCategory, (typeof metlifeLayout.categories)["1"]][]).map(
          ([key, cat]) => (
            <span key={key} className="flex items-center gap-1.5 rounded-full border border-slate-500/20 px-2.5 py-1 text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: cat.fill, border: `1px solid ${cat.stroke}` }}
              />
              {cat.label}
            </span>
          )
        )}
      </div>

      <motion.div className="overflow-hidden rounded-xl border border-slate-500/15 bg-slate-950/80">
        <motion.div className="min-h-[4.25rem]">
          <AnimatePresence>
          {selected && selectedMeta && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start justify-between gap-3 border-b border-slate-500/15 bg-slate-950/90 px-4 py-3"
            >
              <motion.div layout className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-emerald-300/80">Section {selected.id}</p>
                <p className="truncate text-sm font-semibold text-white">
                  {metlifeLayout.categories[selected.category].label} · {selectedMeta.tier}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedMeta.price} · {placedSeats.length} seats · tap a seat for the 360 view
                </p>
              </motion.div>
              <button
                type="button"
                onClick={clearSection}
                className="shrink-0 rounded-lg border border-slate-500/20 px-3 py-1.5 text-sm text-slate-300 hover:border-emerald-300/40 hover:text-emerald-200"
              >
                ← Full map
              </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="relative mx-auto h-[280px] w-full max-h-[56vh] sm:h-[340px] md:h-[400px]">
          <motion.svg
            viewBox={zoomVb}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            initial={false}
            animate={{ viewBox: zoomVb }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            role="img"
            aria-label={
              selected
                ? `Section ${selected.id} seat map`
                : "MetLife Stadium seating plan from above"
            }
          >
          <defs>
            <linearGradient id="metlifeField" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>

          {!selected && (
            <ellipse
              cx="130"
              cy="55"
              rx="98"
              ry="50"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
          )}

          <g pointerEvents="none" style={{ opacity: selected ? 0.25 : 1 }}>
            <rect
              x={fx}
              y={fy}
              width={fw}
              height={fh}
              rx={0.8}
              fill="url(#metlifeField)"
              stroke="#4ade80"
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
            const isZoomed = Boolean(selected);
            const isHovered = hovered === sec.id;
            const hasPanorama = getMetlifeSectionMeta(sec.id).hasPanorama;
            const dimmed = isZoomed && !isSelected;

            return (
              <g
                key={sec.id}
                onClick={() => (isZoomed ? isSelected ? undefined : selectSection(sec) : selectSection(sec))}
                onMouseEnter={() => !isZoomed && setHovered(sec.id)}
                onMouseLeave={() => setHovered(null)}
                className={dimmed ? "cursor-pointer" : "cursor-pointer"}
                style={{ opacity: dimmed ? 0.2 : 1 }}
                role="button"
                tabIndex={dimmed ? -1 : 0}
                onKeyDown={(e) => e.key === "Enter" && selectSection(sec)}
              >
                <path
                  d={sec.path}
                  fill={
                    isSelected
                      ? "rgba(15, 23, 42, 0.35)"
                      : isHovered
                        ? cat.fill.replace("0.55", "0.75")
                        : cat.fill
                  }
                  stroke={isSelected ? "#4ade80" : isHovered ? "#fff" : cat.stroke}
                  strokeWidth={isSelected ? 0.6 : 0.25}
                  strokeLinejoin="round"
                />
                {!isZoomed && isHovered && (
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

          <AnimatePresence>
            {selected && selectedMeta && (
              <motion.g
                key={`seats-${selected.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.25 }}
              >
                {placedSeats.map((seat) => {
                  const active = hoveredSeat === seat.id;
                  const canOpen = selectedMeta.hasPanorama;
                  return (
                    <g
                      key={seat.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openSeat(seat.id);
                      }}
                      onMouseEnter={() => setHoveredSeat(seat.id)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      className={canOpen ? "cursor-pointer" : "cursor-not-allowed"}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && openSeat(seat.id)}
                    >
                      <circle
                        cx={seat.cx}
                        cy={seat.cy}
                        r={seat.r}
                        fill={
                          active
                            ? "rgba(74, 222, 128, 0.9)"
                            : canOpen
                              ? "rgba(74, 222, 128, 0.42)"
                              : "rgba(100, 116, 139, 0.5)"
                        }
                        stroke={active ? "#fff" : "rgba(74, 222, 128, 0.75)"}
                        strokeWidth={0.12}
                      />
                      {(active || seat.r > 0.38) && (
                        <text
                          x={seat.cx}
                          y={seat.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={active ? "#0f172a" : "#ecfdf5"}
                          fontSize={seat.r * 0.85}
                          fontWeight="600"
                          pointerEvents="none"
                        >
                          {seat.number}
                        </text>
                      )}
                      <title>{seat.label}</title>
                    </g>
                  );
                })}
              </motion.g>
            )}
          </AnimatePresence>
          </motion.svg>
        </div>
      </motion.div>

      <p className="mt-3 text-center text-xs text-slate-500">
        {selected ? (
          <>
            <span className="text-emerald-300/80">Pitch</span> is toward the center · Esc or ← Full map to zoom out
          </>
        ) : (
          <>
            Based on{" "}
            <a
              href="https://ticket-compare.com/stadiums/metlife-stadium/seating-plan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300/80 hover:text-emerald-200"
            >
              Ticket-Compare MetLife seating plan
            </a>
            {" "}· tap a section to zoom in and pick a seat
          </>
        )}
      </p>
    </motion.div>
  );
}
