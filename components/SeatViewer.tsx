"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Viewer } from "@photo-sphere-viewer/core";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";

interface SeatViewerProps {
  panoramaUrl: string;
  sectionLabel: string;
  description?: string;
  stadiumName: string;
  defaultYaw?: number;
  defaultPitch?: number;
}

export default function SeatViewer({
  panoramaUrl,
  sectionLabel,
  description,
  stadiumName,
  defaultYaw = 0,
  defaultPitch = 0,
}: SeatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const router = useRouter();
  const [showHint, setShowHint] = useState(true);
  const [gyroActive, setGyroActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    const timer = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: panoramaUrl,
      defaultYaw,
      defaultPitch,
      navbar: false,
      touchmoveTwoFingers: true,
      mousewheel: true,
      plugins: [
        [
          GyroscopePlugin,
          {
            touchmove: true,
            absolutePosition: true,
          },
        ],
      ],
    });

    viewerRef.current = viewer;

    viewer.addEventListener("ready", () => {
      const gyro = viewer.getPlugin<GyroscopePlugin>(GyroscopePlugin);
      if (gyro && mobile) {
        gyro
          .start()
          .then(() => setGyroActive(true))
          .catch(() => setGyroActive(false));
      }
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [panoramaUrl, defaultYaw, defaultPitch]);

  const enableGyro = async () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    try {
      const gyro = viewer.getPlugin<GyroscopePlugin>(GyroscopePlugin);
      if (gyro) {
        await gyro.start();
        setGyroActive(true);
        setShowHint(false);
      }
    } catch {
      setGyroActive(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    router.back();
  };

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 z-10">
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pointer-events-auto absolute left-4 right-4 top-8 mx-auto max-w-md"
            >
              <div className="rounded-2xl glass px-6 py-4 text-center glow-accent">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="mx-auto mb-3 text-3xl"
                >
                  📱
                </motion.div>
                <p className="text-sm font-semibold text-white">
                  Rotate your phone to explore your seat view
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isMobile
                    ? gyroActive
                      ? "Gyroscope active — move your device"
                      : "Tap below to enable motion controls"
                    : "Drag to look around · Use mobile for gyroscope"}
                </p>
                {isMobile && !gyroActive && (
                  <button
                    type="button"
                    onClick={enableGyro}
                    className="mt-3 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black"
                  >
                    Enable Gyroscope
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-auto absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
          <p className="text-xs uppercase tracking-widest text-emerald-400">{stadiumName}</p>
          <h2 className="text-xl font-bold text-white">{sectionLabel}</h2>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>

        <button
          type="button"
          onClick={exitFullscreen}
          className="pointer-events-auto absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full glass text-white transition-colors hover:bg-white/10"
          aria-label="Close viewer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
