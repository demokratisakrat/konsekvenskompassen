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
