import type { Route } from "./+types/metodik";
import { PageShell } from "../components/PageShell";
import { Markdown } from "../components/Markdown";
import metodikMd from "../content/metodik.md?raw";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Metodik & källor — Valsnack" },
    {
      name: "description",
      content:
        "Hur underlaget tas fram: källhierarki, balanskontroll och granskningsflöde.",
    },
  ];
}

export default function Metodik() {
  return (
    <PageShell>
      <h1 className="text-2xl font-bold tracking-tight">Metodik &amp; källor</h1>
      <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
        "Opartisk" är ett stort anspråk att göra om sig själv. Därför
        publicerar vi hela arbetsdokumentet som styr hur underlaget tas fram —
        inklusive de svagheter och öppna frågor vi själva ser. Dokumentet
        hänvisar till projektets interna filer; allt väsentligt innehåll finns
        publicerat här på sajten under kunskapsunderlagen.
      </p>
      <hr className="my-8 border-gray-200 dark:border-gray-800" />
      <Markdown>{metodikMd}</Markdown>
    </PageShell>
  );
}
