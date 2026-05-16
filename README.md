# Pitch Perfect

Immersive FIFA World Cup 2026 travel companion — preview your stadium seat by rotating your phone, plan mock flights and hotels, and explore matches.

## Quick start

```bash
npm install
cp .env.example .env.local
# Add your Mapbox token to .env.local (optional — map shows fallback without it)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For the gyroscope demo, use a **mobile device** over HTTPS (or localhost).

## Demo flow

1. **Home** — cinematic hero + match cards
2. **Plan My Trip** — flights, hotels, Mapbox routes
3. **Select Stadium Section** — interactive SVG seating map
4. **Seat View** — fullscreen Photo Sphere Viewer + gyroscope

## Tech stack

- Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion
- Mapbox GL (`react-map-gl`)
- Photo Sphere Viewer + Gyroscope Plugin

## Panoramas

**MetLife Stadium** uses real match photos from Wikimedia Commons (see `public/panoramas/metlife/ATTRIBUTION.txt`), converted to equirectangular 2:1 for the viewer:

```bash
npm run panoramas:metlife
```

Replace or add source images in `public/panoramas/metlife/`, then re-run the script. For even better results, drop in true 360° equirectangular stadium photos (2:1 aspect) per section.

**SoFi** still uses placeholder assets — swap `public/panoramas/sofi/` when you have stadium images.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
