import { Link } from "react-router";
import type { Route } from "./+types/profiler";
import { PageShell } from "../components/PageShell";
import { PROFILES } from "../lib/profiles";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Kunskapsunderlag — Valsnack" },
    {
      name: "description",
      content:
        "Källbelagda profiler över målkonflikter, systemeffekter och tidshorisonter per politikområde.",
    },
  ];
}

export default function Profiler() {
  return (
    <PageShell>
      <h1 className="text-2xl font-bold tracking-tight">Kunskapsunderlag</h1>
      <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
        För varje område har vi tagit fram en källbelagd profil: vilka värden
        som krockar, vad som händer på andra håll i systemet, och vem som bär
        kostnaden eller får nyttan — nu, om tio år, om en generation. Det är
        detta underlag kompassen använder i samtalet, i stället för att
        improvisera fritt. Hur profilerna tas fram beskrivs på{" "}
        <Link to="/metodik" className="underline underline-offset-2">
          metodiksidan
        </Link>
        .
      </p>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Status: profilerna är utkast som ännu inte genomgått extern granskning
        av läsare med annan politisk hemvist — det steget ingår i metodiken och
        pågår.
      </p>
      <ul className="mt-8 space-y-5">
        {PROFILES.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/profiler/${p.slug}`}
              className="text-lg font-semibold underline-offset-2 hover:underline"
            >
              {p.title}
            </Link>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {p.description}
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Senast ändrad {p.updated}
            </p>
          </li>
        ))}
      </ul>
      <hr className="my-8 border-gray-200 dark:border-gray-800" />
      <h2 className="text-lg font-semibold tracking-tight">
        Underlaget för partimatchningen
      </h2>
      <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
        Den frivilliga partimatchningen efter analysen drivs av ett eget
        dokument: partiernas positioner per område, med källa och status för
        varje rad. Det är publicerat i sin helhet, inklusive raderna vi ännu
        inte kunnat belägga.
      </p>
      <p className="mt-3">
        <Link
          to="/partimatchning"
          className="font-semibold underline underline-offset-2"
        >
          Läs underlaget för partimatchningen
        </Link>
      </p>
    </PageShell>
  );
}
