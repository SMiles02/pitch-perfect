# Pitch Perfect

**A FIFA World Cup 2026 matchday planner that connects fixtures, travel, saved trips, AI guidance, stadium maps, and seat previews in one demo-ready experience.**

> Know the match, the route, the cost, and the view before you commit to the trip.

## Overview

Pitch Perfect is built for fans trying to turn the 2026 World Cup fixture list into a realistic trip. Instead of jumping between schedules, maps, travel sites, stadium charts, and scattered advice, the app gives each match a planning workspace: compare travel options, ask an AI matchday concierge, save fixtures into a trip, explore the tournament path, and preview stadium sections before buying tickets.

The current version is designed as a polished hackathon prototype. It uses local tournament, stadium, travel, and seat-view data so the end-to-end flow is reliable during a live demo, with optional Mapbox and OpenAI integrations for richer maps and live AI responses.

## What It Does

**Fixture discovery:** Browse the 104-match World Cup 2026 schedule, search by team, group, city, stadium, or stage, and open a dedicated page for any fixture.

**Personal trip planning:** Add matches to "My Trip", keep a saved departure city, estimate route costs, view itinerary legs, and see trip stops on a map.

**Favorite teams:** Mark favorite national teams from the navbar drawer, bring their fixtures to the top of the home page, and filter the schedule down to the teams you care about.

**Country context:** Click supported team names to open country information, flag visuals, and a lightweight map context panel.

**AI matchday concierge:** Ask practical questions about where to stay, when to arrive, stadium transport, seat selection, or photo-friendly sections. Without an API key, the app still returns deterministic demo answers based on the same match context.

**Interactive stadium planning:** Explore venue pages, choose stadium sections, pick row/seat options, launch immersive panorama previews, and use mobile motion controls for supported seat views.

**Tournament hub:** Review all group tables and follow the knockout bracket from the round of 32 through the final, with bracket-aware labels for unresolved teams.

## Demo Highlights

- **Start on the home page** and search for a team, host city, or group.
- **Open a match page** to show date, venue, travel suggestions, map, AI chat, and stadium planning entry points.
- **Save the match to My Trip** and point out the navbar counter updating immediately.
- **Open the favorite teams drawer** to select a country, then return to the schedule and use the "My Teams" filter.
- **Ask Match AI** a question such as "Should I stay near the stadium or downtown?" or "Which seats are best for photos?"
- **Open a MetLife stadium section**, select a seat, and use the side panel to launch the 360-degree preview or ticket link.
- **Visit My Trip** to show the saved itinerary, route map, origin selector, estimated costs, and route optimization toggle.
- **Finish in Tournament** to show the full group and knockout view connected back into the planning flow.

## Core Experiences

### Home And Fixture Search

- Search across teams, groups, stadiums, cities, match IDs, and knockout labels.
- Favorite-team sorting brings personally relevant fixtures forward.
- Cards show date, venue, favorite status, and fast add-to-trip controls.
- Match links preserve the core planning flow from discovery to detail.

### Match Detail Pages

- Shows formatted participant names, including bracket placeholders for unresolved knockout matches.
- Includes a one-click trip save button.
- Displays travel recommendations for the selected origin city.
- Embeds the AI concierge with match, stadium, travel, transport, hotel, and section context.
- Links into stadium and seat-view flows for the venue.

### My Trip

- Saves selected match IDs in browser local storage.
- Shares the same saved departure city across travel panels, AI chat, and trip planning.
- Sorts matches chronologically by default.
- Includes an optimization toggle for same-day route ordering.
- Estimates flight legs, hotel nights, and total trip cost.
- Shows origin and destination stops in an interactive route map.
- Lets users remove matches or clear the whole trip.

### Favorite Teams And Country Details

- The navbar heart opens a drawer for selecting favorite teams.
- Favorite teams are stored locally and can be cleared at any time.
- Supported team names render with flags and clickable country details.
- Country modals add richer context without leaving the planning flow.

