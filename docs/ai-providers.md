# AI-leverantörer

Appen kan drivas av Anthropic direkt (standard), Claude via Vertex AI
(EU-dataresidens) eller Gemini. Växeln är `CHAT_PROVIDER` i `wrangler.jsonc`
(`"anthropic"` | `"claude-vertex"` | `"gemini"`), per deploy. Implementationerna
ligger i `app/lib/providers/`; routen (`api.chat`) är leverantörsoberoende och
äger SSE-protokollet, STEG-tolkningen och mock-läget.

## Anthropic (produktion idag)

claude-opus-5-5 med effort low via `@anthropic-ai/sdk`, sedan 2026-09-24 (innan dess
claude-sonnet-5 utan effort). Modell och effort är vars i `wrangler.jsonc`
(`ANTHROPIC_MODEL`, `ANTHROPIC_EFFORT`); saknas effort skickas inget och modellen
kör sin standard. Systemprompten cachas med `cache_control: ephemeral`.
Secret: `ANTHROPIC_API_KEY`. Mätningen bakom bytet står i `docs/plan.md`.

## Claude via Vertex AI — EU-multiregion (huvudspår för EU-dataresidens)

claude-sonnet-5 via Vertex AI:s EU-multiregion (`aiplatform.eu.rep.googleapis.com`,
location `eu`) — modellen produktionen körde till 2026-09-24, med EU-dataresidens,
till +10 % på tokenpriserna ($2,20/$11 mot $2/$10 direkt; samma cachemekanik).
Samma Messages-format som direkt-API:et: modellen ligger i URL:en
(`:streamRawPredict`), `anthropic_version: vertex-2023-10-16` i kroppen,
prompt caching via `cache_control` fungerar. Auth delas med Gemini-vägen
(service account + egenmintad OAuth-token, `google-auth.server.ts`).

**Uppsättning:** utöver GCP-uppsättningen nedan krävs (1) att Claude Sonnet 5
aktiverats i Model Garden för projektet (formulär med företagsuppgifter och
Anthropics användarvillkor) och (2) kvot — nya projekt har 0 som standard för
partnermodeller; kvotökning begärs i konsolen för de tre
`eu_multi_region_online_prediction_*`-mätvärdena med dimension
`anthropic-claude-sonnet` (30 req/min, 500k in-tokens/min, 100k ut-tokens/min).
Första ansökan 2026-08-19 avslogs — nytt projekt utan faktureringshistorik;
omsänd 2026-08-24, fortfarande obesvarad 2026-09-08 (verifierat: 429 mot `eu`).
Tills kvoten landar är `claude-vertex` obrukbar. Kvoten och aktiveringen gäller
Sonnet; sedan produktionen bytte till Opus 5.5 behöver Opus 5.5 aktiveras för
`eu` också, annars kör EU-spåret Sonnet 5 med steg 5-tiderna i tabellen nedan.
Valfria vars: `CLAUDE_VERTEX_MODEL` (standard claude-sonnet-5),
`CLAUDE_VERTEX_LOCATION` (standard `eu`).

## Gemini — via Vertex AI, EU-pinnad (reservspår)

gemini-2.5-pro via Vertex AI:s regionala REST-endpoint
(`europe-west4-aiplatform.googleapis.com`) för EU-dataresidens.

**Varför inte enklare vägar:**

- Gemini Developer API (AI Studio-nycklar) är en global tjänst utan regionval.
- Vertex med API-nyckel ("express mode") ignorerar tyst regionen och går mot
  den globala endpointen — ser ut som EU-pinning men är det inte.
- Googles SDK/`google-auth-library` kräver Node-runtime; funkar inte i Workers.

Därför direkt REST med egenmintad OAuth-token: service account-nyckeln signerar
en JWT (WebCrypto RS256) som byts mot en timmes access-token, cachad per isolate.
Inga beroenden.

