"use client";

import { useParams } from "next/navigation";
import SeatViewer from "@/components/SeatViewer";
import { getSeatView, getSection, getStadium } from "@/lib/data";

function formatSeatLabel(seatId: string) {
  const m = /^r(\d+)-s(\d+)$/.exec(seatId);
  if (!m) return seatId;
  return `Row ${m[1]}, Seat ${m[2]}`;
}

export default function SeatViewPage() {
  const params = useParams();
  const stadiumId = params.stadium as string;
  const sectionId = params.section as string;
  const seatId = params.seat as string;

  const stadium = getStadium(stadiumId);
  const section = getSection(stadiumId, sectionId);
  const seatView = getSeatView(stadiumId, sectionId, seatId);

  if (!stadium || !section || !seatView) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-slate-400">
        Seat view not found.
      </div>
    );
  }

  return (
    <SeatViewer
      key={`${stadiumId}-${sectionId}-${seatId}`}
      panoramaUrl={seatView.panorama}
      sectionLabel={`${section.label} · ${formatSeatLabel(seatId)}`}
      description={seatView.description}
      stadiumName={stadium.name}
      defaultYaw={seatView.defaultYaw}
      defaultPitch={seatView.defaultPitch}
    />
  );
}
