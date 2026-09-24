# Plan

## Grafiskt resultat i steg 4

Idé från diskussion 2026-08-23: göra analysen mer grafisk — utan att bryta promptens förbud mot siffror/koordinater på GAL–TAN och vänster–höger (skalorna är genvägar ovanpå kvalitativa svar, inte mätvärden).

Prioriterad ordning:

1. **Motsägelsekartan** — callback-motsägelserna som parade kort ("ville skydda X" ↔ "avvisade finansieringen"). Mest särskiljande; ingen annan valkompass letar efter dem. Börja här.
2. **Tidshorisontband** — nu / mandatperiod / tio år / generation som vågrätt band: var ståndpunkterna lägger kostnad respektive nytta.
3. **Områdeskort** — de åtta principområdena med hållning + träffad målkonflikt. Billigast, minst nyhetsvärde.

Mekanik: samma mönster som `[STEG:n]` och `[VAL: ...]` — modellen emitterar en markerad datablock i steg 4, klienten parsar och renderar. Att komma ihåg:

- `app/lib/pdf-export.ts` (egen renderare) måste rita samma sak, annars tappar PDF:en resultatet.
- Prototypa på `/design` (olänkad sandlåda) med påhittad data innan prompten röres.

## Stegmarkören och statistiken (åtgärdat 2026-08-27)

`/stats` underrapporterade vilket steg användarna faktiskt var i: nästan hela steg 2 loggades som steg 1.

**Grundorsak:** `kompass.tsx` sparar den *rensade* assistenttexten i historiken — `[STEG:n]` strippas av servern innan strömmen når klienten, `[VAL:]` av `extractChoices`. Modellen får därför tillbaka sina egna tidigare svar utan markörer, ser inget eget prejudikat för formatet, och slutar emittera det efter ett par turer. `api.chat.ts` initierade då `resolvedStep = 1` per anrop och loggade det.

Användaren märkte aldrig något: `kompass.tsx` har en monoton spärr (`if (newStep > stepRef.current)`), så progressraden backar aldrig. Felet låg enbart i serverloggen.

**Åtgärd:** klienten skickar med `currentStep`, servern använder det som utgångsvärde i stället för 1. Verifierat mot claude-sonnet-5: turerna loggar nu steg 2 där de tidigare loggade steg 1. Bekräftar också att modellen *utelämnar* markören snarare än skickar fel värde — annars hade fixen inte bitit.

**Grundorsaken kvarstår medvetet.** Att behålla markören i klientens historik skulle ändra vad modellen ser och därmed dess beteende — en promptnära ändring som kräver ton-test. Kompensationen räcker för statistikens skull.

**Notera vid läsning av historisk statistik:** stegfördelningen före 2026-08-27 är skev — steg 1 är kraftigt övertaligt och steg 2 undertaligt. Stegtiderna (`api.timing.ts`) är däremot korrekta hela vägen, eftersom de mäts klientsidan med den monotona spärren.

## Väntetiden i steg 5 och effort-valet (mätt 2026-08-28/31)

Steg 5 tar 112–162 s mot live, varav 86–135 s helt utan bytes på anslutningen. Själva strömningen av matchningen är bara ~26 s. Orsaken: `anthropic.server.ts` skickar inte med `thinking`, och på claude-sonnet-5 blir det adaptivt tänkande med `display: "omitted"` som default — tankeblocken strömmas med tom text, och providern (som bara vidarebefordrar `text_delta`) har inget att skicka.

**Åtgärdat:** SSE-heartbeat var 10:e sekund tills första texten, plus en 45 s-vakthund i klienten som avbryter och säger "kontakten bröts" i stället för att hänga tyst. Verifierat mot live: 11 pingar genom en 113 s tystnad. Rapporterade "krascher" vid partimatchningen syntes aldrig i serverloggarna, just för att anslutningen dog hos klienten och aldrig nådde felhanteringen.

**Kvar att bestämma: `output_config: {effort: "medium"}`.** Fyra körningar per inställning mot samma sparade samtal, varm cache:

| | Tid till första token | Ut-tokens | Synlig text |
|---|---|---|---|
| default (high) | 78,4 / 81,2 s | 8 508 / 8 928 | 4 038–4 300 tecken |
| medium | 43,3 / 44,3 / 44,4 s | 5 201 / 5 465 / 5 725 | 3 733–4 379 tecken |

Medium är ~45 % snabbare till första tecknet och genererar ~40 % färre ut-tokens (nästan allt tänkande), med lika lång leverans. **Ingen mätbar kvalitetsskillnad vid n=4** — den skillnad som syntes i det första stickprovet visade sig vara körningsvariation, inte en effekt av effort. Båda inställningarna varierar lika mycket inom sig som mellan sig i hur områdena skärs (fyra breda rader mot sex smala).

Att veta innan bytet: routen känner steget, så medium enbart i steg 5 går att göra — men ett effort-byte mitt i ett samtal invaliderar meddelandecachen (mätningarna visade `cache_read=53769`). Globalt medium undviker det; per steg kostar en cache-omskrivning vid övergången till matchningen.

