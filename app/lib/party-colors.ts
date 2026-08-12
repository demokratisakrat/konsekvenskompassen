// Partibokstavs-färger: samma åtta färger som i logotypen. Bokstaven bär
// informationen (fyra partier är blå, två röda — och färgblinda ska inte
// behöva gissa); färgen är igenkänningshjälp, inte informationsbärare.
// Delas av chat-renderingen (Markdown.tsx) och PDF-exporten.
export const PARTY_CHIPS: Record<string, { bg: string; fg: string }> = {
  S: { bg: "#ED1B34", fg: "#ffffff" },
  V: { bg: "#AF0D0D", fg: "#ffffff" },
  MP: { bg: "#53A045", fg: "#ffffff" },
  C: { bg: "#01683A", fg: "#ffffff" },
  L: { bg: "#0069B4", fg: "#ffffff" },
  M: { bg: "#52BDEC", fg: "#111827" },
  KD: { bg: "#2B2E83", fg: "#ffffff" },
  SD: { bg: "#DDCC00", fg: "#111827" },
};
