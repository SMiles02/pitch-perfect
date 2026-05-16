import { NextRequest, NextResponse } from "next/server";
import { getMatch, getStadium, type StadiumSection } from "@/lib/data";
import {
  DEFAULT_ORIGIN_CITY_ID,
  getOriginCity,
  getTravelData,
  ORIGIN_CITIES,
} from "@/lib/travel";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

function buildSectionSummary(sections: StadiumSection[]) {
  if (sections.length === 0) return "No section metadata available.";

  return sections
    .slice(0, 6)
    .map(
      (section) =>
        `${section.label}: ${section.tier}, ${section.price}, visibility ${section.visibility}/10, atmosphere ${section.atmosphere}/10`,
    )
    .join("; ");
}

function buildFallbackAnswer(question: string, context: NonNullable<ReturnType<typeof buildMatchContext>>) {
  const normalizedQuestion = question.toLowerCase();
  const [bestFlight] = context.travel.flights;
  const [closestHotel, downtownHotel] = context.travel.hotels;
  const [publicTransport, rideshare] = context.travel.transport;

  if (normalizedQuestion.includes("downtown") || normalizedQuestion.includes("near the stadium")) {
    return `For ${context.matchLabel}, I would stay near the stadium if your priority is a low-stress matchday: ${closestHotel.name} is ${closestHotel.distance} and keeps the commute simple. If you want restaurants and a livelier trip outside the game, ${downtownHotel.name} is the better base, but leave extra time before kickoff.`;
  }

  if (
    normalizedQuestion.includes("safe") ||
    normalizedQuestion.includes("route") ||
    normalizedQuestion.includes("after the match")
  ) {
    return `For the safest post-match plan, use the official high-volume route first: ${publicTransport.mode} is listed at ${publicTransport.duration} and ${publicTransport.description.toLowerCase()}. Keep ${rideshare.mode.toLowerCase()} as a backup after crowds thin out, since pickup zones can be congested right after full time.`;
  }

  if (
    normalizedQuestion.includes("seat") ||
    normalizedQuestion.includes("section") ||
    normalizedQuestion.includes("photo") ||
    normalizedQuestion.includes("view")
  ) {
    return `For photos, prioritize sections with high visibility and enough elevation to see the shape of play. In this stadium, the strongest options from the available section data are ${context.sectionSummary}. Open the seat preview before booking so you can check railings, angle, and how much of the pitch fills the frame.`;
  }

  if (normalizedQuestion.includes("flight") || normalizedQuestion.includes("arrive")) {
    return `From ${context.origin.name}, the cleanest sample flight is ${bestFlight.airline} on ${bestFlight.route}, departing ${bestFlight.departure} and arriving ${bestFlight.arrival}. I would arrive the day before ${context.dateLabel} so delays do not put the match at risk.`;
  }

  return `For ${context.matchLabel} at ${context.stadium.name}, I would build the plan around three decisions: arrive from ${context.origin.name} the day before, stay based on whether you value a short stadium commute or a better city base, and preview the seat before committing. The best sample flight is ${bestFlight.airline} (${bestFlight.price}), and the simplest stadium transfer is ${publicTransport.mode} at about ${publicTransport.duration}.`;
}

function buildMatchContext(matchId: number, originCityId: string) {
  const match = getMatch(matchId);
  const stadium = match ? getStadium(match.stadiumId) : undefined;

  if (!match || !stadium) return null;

  const origin = ORIGIN_CITIES.some((city) => city.id === originCityId)
    ? getOriginCity(originCityId)
    : getOriginCity(DEFAULT_ORIGIN_CITY_ID);
  const travel = getTravelData(match.stadiumId, match.city, origin.id, match.date, stadium.coordinates);
  const dateLabel = new Date(match.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    match,
    stadium,
    origin,
    travel,
    dateLabel,
    matchLabel: `${match.home} vs ${match.away}`,
    sectionSummary: buildSectionSummary(stadium.sections),
  };
}

function buildSystemPrompt(context: NonNullable<ReturnType<typeof buildMatchContext>>) {
  return `You are Pitch Perfect's AI matchday concierge for a World Cup travel planner.

Answer only with advice grounded in this match context. Be concise, practical, and judge-demo friendly. Do not claim live prices, live safety alerts, official policy, or guaranteed availability. If the user asks about safety, give general matchday best practices and recommend checking official local guidance.

Match: ${context.matchLabel}
Group/round: ${context.match.group}
Date/time: ${context.dateLabel} at ${context.match.time}
Stadium: ${context.stadium.name}, ${context.match.city}
Origin city: ${context.origin.name} (${context.origin.airport})
Sample flights: ${context.travel.flights
    .map(
      (flight) =>
        `${flight.airline}, ${flight.route}, ${flight.departure}-${flight.arrival}, ${flight.duration}, ${flight.price}, ${flight.stops} stop(s)`,
    )
    .join("; ")}
Sample hotels: ${context.travel.hotels
    .map((hotel) => `${hotel.name}, ${hotel.distance}, ${hotel.rating}/5, ${hotel.price}`)
    .join("; ")}
Transport to stadium: ${context.travel.transport
    .map((route) => `${route.mode}, ${route.duration}, ${route.description}`)
    .join("; ")}
Seat section signals: ${context.sectionSummary}`;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    matchId?: unknown;
    originCityId?: unknown;
    question?: unknown;
    messages?: unknown;
  } | null;

  const matchId = Number(body?.matchId);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const originCityId = typeof body?.originCityId === "string" ? body.originCityId : DEFAULT_ORIGIN_CITY_ID;
  const context = Number.isFinite(matchId) ? buildMatchContext(matchId, originCityId) : null;

  if (!context || question.length === 0) {
    return NextResponse.json({ error: "Missing match context or question." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const messages = Array.isArray(body?.messages) ? body.messages.filter(isChatMessage).slice(-6) : [];

  if (!apiKey) {
    return NextResponse.json({
      answer: buildFallbackAnswer(question, context),
      demoMode: true,
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.6,
        max_tokens: 420,
        messages: [
          { role: "system", content: buildSystemPrompt(context) },
          ...messages,
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) throw new Error("OpenAI returned an empty response.");

    return NextResponse.json({ answer, demoMode: false });
  } catch {
    return NextResponse.json({
      answer: buildFallbackAnswer(question, context),
      demoMode: true,
    });
  }
}
