import { Link } from "react-router";
import type { Route } from "./+types/partimatchning";
import { PageShell } from "../components/PageShell";
import { Markdown } from "../components/Markdown";
import partimatchningMd from "../content/partimatchning.md?raw";

// Sidans datum sätts för hand, som profilernas i profiles.ts — "ändrad",
// aldrig "granskad", så länge ingen utomstående läst underlaget.
const UPDATED = "2026-08-28";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Underlaget för partimatchningen — Valsnack" },
    {
      name: "description",
      content:
        "Det kuraterade underlaget som styr den frivilliga partimatchningen: partiernas positioner per område, med källor och kvarvarande osäkerheter.",
    },
  ];
}

export default function Partimatchning() {
  return (
    <PageShell>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/profiler" className="underline underline-offset-2">
          ← Alla kunskapsunderlag
        </Link>
      </p>
      <h1 className="text-2xl font-bold tracking-tight">
        Underlaget för partimatchningen
      </h1>
      <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
        Partimatchningen är ett frivilligt steg efter analysen, och den
        improviseras inte fram. Den drivs av dokumentet nedan — partiernas
        positioner per område, med källa och status för varje rad. Vi
        publicerar det i sin helhet, inklusive de rader vi ännu inte kunnat
        belägga: kan du inte granska underlaget kan du inte värdera
        matchningen.
      </p>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Senast ändrad {UPDATED}. Dokumentet är ett arbetsdokument och hänvisar
        på sina ställen till projektets interna filer; sakinnehållet finns
        publicerat här och under{" "}
        <Link to="/profiler" className="underline underline-offset-2">
          kunskapsunderlagen
        </Link>
        . Se även{" "}
        <Link to="/andringar" className="underline underline-offset-2">
          vad som ändrats och varför
        </Link>
        .
      </p>
      <hr className="my-8 border-gray-200 dark:border-gray-800" />
      <Markdown>{partimatchningMd}</Markdown>
    </PageShell>
  );
}
