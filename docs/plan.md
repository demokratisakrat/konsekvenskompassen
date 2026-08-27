# Plan

## Grafiskt resultat i steg 4

Idé från diskussion 2026-08-23: göra analysen mer grafisk — utan att bryta promptens förbud mot siffror/koordinater på GAL–TAN och vänster–höger (skalorna är genvägar ovanpå kvalitativa svar, inte mätvärden).

Prioriterad ordning:

1. **Motsägelsekartan** — callback-motsägelserna som parade kort ("ville skydda X" ↔ "avvisade finansieringen"). Mest särskiljande; ingen annan valkompass letar efter dem. Börja här.
2. **Tidshorisontband** — nu / mandatperiod / tio år / generation som vågrätt band: var ståndpunkterna lägger kostnad respektive nytta.
3. **Områdeskort** — de sju principområdena med hållning + träffad målkonflikt. Billigast, minst nyhetsvärde.

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
