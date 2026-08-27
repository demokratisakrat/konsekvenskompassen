# Partimatchning — form och kuraterat underlag

> **STATUS: VERIFIERAT UTKAST — EJ EXTERNT GRANSKAT.**
> Första utkast 2026-08-08. **Verifieringspass 2026-08-09** och **färskhetspass 2026-08-27** (se verifieringsloggarna längst ner). ✔ = verifierad mot källa; ⚠️ = fortfarande obekräftad eller osäker i detalj. Kvarstår före aktivering i skarp lansering: extern granskning av politisk journalist (se `plan.md` 1b).
>
> **OBS:** förtidsröstningen öppnade 26 augusti 2026. Underlaget läses alltså redan av personer som kan rösta samma dag — frysdatumet 1 september ligger efter att röstningen börjat.

## 1. Form: ett aktivt val efter resultatet

Matchningen ligger inte i resultatet. Efter ideologisk profil + systemprofil erbjuds:

> *"Så här ser din politiska hållning ut. Vill du matcha den mot partierna inför riksdagsvalet 2026?"*

Regler för matchningssteget:

- **Inga procentsatser.** En siffra som "73 % match" är falsk precision ovanpå kvalitativa svar. Istället: närhet per område — *ligger nära / delvis / skaver* — och en samlad rangordning i klartext.
- **Bara områden med underlag.** Matchning görs enbart inom de områden som har både sakprofil och partiunderlag — sedan 2026-08-09 gäller det samtliga principområden (åtta sedan klimat och energi delades 2026-08-27; de två delar ett kunskapsunderlag). Enskilda *axlar* inom ett område kan ändå sakna underlag; de nämns uttryckligen som utelämnade och tystas inte bort.
- **Motivering på två nivåer** (från prompt-steg 4): *sakligt* (var partiets linje matchar/skaver mot användarens svar) och *tidshorisont* (delar partiet ståndpunkten men har agerat på annan tidshorisont i praktiken).
- **AI:n improviserar inte positioner.** Säger användaren något som inte täcks av underlaget svarar kompassen att den inte kan matcha den delen, istället för att gissa.

## 2. Källhierarki för partipositioner

Annan hierarki än sakprofilernas — här är partiernas egna dokument primärkällor, eftersom det är deras *positioner* som beskrivs, inte sakförhållanden:

1. **Valmanifest/valplattform 2026** — vad partiet säger sig gå till val på.
2. **Riksdagsbeteende under mandatperioden 2022–2026** — voteringar, reservationer, kommittémotioner, budgetförslag. Det är detta som bär tidshorisontnivån: skillnaden mellan vad partiet säger och hur det faktiskt agerat.
3. **Partiprogram** — den långsiktiga ideologiska hållningen, används när manifestet är tyst.
4. **Uttalanden från partiledning** i etablerade medier — bara som komplement, aldrig ensam grund.

