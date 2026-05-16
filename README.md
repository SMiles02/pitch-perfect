# Pitch Perfect

**Immersive FIFA World Cup 2026 Travel and Seat Planning**

World Cup 2026 Next.js TypeScript Tailwind Mapbox Photo Sphere Viewer

> _"Know the matchday view before you book the trip."_

## Challenge

World Cup travel is expensive, emotional, and logistically messy. Fans often have to choose tickets, flights, hotels, and stadium sections without understanding how the whole trip fits together.

## Solution

Pitch Perfect brings fixtures, travel planning, stadium maps, and seat-level panoramas into one interactive experience. Start with a match, compare sample flights and hotels, explore the tournament path, choose a stadium section, and preview the view from the seat before committing to the trip.

## Key Features

### Fixture Finder

- **World Cup 2026 matches** - Browse the full tournament schedule from match 1 through the final
- **Fast search** - Filter by team, city, stadium, or group
- **Match detail pages** - Open a fixture to view date, time, venue, travel notes, and seat-preview links
- **Knockout placeholders** - Later-stage fixtures show bracket-aware labels instead of fake teams

### Trip Planning

- **Origin city selector** - Pick a departure city and keep the preference in local storage
- **Sample flights** - Compare mock flight options for each host city
- **Hotel suggestions** - See sample hotel stays near the stadium destination
- **Stadium transport** - Compare estimated ways to get from the city to the venue
- **Mapbox route view** - Visualize the origin, stadium, and hotel locations on an interactive map

### Seat Preview

- **Interactive stadium maps** - Select stadium sections from a visual seating map
- **Detailed seating layouts** - Explore categorized stadium sections with realistic ticket tiers
- **Seat picker** - Drill down from section to row and seat
- **Fullscreen panoramas** - Open seat-level views with Photo Sphere Viewer
- **Mobile motion controls** - Move your phone to look around supported panoramas with gyroscope controls

### Tournament View

- **Groups and tables** - Review all 12 group-stage tables
- **Knockout bracket** - Follow the path from match 73 to the final
- **Linked fixtures** - Tournament entries connect back into the same match planning flow

## Demo Flow

1. **Home** - Cinematic landing page with fixture search
2. **Choose a Match** - Open travel and stadium planning for a fixture
3. **Plan the Trip** - Compare sample flights, hotels, transport, and map locations
4. **Pick a Section** - Use the stadium seating map to select a section
5. **Preview the Seat** - Open a fullscreen panorama and move your phone to look around
6. **Explore the Tournament** - Switch to groups and bracket views for the broader path

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Optional: add a Mapbox token for the interactive map
# NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Important:**

- The map works best with a Mapbox public token in `.env.local`.
- Seat panoramas work on desktop with click-and-drag controls.
- For the gyroscope seat demo, use a physical mobile device over HTTPS or localhost.

## Tech Stack

### Frontend

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Maps:** Mapbox GL and React Map GL
- **Panoramas:** Photo Sphere Viewer
- **Motion Controls:** Photo Sphere Viewer Gyroscope Plugin

### Data and Assets

- **Fixtures:** Local JSON match schedule
- **Stadiums:** Local JSON venue and section metadata
- **Travel:** Deterministic mock travel data from local helpers
- **Stadium Layouts:** Detailed section geometry and category mapping
- **Panoramas:** Public stadium panorama assets

## Available Experiences

**104 Matches | 16 Stadiums | Groups + Knockout | Seat-Level Preview**

- **Fixture Search** - Search the tournament by team, city, stadium, or group
- **Match Planning** - View travel notes, maps, flights, hotels, and stadium access
- **Tournament Hub** - Browse group tables and knockout bracket paths
- **Stadium Seat Preview** - Pick sections and launch panorama-style seat views across venues

## Panoramas

The panorama experience is designed to give fans a fast, visual sense of the view from different stadium sections. Current assets are prototype reference images processed into 2:1 viewer-friendly formats so the seat preview flow can be demonstrated across venues.

For production, these previews should be backed by licensed, venue-approved 360-degree equirectangular imagery with a 2:1 aspect ratio.

## Scripts

```bash
npm run dev                 # Start the development server
npm run build               # Create a production build
npm run start               # Serve the production build
npm run lint                # Run ESLint
```

## Project Structure

```text
app/                     Next.js routes and pages
components/              Reusable UI, maps, travel cards, stadium views
data/                    Match, stadium, section, and seat-view JSON
lib/                     Data access, travel generation, tournament helpers
public/panoramas/        Stadium panorama source and generated assets
scripts/                 Panorama generation scripts
```

## Roadmap

### Completed

- Cinematic landing page
- Full fixture search
- Match detail pages
- Sample flight and hotel planning
- Mapbox-powered travel map
- Group-stage tables
- Knockout bracket view
- Interactive stadium section selection
- Seat picker flow
- Fullscreen panorama viewer
- Mobile gyroscope controls
- Detailed stadium layout and panorama mapping

### Next

- Replace placeholder stadium panoramas with real venue imagery
- Add live pricing and availability integrations
- Expand travel data beyond deterministic mock options
- Add account-based saved trips
- Add shareable trip plans
- Add accessibility and keyboard refinements for stadium maps

## Built By

Built for football fans planning the biggest trip of 2026.
