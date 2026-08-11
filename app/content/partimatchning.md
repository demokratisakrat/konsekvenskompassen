# Partimatchning — form och kuraterat underlag

> **STATUS: VERIFIERAT UTKAST — EJ EXTERNT GRANSKAT.**
> Första utkast 2026-08-08. **Verifieringspass 2026-08-09:** positionerna nedan är kontrollerade mot partiernas valmanifest/valplattformar 2026 och oberoende rapportering via webbkällor (se verifieringsloggen längst ner). ✔ = verifierad mot källa 2026-08-09; ⚠️ = fortfarande obekräftad eller osäker i detalj. Kvarstår före aktivering i skarp lansering: extern granskning av politisk journalist (se `plan.md` 1b).

## 1. Form: ett aktivt val efter resultatet

Matchningen ligger inte i resultatet. Efter ideologisk profil + systemprofil erbjuds:

> *"Så här ser din politiska hållning ut. Vill du matcha den mot partierna inför riksdagsvalet 2026?"*

Regler för matchningssteget:

- **Inga procentsatser.** En siffra som "73 % match" är falsk precision ovanpå kvalitativa svar. Istället: närhet per område — *ligger nära / delvis / skaver* — och en samlad rangordning i klartext.
- **Bara områden med underlag.** Matchning görs enbart inom de områden som har både sakprofil och partiunderlag (idag: välfärd, lag och ordning, klimat/energi, ekonomi/skatter, migration). Områden utan underlag nämns uttryckligen som utelämnade — de tystas inte bort.
- **Motivering på två nivåer** (från prompt-steg 4): *sakligt* (var partiets linje matchar/skaver mot användarens svar) och *tidshorisont* (delar partiet ståndpunkten men har agerat på annan tidshorisont i praktiken).
- **AI:n improviserar inte positioner.** Säger användaren något som inte täcks av underlaget svarar kompassen att den inte kan matcha den delen, istället för att gissa.

## 2. Källhierarki för partipositioner

Annan hierarki än sakprofilernas — här är partiernas egna dokument primärkällor, eftersom det är deras *positioner* som beskrivs, inte sakförhållanden:

1. **Valmanifest/valplattform 2026** — vad partiet säger sig gå till val på.
2. **Riksdagsbeteende under mandatperioden 2022–2026** — voteringar, reservationer, kommittémotioner, budgetförslag. Det är detta som bär tidshorisontnivån: skillnaden mellan vad partiet säger och hur det faktiskt agerat.
3. **Partiprogram** — den långsiktiga ideologiska hållningen, används när manifestet är tyst.
4. **Uttalanden från partiledning** i etablerade medier — bara som komplement, aldrig ensam grund.

**Manifestläge vid verifieringen (2026-08-09):** S "Plan för Sverige" (feb 2026), V valplattform (kongress apr 2026), C "Sverige kan mer" (jun 2026), L "För din frihet", M vallöften 2026, SD valplattform 2026 (jul 2026), MP valmanifest 2026. KD:s samlade manifest var svårare att belägga — deras positioner nedan bygger på partiets löpande vallöften och politiksidor.

## 3. Underlag per område

Positionslägena är organiserade efter sakprofilernas målkonflikter — det är mot dem användarens svar matchas, inte mot partierna som helhet.

### Välfärd och statens roll (jfr `profil-valfard.md`)

**Axel: valfrihet/privata utförare ↔ sammanhållen offentlig styrning, samt vinstfrågan**

| Parti | Position | Status |
|---|---|---|
| V | Vinstförbud/kraftig vinstbegränsning i välfärden, utbyggd offentlig drift | ✔ (valplattform 2026) |
| S | Vinstbegränsning, skarpast i skolan; behåller regionalt huvudansvar för vården — avvisar förstatligande | ✔ |
| MP | Vinstbegränsning, offentligt fokus | ✔ i huvuddrag |
| C | Valfrihet och fri etablering, emot vinstförbud; decentraliseringsprofil | ✔ |
| L | Valfrihet med kvalitetskrav; **statligt ansvar för skolan** står i valmanifestet 2026 | ✔ |
| KD | Valfrihet; **avskaffa regionernas huvudmannaskap för sjukvården** — uttalad valfråga 2026 och krav i kommande regeringsförhandlingar; stegvis förstatligande (kompetensförsörjning, läkemedel, screening m.m. först) | ✔ |
| M | Valfrihet, privata utförare; kvalitetsuppföljning snarare än vinstbegränsning | ⚠️ ev. öppning för mer statlig styrning av vården obekräftad |
| SD | Välfärdsprofil i retoriken (sänkt pensionärsskatt, vård); ⚠️ vinstfrågans exakta läge 2026 fortfarande obekräftat — måste kollas mot votering, inte retorik | ⚠️ |

