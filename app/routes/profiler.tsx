import { Link } from "react-router";
import type { Route } from "./+types/profiler";
import { PageShell } from "../components/PageShell";
import { PROFILES } from "../lib/profiles";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Kunskapsunderlag — Konsekvenskompassen" },
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
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
