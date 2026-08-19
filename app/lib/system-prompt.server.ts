import prompt from "../content/valkompass-prompt.txt?raw";
import uiContext from "../content/ui-context.md?raw";
import profilValfard from "../content/profil-valfard.md?raw";
import profilLagOchOrdning from "../content/profil-lag-och-ordning.md?raw";
import profilKlimatEnergi from "../content/profil-klimat-energi.md?raw";
import profilEkonomiSkatter from "../content/profil-ekonomi-skatter.md?raw";
import profilMigration from "../content/profil-migration.md?raw";
import profilEuOmvarld from "../content/profil-eu-omvarld.md?raw";
import profilInfrastruktur from "../content/profil-infrastruktur.md?raw";
import partimatchning from "../content/partimatchning.md?raw";

let cached: string | undefined;

export function buildSystemPrompt(): string {
  if (cached) return cached;

  const profiles = [
    profilValfard,
    profilLagOchOrdning,
    profilKlimatEnergi,
    profilEkonomiSkatter,
    profilMigration,
    profilEuOmvarld,
    profilInfrastruktur,
  ].join("\n\n---\n\n");

  cached = `${prompt}

---

${uiContext}

---

KURATERADE PROFILER (använd som sakligt underlag när relevant område kommer upp — källbelagda och granskade enligt en metodik, till skillnad från fri improvisation):

${profiles}

---

PARTIMATCHNINGSUNDERLAG (används ENDAST i steg 5, enligt prompten ovan):

${partimatchning}

---

OBS: kuraterade profiler finns nu för samtliga sju principområden (Välfärd, Ekonomi och skatter, Klimat och energi, Lag och ordning, EU och omvärld, Migration och medborgarskap, samt Infrastruktur och regionalpolitik). Dagsaktuella sakfrågor i steg 3 saknar däremot kuraterat underlag i denna prototyp — resonera så noggrant du kan utifrån allmän kunskap, men var öppen om att det inte är lika väl källbelagt som profilerna ovan, om det blir relevant.`;

  return cached;
}
