"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/tournament", label: "Tournament" },
  { href: "/#matches", label: "Matches" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isImmersive = pathname.includes("/seat-view");

  if (isImmersive) return null;

  return (
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
        <ul className="flex items-center gap-6">
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
        </ul>
      </nav>
    </motion.header>
  );
}
