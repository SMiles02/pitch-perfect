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
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

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
    setSelectedSeatId(null);
    updateSectionParam(sec.id);
  };

  const clearSection = useCallback(() => {
    setSelected(null);
    setHoveredSeat(null);
    setSelectedSeatId(null);
    updateSectionParam(null);
  }, [updateSectionParam]);

  const selectedSeat = useMemo(
    () => (selectedSeatId ? placedSeats.find((s) => s.id === selectedSeatId) ?? null : null),
    [placedSeats, selectedSeatId]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedSeatId) setSelectedSeatId(null);
      else if (selected) clearSection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, selectedSeatId, clearSection]);

  const selectSeat = (seatId: string) => {
    setSelectedSeatId((prev) => (prev === seatId ? null : seatId));
  };

  const openPanorama = () => {
    if (!selected || !selectedSeatId || !selectedMeta?.hasPanorama) return;
    const base = `/seat-view/metlife/${selected.id}/${selectedSeatId}`;
    router.push(matchId ? `${base}?match=${matchId}` : base);
  };

  const ticketUrl =
    "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026/tickets";

  return (
    <motion.div
      className={`relative mx-auto w-full ${selectedSeat ? "max-w-6xl" : "max-w-4xl"}`}
    >
      <motion.div
        layout
        className={`flex gap-4 ${selectedSeat ? "flex-col lg:flex-row lg:items-stretch" : ""}`}
      >
        <motion.div layout className={`min-w-0 ${selectedSeat ? "flex-1" : "w-full"}`}>
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
                  {selectedMeta.price} · {placedSeats.length} seats · tap a seat for options
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
                  const isPicked = selectedSeatId === seat.id;
                  const canOpen = selectedMeta.hasPanorama;
                  return (
                    <g
                      key={seat.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectSeat(seat.id);
                      }}
                      onMouseEnter={() => setHoveredSeat(seat.id)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && selectSeat(seat.id)}
                    >
                      <circle
                        cx={seat.cx}
                        cy={seat.cy}
                        r={seat.r}
                        fill={
                          isPicked
                            ? "#4ade80"
                            : active
                              ? "rgba(74, 222, 128, 0.9)"
                              : canOpen
                                ? "rgba(74, 222, 128, 0.42)"
                                : "rgba(100, 116, 139, 0.5)"
                        }
                        stroke={isPicked || active ? "#fff" : "rgba(74, 222, 128, 0.75)"}
                        strokeWidth={isPicked ? 0.18 : 0.12}
                      />
                      {(active || seat.r > 0.38) && (
                        <text
                          x={seat.cx}
                          y={seat.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isPicked || active ? "#0f172a" : "#ecfdf5"}
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
        </motion.div>

        <AnimatePresence>
          {selectedSeat && selected && selectedMeta && (
            <motion.aside
              key={`seat-panel-${selectedSeat.id}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="flex w-full shrink-0 flex-col rounded-xl border border-slate-500/15 bg-slate-950/90 lg:w-72"
            >
              <motion.div layout className="flex items-start justify-between gap-2 border-b border-slate-500/15 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-300/80">
                    Section {selected.id}
                  </p>
                  <p className="text-sm font-semibold text-white">{selectedSeat.label}</p>
                  <p className="text-xs text-slate-400">
                    {metlifeLayout.categories[selected.category].label} · {selectedMeta.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSeatId(null)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/80 hover:text-white"
                  aria-label="Close seat panel"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                {selectedMeta.hasPanorama ? (
                  <button
                    type="button"
                    onClick={openPanorama}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Open 360° view
                  </button>
                ) : (
                  <p className="rounded-lg border border-slate-500/15 bg-slate-900/50 px-3 py-2 text-xs text-slate-500">
                    No panorama available for this section yet.
                  </p>
                )}

                <a
                  href={ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-500/25 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-emerald-300/40 hover:bg-slate-800/80"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  Buy tickets
                  <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                <p className="mt-auto text-center text-[10px] text-slate-500">
                  Esc to close · Opens FIFA ticket portal
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-3 text-center text-xs text-slate-500">
        {selected ? (
          <>
            <span className="text-emerald-300/80">Pitch</span> is toward the center · tap a seat for options · Esc to close panel
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
