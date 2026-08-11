import type { Route } from "./+types/stats";
import { cloudflareContext } from "../lib/cloudflare-context.server";
import { fetchUsageStats, type UsageStats } from "../lib/analytics-query.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Statistik — Konsekvenskompassen" }];
}

type LoaderData =
  | { ok: true; stats: UsageStats }
  | { ok: false; error: string };

export async function loader({ context }: Route.LoaderArgs): Promise<LoaderData> {
  const { env } = context.get(cloudflareContext);
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const token = env.CLOUDFLARE_ANALYTICS_API_TOKEN;

  if (!accountId || !token) {
    return {
      ok: false,
      error:
        "CLOUDFLARE_ACCOUNT_ID och/eller CLOUDFLARE_ANALYTICS_API_TOKEN saknas som Worker-secrets.",
    };
  }

  try {
    const stats = await fetchUsageStats(accountId, token);
    return { ok: true, stats };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Okänt fel",
    };
  }
}

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500">{sub}</div>}
    </div>
  );
}

const STEP_LABELS: Record<number, string> = {
  1: "Väljarprofil",
  2: "Principfrågor",
  3: "Sakfrågor 2026",
  4: "Analys",
  5: "Partimatchning",
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m} min ${s} s`;
}

function StepTimingsTable({ data }: { data: UsageStats["stepTimings"] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-500">Ingen data än.</p>;
  }
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-800">
          <th className="py-1">Steg</th>
          <th className="py-1">Snitt tid</th>
          <th className="py-1">Antal</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.step} className="border-b border-gray-100 dark:border-gray-900">
            <td className="py-1">{STEP_LABELS[d.step] ?? `Steg ${d.step}`}</td>
            <td className="py-1">{formatDuration(d.avgSeconds)}</td>
            <td className="py-1">{d.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DailySessionsChart({ data }: { data: UsageStats["dailySessions"] }) {
  const max = Math.max(1, ...data.map((d) => d.sessions));
  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {data.map((d) => (
          <div
            key={d.day}
            title={`${new Date(d.day).toLocaleDateString("sv-SE")}: ${d.sessions} sessioner`}
            className="flex-1 rounded-t bg-gray-700 dark:bg-gray-300"
            style={{ height: `${(d.sessions / max) * 100}%`, minHeight: d.sessions > 0 ? "2px" : "0" }}
          />
        ))}
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-gray-500 dark:text-gray-400">
          Visa som tabell
        </summary>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-1">Dag</th>
              <th className="py-1">Sessioner</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.day} className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-1">{new Date(d.day).toLocaleDateString("sv-SE")}</td>
                <td className="py-1">{d.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export default function Stats({ loaderData }: Route.ComponentProps) {
  if (!loaderData.ok) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-xl font-bold">Statistik</h1>
        <p className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {loaderData.error}
        </p>
      </main>
    );
  }

  const { stats } = loaderData;
  const completionPct =
    stats.completion.totalSessions > 0
      ? Math.round(
          (stats.completion.completedSessions / stats.completion.totalSessions) * 100,
        )
      : null;
  const npsScore =
    stats.nps.responses > 0
      ? Math.round(((stats.nps.promoters - stats.nps.detractors) / stats.nps.responses) * 100)
      : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-bold">Statistik</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Senaste 30 dagarna. Innehållsfritt — inga svar eller ståndpunkter, bara
        användningsmönster.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Sessioner"
          value={String(stats.completion.totalSessions)}
        />
        <StatTile
          label="Completion-andel"
          value={completionPct !== null ? `${completionPct}%` : "—"}
          sub={`${stats.completion.completedSessions} av ${stats.completion.totalSessions}`}
        />
        <StatTile
          label="NPS"
          value={npsScore !== null ? String(npsScore) : "—"}
          sub={`${stats.nps.responses} svar, snitt ${stats.nps.avgScore?.toFixed(1) ?? "—"}`}
        />
        <StatTile
          label="Snitt total tid"
          value={
            stats.avgTotalMinutes !== null
              ? formatDuration(stats.avgTotalMinutes * 60)
              : "—"
          }
        />
      </div>

      <h2 className="mb-2 mt-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
        Sessioner per dag
      </h2>
      <DailySessionsChart data={stats.dailySessions} />

      <h2 className="mb-2 mt-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
        Tid per steg
      </h2>
      <StepTimingsTable data={stats.stepTimings} />
    </main>
  );
}
