import type { Route } from "./+types/andringar";
import { PageShell } from "../components/PageShell";
import { Markdown } from "../components/Markdown";
import andringarMd from "../content/andringar.md?raw";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Ändringar i underlaget — Valsnack" },
    {
      name: "description",
      content:
        "Vad som ändrats i Valsnacks frågor och kunskapsunderlag under valrörelsen, och varför.",
    },
  ];
}

export default function Andringar() {
  return (
    <PageShell>
      <Markdown>{andringarMd}</Markdown>
    </PageShell>
  );
}