### AI Matchday Concierge

The `app/api/match-ai` route builds a compact planning context for the selected fixture and origin city, including:

- match and stadium metadata
- saved departure city
- sample flight options
- hotel suggestions
- stadium transport options
- available section and ticket tier signals

If `OPENAI_API_KEY` is configured, the route calls OpenAI Chat Completions. If not, it uses local context-aware fallback answers so the demo still feels complete and does not depend on network or API availability.

### Stadium And Seat Preview

- MetLife includes a detailed section layout with category-based seating areas.
- Sections can be opened from the stadium map and expanded into row/seat options.
- Seat selection opens a side panel with panorama and ticket actions.
- Panorama pages use Photo Sphere Viewer with desktop drag controls.
- Mobile users can enable gyroscope controls for a physical "look around" demo.
- Current panorama assets are prototype-friendly references for demonstrating the flow.

## Data Model

The app intentionally uses local data for hackathon reliability:

- `data/matches.json` - 104-match tournament schedule.
- `data/stadiums.json` - venue metadata, coordinates, and basic sections.
- `data/layouts/metlife-sections.json` - detailed MetLife section geometry and categories.
- `data/seatviews.json` - panorama asset mapping and default camera angles.
- `lib/travel.ts` - deterministic flight, hotel, transport, pricing, and route estimates.
- `lib/tournament.ts` - group and knockout participant helpers.
- `lib/trip-context.tsx` - local saved trip, favorite teams, and origin city state.
- `lib/trip-utils.ts` - itinerary, cost, and route optimization helpers.

## Tech Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **UI:** React 19 and Tailwind CSS
- **Animation:** Framer Motion
- **Maps:** Mapbox GL and React Map GL
- **AI:** Next.js API route with optional OpenAI Chat Completions
- **Panoramas:** Photo Sphere Viewer
- **Motion controls:** Photo Sphere Viewer Gyroscope Plugin
- **State:** React context plus browser local storage for demo persistence

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Recommended `.env.local` values:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk_your_mapbox_token
OPENAI_API_KEY=sk_your_openai_key
OPENAI_MODEL=gpt-4o-mini
```

`NEXT_PUBLIC_MAPBOX_TOKEN` enables the interactive map views. `OPENAI_API_KEY` enables live AI answers. The app still runs without OpenAI by using built-in demo responses.

## Scripts

```bash
npm run dev                 # Start the development server
npm run build               # Create a production build
npm run start               # Serve the production build
npm run lint                # Run ESLint
npm run panoramas:metlife   # Regenerate MetLife panorama assets
```

## Project Structure

```text
app/                     Next.js routes, pages, and API endpoints
components/              UI, cards, maps, drawers, travel panels, and viewers
data/                    Local fixture, stadium, layout, and seat-view data
lib/                     Data access, travel logic, trip state, and helpers
public/panoramas/        Panorama assets used by the seat preview flow
scripts/                 Utility scripts for panorama generation
```

## Demo Notes

- The travel, pricing, hotel, and transport data is deterministic sample data built for a stable demo.
- Panorama imagery is prototype material. A production deployment should use licensed venue-approved 360-degree equirectangular assets.
- Gyroscope controls work best on a physical mobile device over HTTPS or localhost.
- Maps need a valid Mapbox public token for the best presentation.
- Saved trips and favorite teams are stored locally in the browser, not in a backend account.

## Roadmap

- Add live ticket availability and pricing integrations.
- Replace sample travel estimates with live flight, hotel, and transit data.
- Expand licensed panorama coverage across every host venue.
- Add shareable trip plans and account-based persistence.
- Improve accessibility coverage for keyboard users on stadium maps.
- Add richer country, visa, and travel advisory context for international fans.

## Built For

Pitch Perfect was built for fans planning the biggest football trip of 2026, and for a hackathon demo that needs to tell that story clearly from the first click.
