"use client";

import { useParams } from "next/navigation";
import SeatViewer from "@/components/SeatViewer";
import { getStadium, getSeatView } from "@/lib/data";

export default function SeatViewPage() {
  const params = useParams();
  const stadiumId = params.stadium as string;
  const sectionId = params.section as string;

  const stadium = getStadium(stadiumId);
  const seatView = getSeatView(stadiumId, sectionId);
  const section = stadium?.sections.find((s) => s.id === sectionId);

  if (!stadium || !seatView || !section) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-slate-400">
        Seat view not found.
      </div>
    );
  }

  return (
    <SeatViewer
      key={`${stadiumId}-${sectionId}`}
      panoramaUrl={seatView.panorama}
      sectionLabel={section.label}
      description={seatView.description}
      stadiumName={stadium.name}
      defaultYaw={seatView.defaultYaw}
      defaultPitch={seatView.defaultPitch}
    />
  );
}