**Manifestläge (uppdaterat 2026-08-27):** S "Plan för Sverige" (feb 2026), V valplattform (kongress apr 2026), C "Sverige kan mer" (jun 2026), L "För din frihet", M vallöften 2026, SD valplattform 2026 (jul 2026), MP valmanifest 2026. **Nytt sedan förra passet:** KD presenterade sitt samlade valmanifest 21 augusti 2026 (112 löften) — den lucka som fanns 2026-08-09 är därmed täppt. MP:s manifest finns nu i slutlig version ([mp.se/valmanifest2026](https://www.mp.se/valmanifest2026/)); den utkastversion som citerades i förra passet ligger kvar men bör inte längre vara primärkälla. V:s plattform är fortfarande publicerad som "preliminär" trots kongressbeslut — texten är substantiellt fastställd, filnamnet är inte.

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
| KD | Valfrihet; **avskaffa regionernas huvudmannaskap för sjukvården** — uttalad valfråga 2026 och krav i kommande regeringsförhandlingar; stegvis förstatligande (kompetensförsörjning, läkemedel, screening m.m. först). **Skärpt i manifestet 21 aug 2026:** Busch anger förstatligandet som icke förhandlingsbart för varje regering KD stödjer | ✔ |
| M | Valfrihet, privata utförare; kvalitetsuppföljning snarare än vinstbegränsning | ⚠️ ev. öppning för mer statlig styrning av vården obekräftad |
| SD | Välfärdsprofil i retoriken (sänkt pensionärsskatt, vård). **Vinstfrågan belagd 2026-08-27:** SD står bakom Tidöpartiernas vinststopp för *nya* friskolor (5 år efter nyetablering, 3 år efter ägarbyte, 2 år efter tillsynsföreläggande, i kraft 1 juli 2027) men vill **inte** ha generellt vinstförbud eller vinstbegränsning för befintliga skolor | ✔ ([SVT maj 2026](https://www.svt.se/nyheter/inrikes/regeringen-vill-infora-vinststopp-for-nya-friskolor)) |

**Tidshorisontnotering (✔ verifierad):** Vårdansvarskommittén ([SOU 2025:62](https://www.regeringen.se/pressmeddelanden/2025/06/staten-foreslas-ta-storre-ansvar-for-varden/), jun 2025) fann **inget stöd för helt statligt huvudmannaskap** men föreslog ökad statlig styrning på utpekade områden. KD driver förstatligandet vidare i valrörelsen trots kommitténs slutsats — en skiljelinje mellan expertutredning och partilinje värd att redovisa neutralt (jfr metodikens fjärde fynd).
**Tidshorisontnotering 2 (✔ ny 2026-08-27):** friskolornas vinststopp träder i kraft **1 juli 2027** — beslutat före valet, verkar efter det. Samma mönster som straffreformen: den mandatperiod som beslutar bär inte konsekvenserna. S kallar förslaget otillräckligt ("vinstfesten fortsätter" — Ygeman), C menar att det inte biter utan gemensamt skolval och ny finansieringsmodell.

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

### Energi (jfr `profil-klimat-energi.md`, målkonflikt 2–4)

**Axel: ny kärnkraft med statlig riskdelning ↔ förnybar utbyggnad; styrmedelsnivå**

**VARNING mot förlegad matchning (ny 2026-08-27):** kärnkraftsaxeln separerar inte längre blocken rent. S öppnade för statligt stöd till ny kärnkraft redan i augusti 2025 och förhandlade med regeringspartierna om det. Skiljelinjen 2026 går alltså inte mellan "för och emot ny kärnkraft" utan mellan **stödets utformning och nivå** — och de tydligaste motståndarna till just subventionerna är C och MP, inte hela vänsterblocket. Matcha inte en användare mot ett blockmönster som inte längre gäller.

| Parti | Position | Status |
|---|---|---|
| M, KD, L, SD | Ny kärnkraft med statligt stöd — **kreditgarantiram om 400 miljarder kr** bemyndigad av riksdagen 2025; mål "fossilfritt"; M lovar sänkta drivmedelspriser | ✔ |
| S | **Öppnar för statligt stöd till ny kärnkraft** — Andersson: "vi bedömer att marknaden inte kommer att klara av detta"; staten ska ha kontroll över säkerhet, ekonomi och lokalisering. Parallellt utbyggd vind, sol och bevarad vattenkraft | ✔ ([SVT aug 2025](https://www.svt.se/nyheter/inrikes/socialdemokraterna-oppnar-for-statligt-stod-till-ny-karnkraft) + "Plan för Sverige" feb 2026) |
| C | **Emot regeringens kärnkraftspaket** ("hundratals miljarder som belastar kommande generationer") men **öppna för teknikneutralt, kostnadseffektivt stöd**; förnybart + marknadslösningar | ✔ (valmanifest jun 2026) |
| MP | Förnybar utbyggnad, emot subventionerad ny kärnkraft ("tränger ut investeringar i förnybart"), rättvis klimatomställning som valets huvudfråga | ✔ (valmanifest 2026) |
| V | Förnybart, offentliga klimatinvesteringar, emot kärnkraftssubventioner | ✔ i huvuddrag |

### Klimat (jfr `profil-klimat-energi.md`, målkonflikt 1 och 5–7)

*Områdena Energi och Klimat delades 2026-08-27 efter användarfeedback — de delar kunskapsunderlag men matchas var för sig, eftersom en väljare mycket väl kan ligga nära ett parti i energifrågan och skava i klimatfrågan.*

**Tidshorisontnotering (✔ uppdaterad 2026-08-27 med utfallet):** reduktionsplikten sänktes kraftigt 2024 (kortsiktig nytta: pumppris) men **höjdes igen från 6 till 10 % för både bensin och diesel 1 juli 2025 på grund av EU:s klimatkrav**. Nu finns utfallet på båda sidor: utsläppen steg 7 % under 2024, och föll sedan 4 % (0,7 Mton) i transportsektorn 2025 med den höjda reduktionsplikten som Naturvårdsverkets främsta förklaring. Sänkningen blev alltså tillfällig, och effekten gick att mäta åt båda håll — ett ovanligt rent, verifierat exempel på sajtens grundtema. En styrmedelsutredning (maj 2026) pekar mot ytterligare höjning mot 2030.

**Axel 1: reduktionsplikten och kostnaden för transportomställningen** *(ny 2026-08-27)*

Detta är områdets mest partiskiljande fråga 2026 — och den saknades helt i förra versionen av underlaget.

| Parti | Position | Status |
|---|---|---|
| SD | Vill ha reduktionsplikten på **noll**; sänkt drivmedelsskatt är en av partiets viktigaste valfrågor, motiverad med landsbygdens kostnader | ✔ ([Gröna Mobilister aug 2026](https://gronamobilister.se/pressmeddelanden/2026/stora-skillnader-mellan-partierna-om-hallbara-transporter-ny-rapport-infor-riksdagsvalet-2026), SVT:s valkompass) |
| M | Vill **sänka nivån**; bedömer sänkt drivmedelsskatt som ett mycket bra förslag | ✔ (samma källor) |
| KD | Vill lägga Sverige på **EU:s miniminivå** (6 %); sänkt drivmedelsskatt mycket bra förslag | ✔ (samma källor) |
| L | Vill **behålla nuvarande nivå**; sänkt drivmedelsskatt ett ganska bra förslag | ✔ (samma källor) |
| C | Vill främst minska regelverkets tvärkast och öka produktion/försäljning av höginblandade biodrivmedel; bedömer sänkt drivmedelsskatt som ganska dåligt | ✔ (samma källor) |
| S | Bedömer sänkt drivmedelsskatt som ganska bra, men lägger förslaget **"Sverigebränsle"** — statlig upphandling av biodrivmedel på långa kontrakt för att pressa priset | ✔ (SVT:s valkompass, aug 2026) |
| V | Vill **höja ambitionen** i reduktionsplikten; vill höja drivmedelsskatten men med kompensation till glesbygd | ✔ (samma källor) |
| MP | Vill **höja ambitionen**; mest negativ till sänkt drivmedelsskatt ("lägre skatt på fossila drivmedel förvärrar klimatkrisen") | ✔ (samma källor) |

**Notering om fördelning, inte moral:** reduktionsplikten verkar via drivmedelspriset och träffar därför hårdast dem med långa avstånd och utan alternativ till bilen. Att vilja sänka den är en fördelningsposition med verklig grund, inte bekvämlighet — och att vilja höja den är en position om vem som ska bära kostnaden, inte klimatmoral. Matchningen ska beskriva båda så. Kopplar direkt till `profil-infrastruktur.md`.

**Axel 2: skogen som kolsänka ↔ skogen som råvara** *(ny 2026-08-27)*

Sverige har EU:s enskilt största LULUCF-åtagande: nettoupptaget ska öka med drygt 3,9 Mton till 2030. Det gör markanvändningen till klimatpolitik — och till en fråga där skiljelinjen delvis går på tvärs mot blocken.

| Parti | Position | Status |
|---|---|---|
| M, SD, KD | Aktivt skogsbruk som främsta klimatverktyg (KD: "skogen är kanske vårt främsta klimatverktyg"); minimigenomförande av EU:s restaureringsförordning, SD vill riva upp den | ✔ ([Norra Skog, jun 2026](https://www.norraskog.se/aktuellt/skogsbruk/valet-2026-sa-vill-riksdagspartierna-forma-framtidens-skogsbruk/)) |
| C | Äganderätt och aktivt brukande; ser stor potential i ökad skoglig tillväxt; emot detaljerad EU-styrning men vill använda flexibiliteten | ✔ (samma källa) |
| L | Ökad tillväxt med kollagringsfokus; äganderätten värnas med skälig ersättning; svenskt anpassat genomförande | ✔ (samma källa) |
| S | "Frihet under ansvar"; ökad kollagring genom varierat, aktivt brukande; genomförande anpassat efter svenska förhållanden | ✔ (samma källa) |
| MP, V | Vill tydligast öka skyddet och anser avverkningen för hög; MP vill minska kalhyggesbruket, V är emot ökad tillväxt via monokultur och kvävegödsling; båda vill att skyddet ska följa vad vetenskapen kräver | ✔ (samma källa + [Naturskyddsföreningen](https://www.naturskyddsforeningen.se/artiklar/val-2026-vad-lovar-partierna-for-miljon/)) |

**Osäkerhetsnotering (viktig för matchningen):** LULUCF-utfallet är bara delvis politiskt styrbart. Upptaget avgörs av avverkningsnivå men också av tillväxt, torka och skadegörare som granbarkborren, och Naturvårdsverkets senaste bedömning är att förutsättningarna förbättrats till följd av minskad avverkning och högre tillväxt — utan att det är avgjort om åtagandet nås. Fäll därför **inga** tidshorisontomdömen om vem som "räddade" eller "sänkte" kolsänkan; siffran rör sig av skäl som inte är beslut.

**Axel 3: klimatanpassning — där partierna knappt skiljer sig** *(ny 2026-08-27)*

Detta är områdets tydligaste exempel på sajtens grundtema, och det redovisas bäst som **frånvaro av skiljelinje**:

| Parti | Position | Status |
|---|---|---|
| V | Konkret förslag om statligt stöd till kommuner för klimatanpassade och grönare städer | ✔ (budgetmotion) |
| MP | Driver frågan aktivt i riksdagen — interpellerade regeringen 12 juni 2026 om varför klimatanpassningsutredningen inte lett till proposition | ✔ ([riksdagen](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/interpellation/ny-lagstiftning-for-klimatanpassning_hd10509/)) |
| Övriga | Ingen av de övriga partierna har klimatanpassning som en profilerad valfråga med belagd, distinkt position ⚠️ | ⚠️ redovisas som lucka, inte som likhet |

**Tidshorisontnotering (✔ ny 2026-08-27):** klimatanpassningsutredningen ([SOU 2025:51](https://www.regeringen.se/rattsliga-dokument/statens-offentliga-utredningar/2025/05/sou-202551/), maj 2025) lämnade elva lagförslag, bland annat att staten ska ta ansvar för skydd mot havsnivåhöjning längs vissa kuststräckor, plus förslag på finansieringsmodeller. Remisstiden gick ut 17 oktober 2025. Vid interpellationsdebatten 12 juni 2026 — nästan åtta månader senare — svarade ansvarigt statsråd (Johan Britz, L) att betänkandet är "under beredning". Ingen proposition har lagts före valet.

**Hur detta ska redovisas:** som ett **systemiskt** kortsiktighetsmisslyckande enligt `metodik.md`:s femte situation, inte som en anklagelse mot sittande regering. Beredning tar tid, och den nationella klimat- och sårbarhetsanalysen kom först i juni 2026 och är ett rimligt skäl att invänta. Den ärliga formuleringen är att området med de längsta konsekvenserna är det som fått minst politisk uppmärksamhet i valrörelsen — och den korrekta frågan till användaren är vem som **nu** vill betala för skador som uteblir, inte vem som är skyldig.

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
| KD | I huvuddrag som M; **manifestet 21 aug 2026** lägger till sänkt skatt för hushållen och **slopad reavinstskatt för långvariga bostadsägare**, samt en tung familjeekonomisk profil (barnbidrag 2 000 kr, förlängd föräldraförsäkring 6 mån, barnbonus till premiepensionen) | ✔ (valmanifest 2026) |
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
- **Kvarvarande ⚠️ efter passet 2026-08-27:** S/V/MP:s reservationer i straffreformen, balansmålsreservationerna (SOU 2024:76), V/MP/C:s hållning till medborgarskapskravens återställning, utjämningssystemet (SOU 2024:50), SD:s EU-läge 2026, L:s och C:s migrationsavsnitt i detalj, samt sex av åtta partiers position på klimatanpassning.
- **Avklarat i passet 2026-08-27:** SD:s vinstposition i välfärden ✔, S:s kärnkraftsposition ✔ (och den var dessutom felaktigt beskriven), KD:s samlade manifest ✔, klimatområdets tre saknade axlar ✔.
- **Frysdatum:** underlaget fryses 1 september och datumet visas för användaren; sena positionsbyten därefter hanteras inte. **Notera att förtidsröstningen öppnade redan 26 augusti** — underlaget läses av personer som kan rösta samma dag, vilket gör kvarvarande ⚠️-punkter mer kännbara än när frysdatumet sattes.
- **Partier under spärren:** enbart nuvarande riksdagspartier matchas, sagt öppet.
- ~~Två områden saknar underlag~~ **Alla principområden har underlag** (EU och omvärld samt infrastruktur/regionalpolitik tillagda 2026-08-09). Matchningen är därmed komplett i bredd, om än fortfarande med enskilda ⚠️-punkter kvar per område.

## Verifieringslogg 2026-08-27 (färskhetspass)

Utlöst av användarfeedback om att klimatområdet saknades i samtalet (se `plan.md` 2b). Omfattning: klimatavsnittet byggdes ut från en till fyra axlar, och samtliga övriga områden lästes om mot aktuella källor.

**Fynd som ändrade underlaget:**
- **S:s kärnkraftsposition var felaktigt beskriven.** Raden angav "teknikneutral hållning; har ifrågasatt subventionsnivån". S öppnade i själva verket för statligt stöd till ny kärnkraft i augusti 2025 och förhandlade med regeringspartierna. Kärnkraftsaxeln separerar därför inte längre blocken — en varning är inlagd i avsnittet.
- **KD:s valmanifest presenterades 21 augusti 2026** (112 löften), tolv dagar efter förra passet. Luckan i manifestläget är täppt; förstatligandet av vården anges som icke förhandlingsbart.
- **SD:s vinstposition är nu belagd mot beslut i stället för retorik** (vinststopp för nya friskolor, i kraft 1 juli 2027; inget generellt vinstförbud).
- **MP:s manifest finns i slutlig version** — förra passet citerade en utkastversion.

**Källkritisk anmärkning:** Moderaternas egen sida om reduktionsplikten (`moderaterna.se/nyhet/reduktionsplikt/`) svarar 200 men är kvar från valrörelsen 2022 — den beskriver 30,5 % inblandning och prisprognoser "till 2026". Levande länk är inte samma sak som aktuell position. Partiernas egna sidor måste dateras, inte bara nås.

Nyckelkällor: [Gröna Mobilisters partienkät (28 förslag, aug 2026)](https://gronamobilister.se/pressmeddelanden/2026/stora-skillnader-mellan-partierna-om-hallbara-transporter-ny-rapport-infor-riksdagsvalet-2026) · [Norra Skogs partienkät om skogsbruk (jun 2026)](https://www.norraskog.se/aktuellt/skogsbruk/valet-2026-sa-vill-riksdagspartierna-forma-framtidens-skogsbruk/) · [SVT:s valkompass 2026](https://valkompass.svt.se/2026/) · [SOU 2025:51 klimatanpassning](https://www.regeringen.se/rattsliga-dokument/statens-offentliga-utredningar/2025/05/sou-202551/) · [Interpellationsdebatt om klimatanpassning, jun 2026](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/interpellation/ny-lagstiftning-for-klimatanpassning_hd10509/) · [S öppnar för statligt stöd till kärnkraft](https://www.svt.se/nyheter/inrikes/socialdemokraterna-oppnar-for-statligt-stod-till-ny-karnkraft) · [Vinststopp för nya friskolor](https://www.svt.se/nyheter/inrikes/regeringen-vill-infora-vinststopp-for-nya-friskolor) · [Naturvårdsverket om transportutsläppen](https://www.naturvardsverket.se/data-och-statistik/klimat/vaxthusgaser-utslapp-fran-inrikes-transporter/) · [Naturskyddsföreningens partienkät](https://www.naturskyddsforeningen.se/artiklar/val-2026-vad-lovar-partierna-for-miljon/).

**Balansanmärkning om enkätkällorna:** Gröna Mobilister, Naturskyddsföreningen och Norra Skog är alla intresseorganisationer med egen agenda — de två första miljöinriktade, den tredje skogsnäringens. Det som används här är partiernas *egna svar* på identiska frågor, inte organisationernas rankning eller värdering av svaren. Rankningarna ("MP bäst, SD sämst") används inte och ska inte användas.

## Verifieringslogg 2026-08-09

Nyckelkällor använda vid verifieringspasset (utöver partiernas egna manifestsidor): [S valplattform "Plan för Sverige"](https://www.socialdemokraterna.se/nyheter/nyheter/2026-02-05-plan-for-sverige---socialdemokraterna-presenterar-valplattform-2026) · [V valplattform 2026](https://www.vansterpartiet.se/wp-content/uploads/2026/04/Preliminar-Valplattform-efter-beslut-pa-kongressen-2026.pdf) · [C valmanifest "Sverige kan mer"](https://val2026.centerpartiet.se/) · [L "För din frihet"](https://www.liberalerna.se/liberalernas-valmanifest-2026) · [M vallöften 2026](https://moderaterna.se/valloften-2026/) · [SD valplattform 2026](https://www.sd.se/wp-content/uploads/2026/07/valplattform-2026.pdf) · [MP valmanifest 2026](https://www.mp.se/valmanifest-2026-utkast/) · [SOU 2025:62 Vårdansvarskommittén](https://www.regeringen.se/pressmeddelanden/2025/06/staten-foreslas-ta-storre-ansvar-for-varden/) · [Straffreformen apr 2026](https://www.regeringen.se/pressmeddelanden/2026/04/den-storsta-reformen-av-det-svenska-straffsystemet-sedan-brottsbalken-infordes/) · [Nya medborgarskapsregler](https://www.migrationsverket.se/nyhetsarkiv/nyhetsarkiv/2026-05-06-nya-regler-for-svenskt-medborgarskap-fran-och-med-6-juni-2026.html) · [Reduktionsplikt](https://www.ekonomifakta.se/sakomraden/energi/styrmedel/reduktionsplikt_1211453.html) · SVT/TN/Borskollen-rapportering om fastighetsskatt och ISK.
