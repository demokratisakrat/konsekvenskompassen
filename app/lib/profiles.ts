import profilValfard from "../content/profil-valfard.md?raw";
import profilLagOchOrdning from "../content/profil-lag-och-ordning.md?raw";
import profilKlimatEnergi from "../content/profil-klimat-energi.md?raw";
import profilEkonomiSkatter from "../content/profil-ekonomi-skatter.md?raw";
import profilMigration from "../content/profil-migration.md?raw";
import profilEuOmvarld from "../content/profil-eu-omvarld.md?raw";
import profilInfrastruktur from "../content/profil-infrastruktur.md?raw";

export type Profile = {
  slug: string;
  title: string;
  description: string;
  md: string;
};

export const PROFILES: Profile[] = [
  {
    slug: "valfard",
    title: "Välfärd och statens roll",
    description:
      "Valfrihet vs. likvärdighet, vinstfrågan, och den långsiktiga personalförsörjningen i vården.",
    md: profilValfard,
  },
  {
    slug: "lag-och-ordning",
    title: "Lag och ordning",
    description:
      "Straffskärpning vs. upptäcktsrisk, kriminalvårdens kapacitet, och skillnaden mellan empiri och rättskänsla.",
    md: profilLagOchOrdning,
  },
  {
    slug: "klimat-energi",
    title: "Klimat och energi",
    description:
      "Styrmedel, kärnkraft vs. förnybart, och elnätet som strukturell flaskhals.",
    md: profilKlimatEnergi,
  },
  {
    slug: "ekonomi-skatter",
    title: "Ekonomi och skatter",
    description:
      "Omfördelning vs. drivkrafter, skatt på arbete vs. kapital, och budgetdisciplin vs. investeringsbehov.",
    md: profilEkonomiSkatter,
  },
  {
    slug: "migration",
    title: "Migration och medborgarskap",
    description:
      "Humanitärt åtagande vs. kapacitet, arbetskraftsinvandring och välfärdens personalförsörjning, krav vs. exkludering.",
    md: profilMigration,
  },
  {
    slug: "eu-omvarld",
    title: "EU och omvärld",
    description:
      "Gemensam handlingskraft vs. självbestämmande, avgift vs. marknadstillträde, och säkerhetspolitikens bindningar.",
    md: profilEuOmvarld,
  },
  {
    slug: "infrastruktur",
    title: "Infrastruktur och regionalpolitik",
    description:
      "Lönsamhet vs. regional rättvisa, underhåll vs. nybyggnad, och utjämningen mellan kommuner.",
    md: profilInfrastruktur,
  },
];

export function findProfile(slug: string | undefined): Profile | undefined {
  return PROFILES.find((p) => p.slug === slug);
}
