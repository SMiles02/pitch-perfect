"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { LayerProps } from "react-map-gl/mapbox";

interface StadiumMapViewProps {
  stadiumCoords: [number, number];
  hotelCoords: [number, number][];
  className?: string;
}

const routeLayer: LayerProps = {
  id: "route",
  type: "line",
  paint: {
    "line-color": "#00ff88",
    "line-width": 3,
    "line-opacity": 0.8,
  },
};

export default function StadiumMapView({
  stadiumCoords,
  hotelCoords,
  className = "",
}: StadiumMapViewProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const routeGeoJson = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: hotelCoords.length
          ? [hotelCoords[0], stadiumCoords]
          : [stadiumCoords, stadiumCoords],
      },
    }),
    [hotelCoords, stadiumCoords]
  );

  if (!token) {
    return (
      <div
        className={`flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/50 ${className}`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 text-center"
        >
          <p className="mb-2 text-sm font-medium text-slate-300">Map Preview</p>
          <p className="text-xs text-slate-500">
            Add <code className="text-emerald-400">NEXT_PUBLIC_MAPBOX_TOKEN</code> to .env.local
          </p>
          <p className="mt-4 text-xs text-slate-600">
            Stadium · {stadiumCoords[1].toFixed(2)}, {stadiumCoords[0].toFixed(2)}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: stadiumCoords[0],
          latitude: stadiumCoords[1],
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%", minHeight: 280 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <Source id="route-source" type="geojson" data={routeGeoJson}>
          <Layer {...routeLayer} />
        </Source>
        <Marker longitude={stadiumCoords[0]} latitude={stadiumCoords[1]} anchor="bottom">
          <div className="flex flex-col items-center">
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-black">
              STADIUM
            </span>
            <span className="text-2xl">🏟️</span>
          </div>
        </Marker>
        {hotelCoords.map((coords, i) => (
          <Marker key={i} longitude={coords[0]} latitude={coords[1]} anchor="bottom">
            <span className="text-xl">🏨</span>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
