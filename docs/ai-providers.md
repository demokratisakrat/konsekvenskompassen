# AI-leverantörer

Appen kan drivas av Anthropic (standard) eller Gemini. Växeln är `CHAT_PROVIDER`
i `wrangler.jsonc` (`"anthropic"` | `"gemini"`), per deploy. Implementationerna
ligger i `app/lib/providers/`; routen (`api.chat`) är leverantörsoberoende och
äger SSE-protokollet, STEG-tolkningen och mock-läget.

## Anthropic (produktion idag)

claude-sonnet-5 via `@anthropic-ai/sdk`. Systemprompten cachas med
`cache_control: ephemeral`. Secret: `ANTHROPIC_API_KEY`.

## Gemini — via Vertex AI, EU-pinnad

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

## Latensmätningar (2026-08-18, "Starta kompassen"-turen lokalt)

| Konfiguration | Första token | Totalt |
|---|---|---|
| claude-sonnet-5 (prod) | 3,4 s | 7,7 s |
| gemini-2.5-pro, default/dynamiskt tänkande | 9,4–12,7 s | 10,9–13,9 s |
| gemini-2.5-pro, thinkingBudget 1024 | 7,4 s | 8,6 s |
| gemini-2.5-pro, thinkingBudget 128 | 2,3 s | 4,2 s |
| gemini-2.5-flash | 1,5 s | 2,2 s |

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

**Status:** Gemini-vägen är lokalt verifierad (STEG-markörer, VAL-knappar och
flerturssamtal fungerar); prod-secrets finns på plats men `CHAT_PROVIDER` står
kvar på anthropic.
