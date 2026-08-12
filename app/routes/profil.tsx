import { Link } from "react-router";
import type { Route } from "./+types/profil";
import { PageShell } from "../components/PageShell";
import { Markdown } from "../components/Markdown";
import { findProfile } from "../lib/profiles";

export function meta({ params }: Route.MetaArgs) {
  const profile = findProfile(params.slug);
  return [
    {
      title: profile
        ? `${profile.title} — Valsnack`
        : "Okänd profil — Valsnack",
    },
    ...(profile
      ? [{ name: "description", content: profile.description }]
      : []),
  ];
}

export default function Profil({ params }: Route.ComponentProps) {
  const profile = findProfile(params.slug);

  if (!profile) {
    return (
      <PageShell>
        <h1 className="text-2xl font-bold tracking-tight">
          Profilen finns inte
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Det finns ingen profil på den här adressen. Se{" "}
          <Link to="/profiler" className="underline underline-offset-2">
            alla kunskapsunderlag
          </Link>
          .
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/profiler" className="underline underline-offset-2">
          ← Alla kunskapsunderlag
        </Link>
      </p>
      <Markdown>{profile.md}</Markdown>
    </PageShell>
  );
}
