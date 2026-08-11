# Metodik för målkonflikter, systemeffekter och tidshorisonter

Detta löser den trovärdighetsrisk som flaggades i `koncept.md`: så fort sajten beskriver en "systemeffekt" eller "målkonflikt" är det ett redaktionellt val, och långsiktighet/systemtänk kodas ofta politiskt. Utan en tydlig metod blir sajten själv ett mål för den polarisering den vill motverka.

## 1. Arkitekturval: kuraterat innehåll, inte fri AI-improvisation

I promptexperimenten (`valkompass prompt v1–v7.txt`) har AI:n improviserat målkonflikter och systemeffekter fritt. Bra för att testa *frågeflödet*, men olämpligt i en riktig produkt: improvisation ger inkonsekvens mellan samtal, ingen granskningsbarhet, och risk för att modellen omedvetet lutar åt ett håll.

**Beslut:** varje sakfråga/område ska ha en skriven, källbelagd "profil" (2–4 målkonflikter, systemeffekter, tidshorisont-påståenden) som tas fram och granskas i förväg. AI:n använder profilen för att formulera personliga, kontextanpassade uppföljningsfrågor — men uppfinner inte sakinnehållet själv. AI:t sköter *samtalet*, redaktionen sköter *sakinnehållet*.

## 2. Källhierarki

Vad får ligga till grund för en profil, i fallande prioritet:

1. Myndighetsrapporter och officiell statistik (SCB, Riksrevisionen, Konjunkturinstitutet, Naturvårdsverket, IVO, m.fl.)
2. Statliga utredningar (SOU, kommittédirektiv) — dessa har ofta redan kartlagt avvägningarna åt oss
3. Etablerad forskningskonsensus (peer review, eller erkända sammanställningar, t.ex. IPCC för klimat)
4. Internationella jämförelser/erfarenheter (OECD, andra länders utfall av liknande reformer)

**Undvik som enda källa:** debattartiklar, partiprogram, opinionsundersökningar (de visar vad folk tycker, inte vad som faktiskt händer).

## 3. Balanskontroll

Varje målkonflikt ska formuleras så att båda sidor av avvägningen framstår som legitima — ingen sida ska vara "det rimliga" och den andra "hindret".

**Enkelt självtest för varje formulering:** *skulle en anhängare av vardera sida känna sig rättvist beskriven?* Om inte, skriv om.

Skilj tydligt mellan:
- **Etablerad konsensus** (t.ex. klimatförändringens grundmekanismer) — presenteras som fakta.
- **Rimlig men omtvistad bedömning** (t.ex. exakt hur mycket en skattehöjning påverkar företagsflytt) — flaggas explicit som osäker, med källa till båda håll om sådana finns.

**En tredje, kritisk distinktion (upptäckt under pilotprofilen för Lag och ordning):** skilj mellan målkonflikter där båda sidor gör **empiriska påståenden** (kan vägas mot forskning) och målkonflikter där en sida är **värdebaserad snarare än effektbaserad** (t.ex. att straff bör vara proportionerligt oavsett brottsförebyggande effekt). I det andra fallet är det inte forskningens roll att "vinna" åt någon — balanskontrollen måste explicit erkänna värdeargumentet som giltigt i sig. Att blanda ihop de två är sannolikt den enskilt största risken för att en "objektiv, forskningsbaserad" profil omärkligt glider över i att ta ställning i en värderingsfråga. Se `profil-lag-och-ordning.md` för ett konkret exempel.

**En fjärde situation (upptäckt under pilotprofilen för Ekonomi och skatter): gap mellan expertkonsensus och politisk konsensus.** Ibland råder bred enighet bland forskare/experter åt ett håll och samtidigt bred enighet bland partierna åt det motsatta (typexempel: fastighetsskatten — ekonomer eniga om att den är en effektiv skattebas, riksdagspartierna i praktiken eniga om att inte återinföra den). Frestelsen är att låta expertkonsensusen "vinna" och beskriva politiken som feg. Men det tar dolt ställning i två värderingsfrågor: att effektivitet är det överordnade värdet, och att väljarnas dom inte var legitim. Hanteringen: **redovisa båda konsensus öppet som fakta om läget, och låt spänningen stå kvar obesvarad** — den är exakt den sortens spänning sajten finns för att synliggöra, inte avgöra. Se `profil-ekonomi-skatter.md`.

