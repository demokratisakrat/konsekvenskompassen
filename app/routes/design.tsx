import type { Route } from "./+types/design";
import { PageShell } from "../components/PageShell";
import { Logo } from "../components/Logo";
import { Markdown } from "../components/Markdown";

// Olänkad designgranskningssida: visar identiteten och tabellrenderingen
// (partichips, närhetsbadges) utan att behöva klicka igenom ett helt samtal.
// All tabelldata är påhittad — sidan säger det högt och tydligt.

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Designgranskning — Valsnack" },
    { name: "robots", content: "noindex" },
  ];
}

const SAMPLE_SYSTEMPROFIL = `| Dimension | Bedömning | Grund i korthet |
|---|---|---|
| Tidshorisont | Genomgående långsiktig | Exempeltext för designgranskning |
| Konfliktmedvetenhet | Blandad | Exempeltext för designgranskning |
| Självintresse vs. princip | Ingen spänning | Exempeltext för designgranskning |`;

const SAMPLE_MATCHNING = `| Område | S | V | MP | C | L | M | KD | SD |
|---|---|---|---|---|---|---|---|---|
| Välfärd | NÄRA | DELVIS | SKAVER | NÄRA | DELVIS | SKAVER ⚠️ | NÄRA | DELVIS |
| Ekonomi | SKAVER | NÄRA | DELVIS ⚠️ | SKAVER | NÄRA | DELVIS | SKAVER | NÄRA |
| Klimat | DELVIS | SKAVER | NÄRA | DELVIS | SKAVER | NÄRA | DELVIS ⚠️ | SKAVER |`;

export default function Design() {
  return (
    <PageShell>
      <h1 className="text-2xl font-bold tracking-tight">Designgranskning</h1>
      <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Alla tabellvärden nedan är påhittad exempeldata för att granska
        formgivningen — de är inte verkliga partipositioner.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Logotyp</h2>
      <div className="mt-3 flex items-end gap-6">
        <Logo size={96} />
        <Logo size={56} />
        <Logo size={28} />
        <Logo size={16} />
      </div>

      <h2 className="mt-8 text-lg font-semibold">Systemprofil (steg 4)</h2>
      <div className="mt-3">
        <Markdown>{SAMPLE_SYSTEMPROFIL}</Markdown>
      </div>

      <h2 className="mt-8 text-lg font-semibold">
        Partimatchning (steg 5) — chips och närhetsbadges
      </h2>
      <div className="mt-3">
        <Markdown>{SAMPLE_MATCHNING}</Markdown>
      </div>
    </PageShell>
  );
}
