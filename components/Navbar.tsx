"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTripContext } from "@/lib/trip-context";
import FavoriteTeamsDrawer from "./FavoriteTeamsDrawer";

const links = [
  { href: "/", label: "Home" },
  { href: "/tournament", label: "Tournament" },
  { href: "/#matches", label: "Matches" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isImmersive = pathname.includes("/seat-view");
  const { tripMatchIds, favoriteTeams } = useTripContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isImmersive) return null;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-slate-500/15 bg-slate-950/75 px-6 py-3 shadow-xl shadow-slate-950/20 backdrop-blur">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              Pitch<span className="text-emerald-300">Perfect</span>
            </span>
            <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200 sm:inline">
              WC 2026
            </span>
          </Link>
          <ul className="flex items-center gap-4 sm:gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-400 transition-colors hover:text-slate-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/my-trip"
                className="relative flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
              >
                My Trip
                {tripMatchIds.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-[10px] font-bold text-slate-950">
                    {tripMatchIds.length}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className={`relative flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                  favoriteTeams.length > 0
                    ? "border-emerald-300/25 text-emerald-300"
                    : "border-slate-500/20 text-slate-400 hover:text-slate-100"
                }`}
                title="Favorite teams"
              >
                <svg className="h-4 w-4" fill={favoriteTeams.length > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </motion.header>
      <FavoriteTeamsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