**Uppsättning** (gjord 2026-08-18): GCP-projekt `valsnack` med Vertex AI API
aktiverat; service account `valsnack-chat@valsnack.iam.gserviceaccount.com` med
rollen `roles/aiplatform.user`; separata nycklar för dev (`.dev.vars`) och prod
(Worker-secrets `GOOGLE_SERVICE_ACCOUNT_KEY` + `GOOGLE_CLOUD_PROJECT`).
Valfria vars: `GEMINI_MODEL` (standard gemini-2.5-pro), `GEMINI_LOCATION`
(standard europe-west4).

### Modelltillgång per region (probat 2026-09-08)

`countTokens` mot projektet `valsnack` för att se vad som faktiskt svarar — 404
skiljer inte "finns inte" från "saknar aktivering", så tabellen säger vad som är
nåbart härifrån, inte vad Google erbjuder i stort.

| Modell | `eu` (multiregion) | `europe-west4` | `global` |
|---|---|---|---|
| gemini-2.5-pro | — | ✓ | ✓ |
| gemini-2.5-flash | — | ✓ | ✓ |
| gemini-3.5-flash | ✓ | — | ✓ |
| gemini-3.6-flash | ✓ | — | ✓ |
| gemini-3.7-flash | ✓ | — | ✓ |
| gemini-3.8-flash | ✓ | — | ✓ |
| 3.x Pro (alla varianter som testades) | — | — | — |

Generationerna delar alltså inte region: `europe-west4` har bara 2.5, medan
3.x-flash finns i EU-multiregionen `eu` — samma endpoint som claude-vertex-vägen
använder. EU-dataresidensen behöver därför inte offras för att köra 3.x, den
flyttar från region till multiregion. `vertexHost()` hanterar redan `"eu"`, så
bytet är `GEMINI_LOCATION=eu` + `GEMINI_MODEL=…` utan kodändring.

Ingen 3.x Pro är nåbar, varken från `eu` eller `global` (`gemini-3-pro-preview`
ger 404 här). En jämförelse mot 2.5-pro blir alltså Flash mot Pro, inte pro mot
pro.

## Latensmätningar (2026-08-18, "Starta kompassen"-turen lokalt)

| Konfiguration | Första token | Totalt |
|---|---|---|
| claude-sonnet-5 (prod till 2026-09-24) | 3,4 s | 7,7 s |
| gemini-2.5-pro, default/dynamiskt tänkande | 9,4–12,7 s | 10,9–13,9 s |
| gemini-2.5-pro, thinkingBudget 1024 | 7,4 s | 8,6 s |
| gemini-2.5-pro, thinkingBudget 128 | 2,3 s | 4,2 s |
| gemini-2.5-flash | 1,5 s | 2,2 s |

Steg 5 (partimatchningen, mätt 2026-09-24 mot samma sparade samtal, fyra körningar
per rad, varm cache; utfall i `docs/plan.md`):

| Konfiguration | Första token | Totalt |
|---|---|---|
| claude-sonnet-5, effort medium | 62–76 s | 86–101 s |
| claude-opus-5-5, effort medium | 54–63 s | 72–80 s |
| claude-opus-5-5, effort low (prod) | 20–29 s | 34–46 s |

**Slutsats:** 2.5-pro förbrukar i praktiken hela sin tankebudget även på
triviala turer — dynamiskt läge självreglerar inte som Claudes adaptiva
tänkande. En statisk budget är därför ett nollsummespel: 128 gör småturerna
snabba men stryper analysen (steg 4/5) där tänkandet behövs som mest.
thinkingBudget-stödet togs bort efter mätningarna.

**Om Gemini ska bli produktionsval:** implementera stegmedveten budget —
klienten känner till `currentStep`, skicka med det i chat-anropet och låt
providern sätta låg budget för steg 1–3 och dynamisk för analys/matchning.
Alternativt gemini-2.5-flash för hela samtalet (snabbast av alla uppmätta,
men lättare resonemang i analysen).

**Status:** reservspår, inte beslutat. Gemini-vägen är lokalt verifierad
(STEG-markörer, VAL-knappar och flerturssamtal fungerar); prod-secrets finns på
plats men `CHAT_PROVIDER` står kvar på anthropic.
