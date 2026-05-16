"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { LayerProps, MapRef } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";

interface StadiumMapViewProps {
  originCoords: [number, number];
  originLabel: string;
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
  originCoords,
  originLabel,
  stadiumCoords,
  hotelCoords,
  className = "",
}: StadiumMapViewProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef>(null);

  const routeGeoJson = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: [originCoords, stadiumCoords],
      },
    }),
    [originCoords, stadiumCoords],
  );

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(originCoords);
    bounds.extend(stadiumCoords);
    hotelCoords.forEach((coords) => bounds.extend(coords));

    map.fitBounds(bounds, { padding: 56, duration: 800, maxZoom: 10 });
  }, [originCoords, stadiumCoords, hotelCoords]);

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/50 ${className}`}
      >
        <div className="p-6 text-center">
          <p className="mb-2 text-sm font-medium text-slate-300">Map Preview</p>
          <p className="text-xs text-slate-500">
            Add <code className="text-emerald-400">NEXT_PUBLIC_MAPBOX_TOKEN</code> to .env.local
          </p>
          <p className="mt-4 text-xs text-emerald-400/90">
            {originLabel} → Stadium
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {originCoords[1].toFixed(2)}, {originCoords[0].toFixed(2)} →{" "}
            {stadiumCoords[1].toFixed(2)}, {stadiumCoords[0].toFixed(2)}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={{
          longitude: stadiumCoords[0],
          latitude: stadiumCoords[1],
          zoom: 4,
        }}
        style={{ width: "100%", height: "100%", minHeight: 280 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <Source id="route-source" type="geojson" data={routeGeoJson}>
          <Layer {...routeLayer} />
        </Source>
        <Marker longitude={originCoords[0]} latitude={originCoords[1]} anchor="bottom">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {originLabel.toUpperCase()}
            </span>
            <span className="text-2xl">✈️</span>
          </motion.div>
        </Marker>
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
