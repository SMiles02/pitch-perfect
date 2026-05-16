import type { Match } from "@/lib/data";
import { matches } from "@/lib/data";

export type Participant =
  | { kind: "group_winner"; group: string }
  | { kind: "group_runner_up"; group: string }
  | { kind: "best_third"; groups: string[] }
  | { kind: "match_winner"; matchId: number }
  | { kind: "match_loser"; matchId: number };

export interface BracketSlot {
  matchId: number;
  home: Participant;
  away: Participant;
}

export interface BracketRound {
  id: string;
  label: string;
  matchIds: number[];
}

const GROUP_LETTERS = "ABCDEFGHIJKL".split("");

export function formatParticipant(p: Participant): string {
  switch (p.kind) {
    case "group_winner":
      return `Winner Group ${p.group}`;
    case "group_runner_up":
      return `Runner-up Group ${p.group}`;
    case "best_third":
      return `Best 3rd (${p.groups.join("/")})`;
    case "match_winner":
      return `Winner Match ${p.matchId}`;
    case "match_loser":
      return `Loser Match ${p.matchId}`;
  }
}

function w(matchId: number): Participant {
  return { kind: "match_winner", matchId };
}

function l(matchId: number): Participant {
  return { kind: "match_loser", matchId };
}

function gw(group: string): Participant {
  return { kind: "group_winner", group };
}

function gr(group: string): Participant {
  return { kind: "group_runner_up", group };
}

function t3(groups: string): Participant {
  return { kind: "best_third", groups: groups.split("") };
}

/** Official FIFA World Cup 2026 knockout pairings (matches 73–104). */
export const BRACKET_SLOTS: BracketSlot[] = [
  { matchId: 73, home: gr("A"), away: gr("B") },
  { matchId: 74, home: gw("E"), away: t3("ABCDF") },
  { matchId: 75, home: gw("F"), away: gr("C") },
  { matchId: 76, home: gw("C"), away: gr("F") },
  { matchId: 77, home: gw("I"), away: t3("CDFGH") },
  { matchId: 78, home: gr("E"), away: gr("I") },
  { matchId: 79, home: gw("A"), away: t3("CEFHI") },
  { matchId: 80, home: gw("L"), away: t3("EHIJK") },
  { matchId: 81, home: gw("D"), away: t3("BEFIJ") },
  { matchId: 82, home: gw("G"), away: t3("AEHIJ") },
  { matchId: 83, home: gr("K"), away: gr("L") },
  { matchId: 84, home: gw("H"), away: gr("J") },
  { matchId: 85, home: gw("B"), away: t3("EFGIJ") },
  { matchId: 86, home: gw("J"), away: gr("H") },
  { matchId: 87, home: gw("K"), away: t3("DEIJL") },
  { matchId: 88, home: gr("D"), away: gr("G") },
  { matchId: 89, home: w(74), away: w(77) },
  { matchId: 90, home: w(73), away: w(75) },
  { matchId: 91, home: w(76), away: w(78) },
  { matchId: 92, home: w(79), away: w(80) },
  { matchId: 93, home: w(83), away: w(84) },
  { matchId: 94, home: w(81), away: w(82) },
  { matchId: 95, home: w(86), away: w(88) },
  { matchId: 96, home: w(85), away: w(87) },
  { matchId: 97, home: w(89), away: w(90) },
  { matchId: 98, home: w(93), away: w(94) },
  { matchId: 99, home: w(91), away: w(92) },
  { matchId: 100, home: w(95), away: w(96) },
  { matchId: 101, home: w(97), away: w(98) },
  { matchId: 102, home: w(99), away: w(100) },
  { matchId: 103, home: l(101), away: l(102) },
  { matchId: 104, home: w(101), away: w(102) },
];

export const BRACKET_ROUNDS: BracketRound[] = [
  {
    id: "r32",
    label: "Round of 32",
    matchIds: [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88],
  },
  {
    id: "r16",
    label: "Round of 16",
    matchIds: [89, 90, 91, 92, 93, 94, 95, 96],
  },
  {
    id: "qf",
    label: "Quarter-finals",
    matchIds: [97, 98, 99, 100],
  },
  {
    id: "sf",
    label: "Semi-finals",
    matchIds: [101, 102],
  },
  {
    id: "finals",
    label: "Finals",
    matchIds: [103, 104],
  },
];

/** Bracket column order (top → bottom) aligned with the official FIFA tree. */
export const BRACKET_TREE: Record<string, number[]> = {
  r32: [74, 77, 73, 75, 76, 78, 79, 80, 83, 84, 81, 82, 86, 88, 85, 87],
  r16: [89, 90, 91, 92, 93, 94, 95, 96],
  qf: [97, 98, 99, 100],
  sf: [101, 102],
  finals: [104, 103],
};

const slotByMatchId = new Map(BRACKET_SLOTS.map((s) => [s.matchId, s]));

export function getBracketSlot(matchId: number): BracketSlot | undefined {
  return slotByMatchId.get(matchId);
}

export function getGroupNames(): string[] {
  return GROUP_LETTERS.map((l) => `Group ${l}`);
}

export function getTeamsByGroup(allMatches: Match[] = matches): Map<string, string[]> {
  const map = new Map<string, Set<string>>();

  for (const m of allMatches) {
    if (!m.group.startsWith("Group ")) continue;
    if (!map.has(m.group)) map.set(m.group, new Set());
    map.get(m.group)!.add(m.home);
    map.get(m.group)!.add(m.away);
  }

  const result = new Map<string, string[]>();
  for (const name of getGroupNames()) {
    const teams = map.get(name);
    result.set(name, teams ? [...teams].sort() : []);
  }
  return result;
}

export function getGroupMatches(allMatches: Match[] = matches): Map<string, Match[]> {
  const map = new Map<string, Match[]>();
  for (const m of allMatches) {
    if (!m.group.startsWith("Group ")) continue;
    if (!map.has(m.group)) map.set(m.group, []);
    map.get(m.group)!.push(m);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.id - b.id);
  }
  return map;
}

export const EMPTY_STANDINGS_ROW = {
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  gf: 0,
  ga: 0,
  gd: 0,
  points: 0,
} as const;
