import type { Route } from "./+types/om";
import { PageShell } from "../components/PageShell";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Om & kontakt — Konsekvenskompassen" },
    {
      name: "description",
      content: "Vem som står bakom Konsekvenskompassen och hur du når oss.",
    },
  ];
}

export default function Om() {
  return (
    <PageShell>
      <h1 className="text-2xl font-bold tracking-tight">Om &amp; kontakt</h1>

      <div className="mt-4 space-y-4 leading-relaxed text-gray-700 dark:text-gray-300">
        <p>
          Konsekvenskompassen är ett fristående, ideellt enmansprojekt. Det
          har ingen koppling till något parti eller någon organisation, ingen
          extern finansiering och inga annonser — och därmed inget incitament
          att knuffa dig åt något håll. Målet är eftertanke, inte att tala om
          för någon vad den ska tycka eller rösta på.
        </p>
        <p>
          All kod och allt underlag är öppen källkod och utvecklas öppet under
          GitHub-organisationen{" "}
          <a
            href="https://github.com/demokratisakrat"
            className="underline underline-offset-2"
          >
            Demokratisäkrat
          </a>{" "}
          — där kan du se exakt hur kompassen fungerar, ned till varje
          formulering i underlaget.
        </p>
        <p>
          Samtalen i kompassen drivs av en AI-språkmodell (Claude), men
          sakinnehållet — målkonflikter, systemeffekter, källor — kommer från
          ett i förväg skrivet, källbelagt underlag som du kan läsa i sin
          helhet under{" "}
          <a href="/profiler" className="underline underline-offset-2">
            kunskapsunderlagen
          </a>
          . Hur det tas fram beskrivs på{" "}
          <a href="/metodik" className="underline underline-offset-2">
            metodiksidan
          </a>
          .
        </p>
        <p>
          Ärlig varudeklaration: underlaget har ännu inte genomgått extern
          granskning av läsare med annan politisk hemvist. Det steget ingår i
          metodiken och pågår — tills det är klart är allt märkt som utkast.
        </p>
        <p>
          Frågor, felaktigheter i underlaget, eller intresse av att granska?
          Hör av dig:{" "}
          <a
            href="mailto:demokratisakrat@gastrin.se"
            className="underline underline-offset-2"
          >
            demokratisakrat@gastrin.se
          </a>
          . Påpekanden om sakfel eller snedvridning är särskilt välkomna — de
          gör underlaget bättre.
        </p>
      </div>
    </PageShell>
  );
}
