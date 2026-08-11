import type { Route } from "./+types/integritet";
import { PageShell } from "../components/PageShell";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Integritet — Konsekvenskompassen" },
    {
      name: "description",
      content:
        "Vad som sparas, vad som inte sparas, och vart dina svar skickas.",
    },
  ];
}

export default function Integritet() {
  return (
    <PageShell>
      <h1 className="text-2xl font-bold tracking-tight">Integritet</h1>

      <div className="mt-4 space-y-4 leading-relaxed text-gray-700 dark:text-gray-300">
        <p>
          Politiska åsikter är känsliga personuppgifter enligt GDPR. Tjänsten
          är därför byggd efter en enkel princip:{" "}
          <strong>
            dina svar ska aldrig lagras kopplade till vem du är.
          </strong>
        </p>

        <h2 className="mt-8 text-lg font-semibold">Vad som inte sparas</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Inga konton, ingen inloggning, ingen e-postadress — vi vet inte vem
            du är.
          </li>
          <li>
            Samtalets innehåll — dina svar och kompassens frågor — lagras inte
            på våra servrar.
          </li>
          <li>
            Knappen "Ladda ner samtalet" skapar filen lokalt i din webbläsare;
            inget skickas någonstans.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold">Vad som sparas</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Anonym användningsstatistik: ett slumpat sessions-id (skapas i din
            webbläsare, säger inget om dig), vilket steg samtalet nått, antal
            meddelanden, eventuella tekniska fel, och ditt betyg om du lämnar
            feedback. Det är allt.
          </li>
          <li>
            Om du väljer att skriva en frivillig feedbackkommentar sparas den
            — det står vid fältet, och den visas inte offentligt.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold">Vart dina svar skickas</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            För att generera kompassens frågor och analys skickas samtalet till
            Anthropics API (språkmodellen Claude). Enligt Anthropics
            API-villkor används inte sådan data för att träna deras modeller.
          </li>
          <li>
            Frågan om yrke, ort och livssituation är helt frivillig — svara så
            ungefärligt du vill, eller be att få hoppa över den. Den ställs
            bara för att göra samtalets följdfrågor mer konkreta.
          </li>
        </ul>

        <p className="mt-8">
          Frågor om hanteringen?{" "}
          <a
            href="mailto:demokratisakrat@gastrin.se"
            className="underline underline-offset-2"
          >
            demokratisakrat@gastrin.se
          </a>
        </p>
      </div>
    </PageShell>
  );
}
