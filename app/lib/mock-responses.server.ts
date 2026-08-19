// Skriptat, påhittat samtal som följer samtalspromptens form. Används bara
// när ANTHROPIC_API_KEY saknas, så man kan klicka igenom UI:t utan att
// betala för riktiga API-anrop. Testar plumbing, inte AI-resonemang.

const TAG = "[MOCK-läge — simulerat svar, ingen riktig AI anropad]";

export const MOCK_SCRIPT = [
  `${TAG}\n\nÄr du främst en "Idealist" (styrs av visioner om hur samhället bör se ut), en "Realist" (styrs av vad som är genomförbart under en mandatperiod), eller en "Vardagsväljare" (styrs av hur förslagen konkret märks i ditt eget liv)?`,
  `${TAG}\n\nTack! Då går vi till de ideologiska principfrågorna. Först: Välfärd och statens roll — hur ser du på offentligt vs. privat, kontroll vs. valfrihet?`,
  `${TAG}\n\nIntressant — det låter som du vill ha X samtidigt som Y. Vad tror du krävs för att få ihop det, och är du beredd på det? (Detta är en simulerad uppföljningsfråga av typen MÅLKONFLIKT.)`,
  `${TAG}\n\nBra reflektion. Nästa område: Ekonomi och skatter — omfördelning, incitament, företagande. Hur ser du på det?`,
  `${TAG}\n\n(Mock-läget hoppar nu direkt till slutet — i en riktig körning fortsätter steg 2–3 här.) Skriv något för att se en simulerad analys.`,
  `[STEG:4]${TAG}\n\n**Din politiska profil** (simulerad)\n\n**Systemprofil**\n\n| Dimension | Bedömning | Grund i korthet |\n|---|---|---|\n| Tidshorisont | Balanserad | Simulerat exempel |\n| Konfliktmedvetenhet | Blandad | Simulerat exempel |\n| Position och egen situation | Ingen spänning | Simulerat exempel |\n\nVill du matcha din hållning mot partierna? (Svara vad som helst för att se en simulerad matchning.)\n\n[VAL: Ja, matcha mig | Nej tack]`,
  `[STEG:5]${TAG}\n\n**Simulerad partimatchning** — testdata för tabellrendering, inga verkliga positioner:\n\n| Område | S | V | MP | C | L | M | KD | SD |\n|---|---|---|---|---|---|---|---|---|\n| Välfärd | NÄRA | DELVIS | SKAVER | NÄRA | DELVIS | SKAVER ⚠️ | NÄRA | DELVIS |\n| Ekonomi | SKAVER | NÄRA | DELVIS ⚠️ | SKAVER | NÄRA | DELVIS | SKAVER | NÄRA |\n\nDetta är ett underlag för eftertanke, inte en rekommendation om hur du ska rösta.`,
];

export function mockResponse(turnIndex: number): string {
  const script = MOCK_SCRIPT;
  return script[Math.min(turnIndex, script.length - 1)];
}
