"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { LayerProps, MapRef } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";

interface CityStop {
  label: string;
  coordinates: [number, number];
  matchCount: number;
}

interface TripMapViewProps {
  originCoords: [number, number];
  originLabel: string;
  stops: CityStop[];
  className?: string;
}

const routeLayer: LayerProps = {
  id: "trip-route",
  type: "line",
  paint: {
    "line-color": "#4ade80",
    "line-width": 2.5,
    "line-opacity": 0.8,
  },
};

const returnLayer: LayerProps = {
  id: "trip-return",
  type: "line",
  paint: {
    "line-color": "#4ade80",
    "line-width": 2,
    "line-opacity": 0.35,
    "line-dasharray": [4, 4],
  },
};

export default function TripMapView({
  originCoords,
  originLabel,
  stops,
  className = "",
}: TripMapViewProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<MapRef>(null);

  const routeGeoJson = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: [originCoords, ...stops.map((s) => s.coordinates)],
      },
    }),
    [originCoords, stops],
  );

  const returnGeoJson = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates:
          stops.length > 0
            ? [stops[stops.length - 1].coordinates, originCoords]
            : [],
      },
    }),
    [originCoords, stops],
  );

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || stops.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(originCoords);
    stops.forEach((s) => bounds.extend(s.coordinates));

    map.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 8 });
  }, [originCoords, stops]);

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-500/20 bg-slate-950/50 ${className}`}
      >
        <div className="p-6 text-center">
          <p className="mb-2 text-sm font-medium text-slate-300">Trip Map</p>
          <p className="text-xs text-slate-500">
            Add <code className="text-emerald-300">NEXT_PUBLIC_MAPBOX_TOKEN</code> to .env.local
          </p>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-emerald-300/90">{originLabel}</p>
            {stops.map((s, i) => (
              <p key={i} className="text-xs text-slate-400">
                → {s.label} ({s.matchCount} {s.matchCount === 1 ? "match" : "matches"})
              </p>
            ))}
            <p className="text-xs text-slate-500">→ {originLabel}</p>
          </div>
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
          longitude: stops[0]?.coordinates[0] ?? originCoords[0],
          latitude: stops[0]?.coordinates[1] ?? originCoords[1],
          zoom: 3,
        }}
        style={{ width: "100%", height: "100%", minHeight: 400 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <Source id="trip-route-source" type="geojson" data={routeGeoJson}>
          <Layer {...routeLayer} />
        </Source>
        <Source id="trip-return-source" type="geojson" data={returnGeoJson}>
          <Layer {...returnLayer} />
        </Source>

        <Marker longitude={originCoords[0]} latitude={originCoords[1]} anchor="bottom">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className="rounded-full bg-sky-700 px-2 py-0.5 text-[10px] font-semibold text-white">
              {originLabel.toUpperCase()}
            </span>
            <span className="mt-1 h-3 w-3 rounded-full border-2 border-white bg-sky-400 shadow-lg shadow-sky-950/50" />
          </motion.div>
        </Marker>

        {stops.map((stop, i) => (
          <Marker
            key={`${stop.label}-${i}`}
            longitude={stop.coordinates[0]}
            latitude={stop.coordinates[1]}
            anchor="bottom"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col items-center"
            >
              <span className="rounded-full bg-emerald-300 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                {i + 1}
              </span>
              <span className="mt-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-lg shadow-emerald-950/50" />
            </motion.div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
