# Konsekvenskompassen

En valkompass inför riksdagsvalet 2026 som inte bara frågar vad du tycker — den visar vad dina svar kostar, och vem som får betala.

**Prova den:** https://demokratisakrat.johan-4b5.workers.dev *(flyttar till konsekvenskompassen.se)*

Vanliga valkompasser matchar åsikter mot partier. Konsekvenskompassen är byggd för eftertanke: i ett samtal synliggör den målkonflikter, systemeffekter och tidshorisonter bakom dina ståndpunkter — även där de träffar din egen situation. Resultatet är en ideologisk profil och en systemprofil; partimatchning erbjuds som ett frivilligt steg efteråt.

Ett verktyg från [Demokratisäkrat](https://github.com/demokratisakrat) — fristående och ideellt, utan koppling till parti eller organisation, utan extern finansiering och utan annonser.

## Öppenhet som princip

Hela verktyget är läsbart här, ned till varje formulering:

- **`app/content/`** — det kuraterade, källbelagda underlaget: sju profiler per politikområde, partimatchningsunderlaget, metodiken och själva samtalsprompten. Det är detta (inte fri AI-improvisation) som styr sakinnehållet i samtalet.
- **`app/lib/usage-log.server.ts`** — loggningen: bara struktur (session, steg, feltyp, betyg), aldrig samtalsinnehåll. Dina svar lagras inte kopplade till dig.
- Samtalen drivs av en AI-språkmodell (Claude via Anthropics API); enligt Anthropics API-villkor används inte samtalen för att träna deras modeller.

Påpekanden om sakfel eller snedvridning i underlaget är särskilt välkomna — öppna gärna ett ärende, eller mejla demokratisakrat@gastrin.se.

## Utveckling

React Router v8 (framework mode) + Tailwind v4, deployat på Cloudflare Workers.

```bash
npm install
npm run dev
```

Öppna `http://localhost:5173`. Utan API-nyckel körs kompassen i **mock-läge** (skriptade, tydligt märkta svar) — se `app/lib/mock-responses.server.ts`.

För att testa mot en riktig modell: kopiera `.dev.vars.example` till `.dev.vars` och fyll i `ANTHROPIC_API_KEY`. Wrangler/Miniflare läser den automatiskt lokalt — filen är gitignorad.

## Bygga och kontrollera

```bash
npm run build          # produktionsbygge
npm run typecheck      # genererar Cloudflare-typer + tsc
npm run check          # tsc + build + wrangler deploy --dry-run
```

## Driftsättning

Push till `main` triggar `.github/workflows/deploy.yml`: typecheck + build + `wrangler deploy`. Detta är den enda normala vägen till produktion — deploya inte manuellt från lokal maskin (det skapar drift mellan git och produktion).

Workflown kräver dessa Actions-secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ANTHROPIC_API_KEY`, `CLOUDFLARE_ANALYTICS_API_TOKEN`.

## Struktur

- `app/routes/home.tsx` — startsida
- `app/routes/kompass.tsx` — chattgränssnittet, steg 1–4 obligatoriska + frivilligt steg 5 (partimatchning)
- `app/routes/profiler.tsx`, `app/routes/profil.tsx` — index och detaljvy för de sju kunskapsunderlagen
- `app/routes/metodik.tsx`, `app/routes/integritet.tsx`, `app/routes/om.tsx` — publika sidor
- `app/routes/api.chat.ts` — serverresurs som anropar Anthropic (eller mock-läge)
- `app/routes/api.feedback.ts`, `app/routes/api.timing.ts`, `app/routes/stats.tsx` — feedback, steg-tider och användningsstatistik
- `app/lib/system-prompt.server.ts` — bygger systemprompten av `app/content/`
- `app/lib/usage-log.server.ts` — strukturloggning, aldrig samtalsinnehåll
- `workers/app.ts` — Cloudflare Workers entry point

## Licens

- **Koden:** [MIT](LICENSE).
- **Innehållet i `app/content/`** (profiler, metodik, partimatchningsunderlag, prompt): [CC BY-SA 4.0](app/content/LICENSE.md).

## Kontakt

demokratisakrat@gastrin.se
