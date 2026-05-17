"use client";

import { useState } from "react";
import { teamFlag } from "@/lib/flags";
import { getCountryInfo } from "@/lib/countries";
import CountryModal from "./CountryModal";

interface TeamNameProps {
  name: string;
  label?: string;
  className?: string;
  showFlag?: boolean;
}

export default function TeamName({
  name,
  label,
  className = "",
  showFlag = true,
}: TeamNameProps) {
  const [open, setOpen] = useState(false);
  const flag = showFlag ? teamFlag(name) : "";
  const display = label ?? name;
  const hasInfo = !!getCountryInfo(name);

  if (!hasInfo) {
    return (
      <span className={className}>
        {flag ? `${flag} ` : ""}{display}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline cursor-pointer border-b border-transparent text-left transition-colors hover:border-emerald-300/40 hover:text-emerald-200 ${className}`}
      >
        {flag ? `${flag} ` : ""}{display}
      </button>
      <CountryModal open={open} team={name} onClose={() => setOpen(false)} />
    </>
  );
}