**Sidofynd, oberoende av effort:** reduktionspliktsaxeln (`partimatchning.md`, avsnittet om transportomställningens kostnad) användes i 1 av 8 körningar, trots att testpersonens ståndpunkt ("tyngdpunkt på den som förbrukar mest, med kompensation till dem utan alternativ") ligger nästan ordagrant på V:s dokumenterade linje. Kuraterat underlag som inte når fram till matchningen.

## Modellbyte: claude-opus-5-5 mot claude-sonnet-5 på steg 5 (mätt 2026-09-24)

`scripts/modell-ab.mjs`, samma sparade samtal och mått som effort-A/B:t, fyra körningar per inställning, varm cache (53 769 tokens läsning). Två Opus-medium-körningar avbröts med "terminated" från SDK:n när datorn gick i viloläge, så där är n=2.

| | Första token | Totalt | Ut-tokens (inkl. tänkande) | Kostnad ut per steg 5 |
|---|---|---|---|---|
| Sonnet 5, medium (dagens kandidat) | 62–76 s, snitt 68 | 86–101 s, snitt 93 | 6 600–7 900 | ≈7 öre |
| Opus 5.5, medium (standard) | 54–63 s, snitt 58 | 72–80 s, snitt 76 | 7 800–8 500 | ≈16 öre |
| Opus 5.5, low | 20–29 s, snitt 25 | 34–46 s, snitt 40 | 3 400–4 800 | ≈8 öre |

Cacheläsningen kostar lika på båda modellerna, så per steg 5 är Opus low i praktiken lika dyr som Sonnet medium, och 2,7 gånger snabbare till första tecknet. Klientens 45-sekundersvakthund blir då sällan aktuell.

Kvalitet (läst bredvid varandra, utfallen i `scripts/modell-ut/`): alla tio lyckade körningar har `[STEG:5]` först och `[VAL:]`-raden sist. Reduktionspliktsaxeln matchades med V "nära" i 1 av 4 Sonnet-körningar, 1 av 2 Opus medium och 1 av 4 Opus low, alltså samma svaghet oavsett modell; Opus medium-2 gjorde det bäst, med en uttalad rättelse av sin tidigare tolkning av testpersonens svar. Opus-texterna flaggar oftare öppet vad som inte går att matcha ("går inte att tolka säkert, räknas inte in"), förklarar partiförkortningarna och benämner korsblocksnyanser (KD och vårdens huvudmannaskap). Ingen körning hittade på partipositioner utanför underlaget.

**Rekommendation:** byt till Opus 5.5 med effort low. Kräver att `anthropic.server.ts` skickar `output_config.effort` (i dag skickas inget, vilket på Opus 5.5 ger medium). Modell och effort som miljövariabler så att bytet går att backa utan deploy.

## EU-dataresidens: huvudspår och reservspår (2026-09-24)

Huvudspåret är **Claude via Vertex AI i EU-multiregionen** (`claude-vertex`,
`docs/ai-providers.md`): samma modellfamilj och prompt som produktionen, byggt och
verifierat till endpointen, blockerat av Googles kvot sedan 2026-08-19. Modellbytet
till Opus 5.5 ger en följdfråga: kvotansökan gäller `anthropic-claude-sonnet`, så
EU-spåret kör Sonnet 5 om inte Opus 5.5 också aktiveras i Model Garden för `eu`.
Kolla det när kvoten landar; annars blir steg 5 långsammare i EU-läget än direkt.

Gemini är ett reservspår, inte beslutat. Mätningen nedan är vad som skulle behöva
göras om det spåret blir aktuellt.

### Reservspår: mät Gemini 3.x mot 2.5 (2026-09-08)

Latenstabellen i `docs/ai-providers.md` bygger helt på 2.5-generationen. 3.x-flash
finns numera i EU-multiregionen `eu` och är värd en jämförelse innan Gemini
avfärdas eller väljs — se modelltabellen där för vad som är nåbart.

Att göra:

1. Gemini-variant av `scripts/steg5-replay.mjs` (nuvarande går direkt mot
   Anthropic-SDK:n) som kör samma sparade samtal mot `eu` + `gemini-3.8-flash`.
2. Mät första token och total tid för steg 5, samma mått som effort-A/B:t, så
   siffrorna går att ställa mot claude-sonnet-5 och 2.5-pro.
3. Verifiera att streaming faktiskt går igenom — tillgänglighetsprobet var
   `countTokens`, som inte nödvändigtvis delar kvot med `generateContent`.
4. Kontrollera att STEG-markörer och VAL-knappar överlever modellbytet; det är
   promptberoende beteende och 3.x är inte testat mot vår systemprompt.

Öppen fråga som mätningen ska besvara: räcker Flash-nivåns resonemang i steg 4/5?
Slutsatsen om 2.5-pro:s tankebudget säger inget om 3.x, som har annan tankemekanik.
