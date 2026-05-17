const TEAM_FLAGS: Record<string, string> = {
  "Algeria": "\u{1F1E9}\u{1F1FF}",
  "Argentina": "\u{1F1E6}\u{1F1F7}",
  "Australia": "\u{1F1E6}\u{1F1FA}",
  "Austria": "\u{1F1E6}\u{1F1F9}",
  "Belgium": "\u{1F1E7}\u{1F1EA}",
  "Bosnia & Herzegovina": "\u{1F1E7}\u{1F1E6}",
  "Brazil": "\u{1F1E7}\u{1F1F7}",
  "Canada": "\u{1F1E8}\u{1F1E6}",
  "Cape Verde": "\u{1F1E8}\u{1F1FB}",
  "Colombia": "\u{1F1E8}\u{1F1F4}",
  "Croatia": "\u{1F1ED}\u{1F1F7}",
  "Curaçao": "\u{1F1E8}\u{1F1FC}",
  "Czech Republic": "\u{1F1E8}\u{1F1FF}",
  "DR Congo": "\u{1F1E8}\u{1F1E9}",
  "Ecuador": "\u{1F1EA}\u{1F1E8}",
  "Egypt": "\u{1F1EA}\u{1F1EC}",
  "England": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  "France": "\u{1F1EB}\u{1F1F7}",
  "Germany": "\u{1F1E9}\u{1F1EA}",
  "Ghana": "\u{1F1EC}\u{1F1ED}",
  "Haiti": "\u{1F1ED}\u{1F1F9}",
  "Iran": "\u{1F1EE}\u{1F1F7}",
  "Iraq": "\u{1F1EE}\u{1F1F6}",
  "Ivory Coast": "\u{1F1E8}\u{1F1EE}",
  "Japan": "\u{1F1EF}\u{1F1F5}",
  "Jordan": "\u{1F1EF}\u{1F1F4}",
  "Mexico": "\u{1F1F2}\u{1F1FD}",
  "Morocco": "\u{1F1F2}\u{1F1E6}",
  "Netherlands": "\u{1F1F3}\u{1F1F1}",
  "New Zealand": "\u{1F1F3}\u{1F1FF}",
  "Norway": "\u{1F1F3}\u{1F1F4}",
  "Panama": "\u{1F1F5}\u{1F1E6}",
  "Paraguay": "\u{1F1F5}\u{1F1FE}",
  "Portugal": "\u{1F1F5}\u{1F1F9}",
  "Qatar": "\u{1F1F6}\u{1F1E6}",
  "Saudi Arabia": "\u{1F1F8}\u{1F1E6}",
  "Scotland": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  "Senegal": "\u{1F1F8}\u{1F1F3}",
  "South Africa": "\u{1F1FF}\u{1F1E6}",
  "South Korea": "\u{1F1F0}\u{1F1F7}",
  "Spain": "\u{1F1EA}\u{1F1F8}",
  "Sweden": "\u{1F1F8}\u{1F1EA}",
  "Switzerland": "\u{1F1E8}\u{1F1ED}",
  "Tunisia": "\u{1F1F9}\u{1F1F3}",
  "Turkey": "\u{1F1F9}\u{1F1F7}",
  "Uruguay": "\u{1F1FA}\u{1F1FE}",
  "USA": "\u{1F1FA}\u{1F1F8}",
  "Uzbekistan": "\u{1F1FA}\u{1F1FF}",
};

export function teamFlag(name: string): string {
  return TEAM_FLAGS[name] ?? "";
}

export function teamWithFlag(name: string): string {
  const flag = TEAM_FLAGS[name];
  return flag ? `${flag} ${name}` : name;
}