## 3b. Ton-test (stående kontroll av samtalets balans)

Balanskontrollen ovan granskar *innehållet*; ton-testet granskar *samtalet*. Även med kuraterade profiler är varje bekräftelse ("det stämmer med forskningen", "rimligt resonemang") ett redaktionellt val, och språkmodeller kan ha egen politisk lutning.

**Metod:** kör två samtal med identisk persona (samma yrke, ort, livssituation, väljartyp) men spegelvända åsikter, med symmetriskt korta och tvärsäkra svar. Jämför per sida: antal uppföljningar/utmaningar, antal callbacks, hur ofta skip-regeln utlöses, valideringsspråkets register, och antal iakttagelser vid kontext-checkpointen. Asymmetrier ska antingen kunna motiveras sakligt (den ena sidans svar innehöll fler verkliga motsägelser) eller åtgärdas i prompten.

**Körs om vid:** promptändringar som rör grundprincipen eller checkpointen, modellbyte, och inför lansering.

**Första körningen (2026-08-09, prompt v4):** i huvudsak balanserat — jämnt utmaningstryck, samma faktaunderlag använt mot båda sidor, värde/empiri-distinktionen respekterad. Två fynd: (1) checkpointen flaggar bara *spänning* mellan självintresse och princip, aldrig *sammanfall* — vilket systematiskt gynnar den vars åsikter ligger i linje med egenintresset; föreslagen promptändring: notera även sammanfall neutralt. (2) Svepande utvägar ("mer resurser" vs. "effektiviseringar") behandlades olika åt varsitt håll — under bevakning. Se `test-conversations/ton-test-analys-2026-08-09.md`.

## 4. Granskningsflöde

För ett litet/enmansdrivet projekt behöver detta vara görbart utan en fullskalig redaktion från dag ett:

1. **Utkast** — profilen skrivs med källor synliga inline.
2. **Självtest** (balanskontroll ovan).
3. **Extern läsning** — minst en person med annan politisk hemvist än skribenten läser igenom och flaggar snedvridning, innan publicering. (Detta är den svagaste länken i ett enmansprojekt — se öppna frågor nedan.)
4. **Sakkunniggranskning vid behov** — för tekniskt tunga ämnen (energi, makroekonomi) bör minst en källa/faktapunkt komma från en person med sakkunskap, inte bara sekundärkällor.
5. **Publicering med synliga källor** — varje påstående länkat, inte bara en allmän källista längst ner.

## 5. Transparens utåt

- En publik metodiksida (baserad på detta dokument) beskriver processen: hur profiler tas fram, vem granskar, hur ofta de uppdateras.
- Tydlig avsändarangivelse — vem står bakom sajten, och vilket incitament de har (särskilt viktigt eftersom "opartisk valkompass" annars är ett stort trovärdighetspåstående att göra själv).

## 6. Uppdateringsprocess

- **Sakfrågor** (dagsaktuella, steg 3 i kompassen): ses över inför varje val och vid större politiska händelser.
- **Ideologiska principområden** (steg 2): mer stabila i sak, men själva profilerna (källor, statistik) bör uppdateras minst årligen så de inte blir daterade.

## Öppna frågor kvar att lösa

- **Extern läsning i praktiken:** var hittas 1–2 personer med avvikande politisk hemvist som är villiga att granska löpande, utan att det blir en stor organisatorisk apparat? Kandidater: tvärpolitiska nätverk, journaliststudenter, pensionerade tjänstemän från olika departement.
- **Skalning:** metoden fungerar för ett litet antal profiler (7 principområden + några sakfrågor). Om sajten växer till fler ämnen ökar granskningsbördan proportionellt — värt att bestämma en gräns för hur många profiler som underhålls aktivt samtidigt.
