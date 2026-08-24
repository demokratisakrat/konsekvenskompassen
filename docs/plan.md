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
