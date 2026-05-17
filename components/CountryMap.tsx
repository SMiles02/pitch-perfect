"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import { motion } from "framer-motion";

interface CountryMapProps {
  coordinates: [number, number];
  name: string;
}

export default function CountryMap({ coordinates, name }: CountryMapProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950/50">
        <div className="text-center">
          <p className="text-xs text-slate-500">Map preview</p>
          <p className="mt-1 text-xs text-emerald-300/80">{name}</p>
          <p className="mt-0.5 text-[10px] text-slate-600">
            {coordinates[1].toFixed(2)}, {coordinates[0].toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{
        longitude: coordinates[0],
        latitude: coordinates[1],
        zoom: 4,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      interactive={false}
    >
      <Marker longitude={coordinates[0]} latitude={coordinates[1]} anchor="center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-400 shadow-lg shadow-emerald-950/50"
        />
      </Marker>
    </Map>
  );
}