**Tidshorisontnotering (✔ verifierad):** Vårdansvarskommittén ([SOU 2025:62](https://www.regeringen.se/pressmeddelanden/2025/06/staten-foreslas-ta-storre-ansvar-for-varden/), jun 2025) fann **inget stöd för helt statligt huvudmannaskap** men föreslog ökad statlig styrning på utpekade områden. KD driver förstatligandet vidare i valrörelsen trots kommitténs slutsats — en skiljelinje mellan expertutredning och partilinje värd att redovisa neutralt (jfr metodikens fjärde fynd).

### Lag och ordning (jfr `profil-lag-och-ordning.md`)

**Axel: straffskärpning som huvudverktyg ↔ upptäcktsrisk/förebyggande. OBS:** matchningen måste respektera profilens metodfynd — stöd för straffskärpning på proportionalitetsgrund är en giltig värdeposition, inte en empirisk miss.

| Parti | Position | Status |
|---|---|---|
| SD, M, KD, L | Straffskärpningslinjen: **"största reformen av straffsystemet sedan brottsbalken"** beslutad — slopad mängdrabatt, hela straffskalan används, dubbla straff för gängkriminella, nytt påföljdssystem, i kraft 1 aug 2026; ungdomsfängelser och snabbare anstaltsutbyggnad från 1 jul 2026 — parallellt med fler poliser | ✔ ([regeringen apr 2026](https://www.regeringen.se/pressmeddelanden/2026/04/den-storsta-reformen-av-det-svenska-straffsystemet-sedan-brottsbalken-infordes/)) |
| S | Har följt med i huvuddelen av skärpningarna, betonar samtidigt förebyggande | ⚠️ exakta reservationer overifierade |
| V, MP | Tyngdpunkt på förebyggande och sociala insatser; kritiska mot rättssäkerhetskänsliga verktyg | ⚠️ exakta voteringar overifierade |
| C | Fler poliser + förebyggande (L:s manifest har liknande "fler lokala poliser"-betoning), rättssäkerhetsbetoning, kritisk till delar av paketen | ✔ i huvuddrag |

**Tidshorisontnotering:** Kriminalvårdens kapacitetsrapport (källa i sakprofilen) räknar med mer än fördubblat platsbehov till 2035; reformens ikraftträdande 1 aug 2026 ligger *efter* valet — konsekvenserna för kriminalvården bärs av nästa mandatperiod. Vem finansierar? ✔ (kapacitetsrapporten + prop. 2025/26:209).
**Ekonomisk brottslighet:** fortsatt svagt partiskiljande ⚠️ — utelämnas öppet om den inte kan beläggas.

### Klimat och energi (jfr `profil-klimat-energi.md`)

**Axel: ny kärnkraft med statlig riskdelning ↔ förnybar utbyggnad; styrmedelsnivå**

| Parti | Position | Status |
|---|---|---|
| M, KD, L, SD | Ny kärnkraft med statligt stöd — **kreditgarantiram om 400 miljarder kr** bemyndigad av riksdagen 2025; mål "fossilfritt"; M lovar sänkta drivmedelspriser | ✔ |
| S | Teknikneutral hållning; har ifrågasatt subventionsnivån | ⚠️ manifestets exakta formulering overifierad |
| C | **Emot regeringens kärnkraftspaket** ("hundratals miljarder som belastar kommande generationer") men **öppna för teknikneutralt, kostnadseffektivt stöd**; förnybart + marknadslösningar | ✔ (valmanifest jun 2026) |
| MP | Förnybar utbyggnad, emot subventionerad ny kärnkraft ("tränger ut investeringar i förnybart"), rättvis klimatomställning som valets huvudfråga | ✔ (valmanifest 2026) |
| V | Förnybart, offentliga klimatinvesteringar, emot kärnkraftssubventioner | ✔ i huvuddrag |

**Tidshorisontnotering (✔ uppdaterad — bättre än utkastets):** reduktionsplikten sänktes kraftigt 2024 (kortsiktig nytta: pumppris) men **höjdes igen till 10 % för både bensin och diesel 1 juli 2025 på grund av EU:s klimatkrav**, och en styrmedelsutredning (maj 2026) pekar mot ytterligare höjning mot 2030. Sänkningen blev alltså tillfällig — de långsiktiga åtagandena hann ikapp inom en mandatperiod. Ett ovanligt rent, verifierat exempel på sajtens grundtema.

### Ekonomi och skatter (jfr `profil-ekonomi-skatter.md`)

**Axel: omfördelning/högre kapitalskatter ↔ lägre skatt på arbete/starkare drivkrafter**

| Parti | Position | Status |
|---|---|---|
| V | Återinförd **förmögenhetsskatt och arvsskatt**, höjda kapitalskatter (~48 mdr), tak/skärpning av ISK för stora portföljer; prioriterar "miljardärsskatt" i ev. förhandlingar | ✔ (valplattform + budgetmotion) |
| S | **Beredskapsskatt** (försvar), **bankskatt**, tredje ISK-nivå för sparande **över 3 mkr** (behåller skattefri grundnivå 300 tkr), höjd skatt för de högsta inkomsterna; Andersson **utesluter** fastighets-, arvs- och förmögenhetsskatt | ✔ ("Plan för Sverige" + uttalanden) |
| MP | Grön skatteväxling, höjd kapitalbeskattning | ⚠️ detaljnivå |
| C | Sänkta **arbetsgivaravgifter för småföretag** som huvudfråga; emot förmögenhetsskatt | ✔ |
| L | Sänkt skatt på arbete; **barnavdrag 10 tkr/barn/år**, breddat RUT; försvarar ISK | ✔ |
| M | Skattesänkningar ~**35 mdr** över mandatperioden: förstärkt jobbskatteavdrag (upp till 1 000 kr/mån), "arbetad pension"-avdrag, **ISK-fritt höjs 300→500 tkr**, sänkt reavinstskatt | ✔ (vallöften 2026) |
| KD | I huvuddrag som M | ⚠️ egna avvikelser overifierade |
| SD | Plånboksprofil: sänkt pensionärsskatt och drivmedelsskatt; försvarar nuvarande kapitalskattesystem (inga arvs-/förmögenhetsskatter) | ✔ i huvuddrag (valplattform 2026) |

**Tvärgående (✔ verifierad — profilens huvudpoäng håller):**
- **Fastighetsskatten:** samtliga riksdagspartier avvisar återinförande 2026 — S uttryckligen (Andersson), **även V** ("kommer inte driva att återinföra fastighetsskatten" — Gabrielsson), M/SD/L/C nej. Gapet mellan ekonomkonsensus och politisk konsensus är därmed belagt för valrörelsen 2026; matchningen redovisar enigheten som enighet.
- **Balansmålet (SOU 2024:76):** reservationer per parti fortfarande overifierade ⚠️ — tidshorisontomdömen på ramverksområdet får inte fällas utan belägg.

### Migration och medborgarskap (jfr `profil-migration.md`)

**Axel: stram linje/krav ↔ humanitärt åtagande/öppenhet. OBS:** följ profilens metodfynd om språk — beskriv positioner med beslutens formella beteckningar.

| Parti | Position | Status |
|---|---|---|
| SD | Mest restriktiv: asylmottagande nära noll som ambition, kraftigt utbyggd återvandringspolitik | ✔ i huvuddrag (valplattform 2026) |
| M, KD | Tidölinjen: stram asyl, skärpta krav, höjt försörjningskrav, återvandringsbidrag | ✔ i huvuddrag |
| L | Har följt Tidölinjen med markerade undantag | ⚠️ manifestets migrationsavsnitt overifierat |
| S | **Stram migrationspolitik ligger fast** — ett av tre fokusområden i valplattformen; EU:s miniminivåer, aktivitetskrav, språkkrav | ✔ ("Plan för Sverige") |
| C | Borgerlig mittposition: värnar arbetskraftsinvandring och öppenhet | ⚠️ asylpolitikens konkretion |
| MP | **"Human och rättssäker migrationspolitik", asylrätten ska värnas**; kritiska mot utvisningar av etablerade | ✔ (valmanifest 2026) |
| V | Generös asyllinje, värnar asylrätten, emot återvandringspolitiken | ✔ i huvuddrag |

**Tvärgående:**
- **Medborgarskapskraven är gällande rätt sedan 6 juni 2026** ✔: hemvistkrav höjt 5→8 år, egenförsörjningskrav, språk- och samhällskunskapskrav för 16–66-åringar, medborgarskapsprov från aug 2026 ([Migrationsverket](https://www.migrationsverket.se/nyhetsarkiv/nyhetsarkiv/2026-05-06-nya-regler-for-svenskt-medborgarskap-fran-och-med-6-juni-2026.html)). Skiljelinjen 2026 är alltså inte *om* kraven införs utan **vilka partier som vill riva upp eller mildra dem** — V/MP/C:s hållning till återställning ⚠️ overifierad.
- **Försörjningskravet för arbetskraftsinvandring:** undantagen för bristyrken är den verkliga skiljelinjen ⚠️ — kopplar till välfärdsprofilens kompetensbrist.
- **Tidshorisontmarkör:** vem adresserar vårdens personalförsörjning 2035+ i sin migrationspolitik, i stället för enbart nästa mandatperiods volymer?

### EU och omvärld (jfr `profil-eu-omvarld.md`)

**Axel: gradskillnader i EU-integration + säkerhetspolitikens takt/finansiering. OBS:** följ profilens metodfynd — Nato/upprustningen är blocköverskridande enighet, inte en skiljelinje; EU-frågan är gradskillnader, inte ja/nej.

| Parti | Position | Status |
|---|---|---|
| L | Riksdagens mest EU-positiva; vill utvidga samarbetet, öppen för euro | ✔ i huvuddrag |
| C, S, M, KD | Pragmatiskt EU-positiva, ingen drivande utträdes- eller fördjupningsagenda | ⚠️ nyanser overifierade |
| MP, V | EU-skeptiska i traditionen, vill se mindre överstatlighet men driver inte utträde; MP EU-positiv på klimat-/arbetsmiljöområdet | ✔ i huvuddrag |
| SD | Historiskt mest EU-skeptiska, tonat ner utträdeskrav | ⚠️ 2026-läget overifierat |

**Tvärgående (✔ verifierad):** Nato-medlemskapet och 5 %-upprustningen (3,5+1,5 % till 2035) är **blocköverskridande beslutad politik** — ingen skiljelinje att matcha mot. Den enda verkliga skiljelinjen är **takt** (regeringen vill nå målen till 2030 i stället för 2035) och **finansiering** (lån vs. skatt — kopplar direkt till S:s beredskapsskatt i ekonomiprofilen). Redovisa enigheten som enighet.
**Opinionsvarning:** SOM 2025 visar att vänsterväljare numera är mest EU-positiva och höger/SD mer skeptiska — omvänt mot äldre mönster. Matcha inte mot förlegade höger-vänster-antaganden om EU-frågan.

### Infrastruktur och regionalpolitik (jfr `profil-infrastruktur.md`)

**Axel: samhällsekonomisk lönsamhet/storstad ↔ regional likvärdighet/landsbygd; underhåll ↔ nybyggnad**

| Parti | Position | Status |
|---|---|---|
| M | Samhällsekonomisk lönsamhet uttalad ledstjärna; avbröt nya stambanor, fokus på att befintlig järnväg fungerar i vardagen | ✔ (partiets egen sida) |
| S, V, MP, C | Ville återstarta planering av nya stambanor (motion föll med två röster i riksdagen) | ✔ ([SVT](https://www.svt.se/nyheter/inrikes/sa-vill-partierna-ta-sig-an-jarnvagen-om-de-vinner-valet)) |
| C | 50 mdr till landsbygdsutveckling, likvärdig service oavsett var i landet man bor | ✔ (valmanifest) |
| KD | Avståndsbaserat, färdmedelsneutralt reseavdrag med landsbygdsprofil | ✔ (partiets politiksida) |
| SD, M, KD, L | Gemensam överenskommelse bakom nuvarande nationella infrastrukturplan (vägunderhåll prioriterat) | ✔ i huvuddrag |
| MP | Fossilfritt 2035, kraftig järnvägsutbyggnad, stopp för nya motorvägar | ✔ i huvuddrag |

**Tidshorisontnotering (✔ — men se metodfyndet):** underhållsskulden (~90 mdr) byggdes upp under regeringar av båda block — matchningen ska **inte** attribuera den partipolitiskt, utan fråga vem som nu prioriterar underhåll. Nationell plan 2026–2037 (beslutad, alla block representerade i processen) prioriterar faktiskt underhåll — ett skarpt exempel på systemet som självkorrigerar, värt att lyfta som motvikt till annars genomgående kortsiktighetsberättelser.
**Utjämningssystemet (SOU 2024:50):** partiernas ställningstaganden till förslagen ⚠️ overifierade — utelämnas tills belagt.

## 4. Balanskontroll för partiunderlag

Sakprofilernas självtest anpassat: *"Skulle partiets egen väljare känna sig rättvist beskriven?"*

- Varje parti beskrivs med samma djup och samma struktur — inget parti får bara en karikatyr eller bara sin självbild.
- **Tidshorisontomdömen är de känsligaste påståendena i hela produkten** ("partiet säger X men agerade kortsiktigt"). De kräver konkret belägg — en votering, ett budgetbeslut, en myndighetsgranskning — aldrig en allmän karaktärisering. Hellre utelämna än gissa.
- Både kortsiktighets- och långsiktighetsrisker ska förekomma över blockgränsen i underlaget som helhet; om alla tidshorisontanmärkningar hamnar på samma sida är det en varningsflagga i sig.

## 5. Öppna frågor

- **Granskare:** vilken politisk journalist — och vad innebär "stå för det" i praktiken (namn på metodiksidan? läser varje uppdatering?). Verifieringspasset gör granskningen till en rimlig genomläsning snarare än ett researchjobb.
- **Kvarvarande ⚠️:** SD:s vinstposition i välfärden, S kärnkraftsformulering i manifestet, S/V/MP:s reservationer i straffreformen, balansmålsreservationerna, V/MP/C:s hållning till medborgarskapskravens återställning, KD:s samlade manifest.
- **Frysdatum:** underlaget fryses 1 september och datumet visas för användaren; sena positionsbyten därefter hanteras inte.
- **Partier under spärren:** enbart nuvarande riksdagspartier matchas, sagt öppet.
- ~~Två områden saknar underlag~~ **Alla sju principområden har nu underlag** (EU och omvärld samt infrastruktur/regionalpolitik tillagda 2026-08-09). Matchningen är därmed komplett i bredd, om än fortfarande med enskilda ⚠️-punkter kvar per område.

## Verifieringslogg 2026-08-09

Nyckelkällor använda vid verifieringspasset (utöver partiernas egna manifestsidor): [S valplattform "Plan för Sverige"](https://www.socialdemokraterna.se/nyheter/nyheter/2026-02-05-plan-for-sverige---socialdemokraterna-presenterar-valplattform-2026) · [V valplattform 2026](https://www.vansterpartiet.se/wp-content/uploads/2026/04/Preliminar-Valplattform-efter-beslut-pa-kongressen-2026.pdf) · [C valmanifest "Sverige kan mer"](https://val2026.centerpartiet.se/) · [L "För din frihet"](https://www.liberalerna.se/liberalernas-valmanifest-2026) · [M vallöften 2026](https://moderaterna.se/valloften-2026/) · [SD valplattform 2026](https://www.sd.se/wp-content/uploads/2026/07/valplattform-2026.pdf) · [MP valmanifest 2026](https://www.mp.se/valmanifest-2026-utkast/) · [SOU 2025:62 Vårdansvarskommittén](https://www.regeringen.se/pressmeddelanden/2025/06/staten-foreslas-ta-storre-ansvar-for-varden/) · [Straffreformen apr 2026](https://www.regeringen.se/pressmeddelanden/2026/04/den-storsta-reformen-av-det-svenska-straffsystemet-sedan-brottsbalken-infordes/) · [Nya medborgarskapsregler](https://www.migrationsverket.se/nyhetsarkiv/nyhetsarkiv/2026-05-06-nya-regler-for-svenskt-medborgarskap-fran-och-med-6-juni-2026.html) · [Reduktionsplikt](https://www.ekonomifakta.se/sakomraden/energi/styrmedel/reduktionsplikt_1211453.html) · SVT/TN/Borskollen-rapportering om fastighetsskatt och ISK.
