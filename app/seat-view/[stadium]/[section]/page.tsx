"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

function RedirectContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const stadiumId = params.stadium as string;
  const sectionId = params.section as string;
  const match = searchParams.get("match");

  useEffect(() => {
    const query = new URLSearchParams();
    query.set("section", sectionId);
    if (match) query.set("match", match);
    router.replace(`/stadium/${stadiumId}?${query.toString()}`);
  }, [stadiumId, sectionId, match, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-slate-500">
      Opening section…
    </div>
  );
}

export default function SectionSeatViewRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-slate-500">
          Loading…
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
