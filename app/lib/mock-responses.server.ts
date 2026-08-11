// Skriptat, påhittat samtal som följer formen av prompt v4. Används bara
// när ANTHROPIC_API_KEY saknas, så man kan klicka igenom UI:t utan att
// betala för riktiga API-anrop. Testar plumbing, inte AI-resonemang.

const TAG = "[MOCK-läge — simulerat svar, ingen riktig AI anropad]";

export const MOCK_SCRIPT = [
  `${TAG}\n\nÄr du främst en "Idealist" (styrs av visioner om hur samhället bör se ut), en "Realist" (styrs av vad som är genomförbart under en mandatperiod), eller en "Vardagsväljare" (styrs av hur förslagen konkret märks i ditt eget liv)?`,
  `${TAG}\n\nTack! Då går vi till de ideologiska principfrågorna. Först: Välfärd och statens roll — hur ser du på offentligt vs. privat, kontroll vs. valfrihet?`,
  `${TAG}\n\nIntressant — det låter som du vill ha X samtidigt som Y. Vad tror du krävs för att få ihop det, och är du beredd på det? (Detta är en simulerad uppföljningsfråga av typen MÅLKONFLIKT.)`,
  `${TAG}\n\nBra reflektion. Nästa område: Ekonomi och skatter — omfördelning, incitament, företagande. Hur ser du på det?`,
  `${TAG}\n\n(Fortsättning i mock-läge — i en riktig körning skulle samtalet fortsätta genom resten av steg 2, kontext-checkpointen, steg 3 och en avslutande analys i steg 4. Lägg till en riktig ANTHROPIC_API_KEY i webapp/.env för att se det på riktigt.)`,
];

export function mockResponse(turnIndex: number): string {
  const script = MOCK_SCRIPT;
  return script[Math.min(turnIndex, script.length - 1)];
}
