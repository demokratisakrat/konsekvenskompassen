type Row = Record<string, string | number>;

async function query(
  accountId: string,
  token: string,
  sql: string,
): Promise<Row[]> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: sql,
    },
  );
  if (!res.ok) {
    throw new Error(
      `Analytics Engine-fråga misslyckades (${res.status}): ${await res.text()}`,
    );
  }
  const json = (await res.json()) as { data?: Row[] };
  return json.data ?? [];
}

export type DailySessions = { day: string; sessions: number };
export type CompletionStats = { totalSessions: number; completedSessions: number };
export type NpsStats = {
  responses: number;
  avgScore: number | null;
  promoters: number;
  detractors: number;
  comments: number;
};
export type StepTiming = { step: number; avgSeconds: number; count: number };

export type UsageStats = {
  dailySessions: DailySessions[];
  completion: CompletionStats;
  nps: NpsStats;
  stepTimings: StepTiming[];
  avgTotalMinutes: number | null;
};

const DATASET = "demokratisakrat_analytics";
const WINDOW_DAYS = 30;
const SINCE = `timestamp > NOW() - INTERVAL '${WINDOW_DAYS}' DAY`;

export async function fetchUsageStats(
  accountId: string,
  token: string,
): Promise<UsageStats> {
  const q = (sql: string) => query(accountId, token, sql);

  const [
    dailyRows,
    totalRows,
    completedRows,
    npsRows,
    promoterRows,
    detractorRows,
    stepTimingRows,
    totalDurationRows,
    commentRows,
  ] = await Promise.all([
    q(`SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS day, COUNT(DISTINCT index1) AS sessions
       FROM ${DATASET}
       WHERE blob1 = 'session_started' AND ${SINCE}
       GROUP BY day ORDER BY day ASC
       FORMAT JSON`),
    q(`SELECT COUNT(DISTINCT index1) AS total
       FROM ${DATASET}
       WHERE blob1 = 'session_started' AND ${SINCE}
       FORMAT JSON`),
    q(`SELECT COUNT(DISTINCT index1) AS completed
       FROM ${DATASET}
       WHERE blob1 = 'turn' AND double2 >= 4 AND ${SINCE}
       FORMAT JSON`),
    q(`SELECT COUNT() AS responses, AVG(double1) AS avg_score
       FROM ${DATASET}
       WHERE blob1 = 'feedback_nps' AND ${SINCE}
       FORMAT JSON`),
    q(`SELECT COUNT() AS promoters
       FROM ${DATASET}
       WHERE blob1 = 'feedback_nps' AND double1 >= 9 AND ${SINCE}
       FORMAT JSON`),
    q(`SELECT COUNT() AS detractors
       FROM ${DATASET}
       WHERE blob1 = 'feedback_nps' AND double1 <= 6 AND ${SINCE}
       FORMAT JSON`),
    // step_timing: double1 = steg som avslutades, double2 = varvtid (ms), double3 = total tid sen start (ms).
    // Klienten pausar inte klockan när fliken ligger i bakgrunden, så en flik som
    // lämnats öppen ger absurda varvtider — filtrera bort varv > 20 min som outliers.
    q(`SELECT double1 AS step, AVG(double2) / 1000 AS avg_seconds, COUNT() AS n
       FROM ${DATASET}
       WHERE blob1 = 'step_timing' AND double2 < 1200000 AND ${SINCE}
       GROUP BY step ORDER BY step
       FORMAT JSON`),
    // Total tid till steg 4 är avklarat, dvs kärnflödets fyra steg. Samma
    // outlier-problem som ovan: totaltider > 60 min är nästan säkert vilande flikar.
    q(`SELECT AVG(double3) / 60000 AS avg_minutes, COUNT() AS n
       FROM ${DATASET}
       WHERE blob1 = 'step_timing' AND double1 = 4 AND double3 < 3600000 AND ${SINCE}
       FORMAT JSON`),
    // Bara antalet — kommentarernas innehåll hör inte hemma på den publika statistiksidan.
    q(`SELECT COUNT() AS comments
       FROM ${DATASET}
       WHERE blob1 = 'feedback_comment' AND ${SINCE}
       FORMAT JSON`),
  ]);

  const total = totalRows[0] ?? {};
  const completed = completedRows[0] ?? {};
  const nps = npsRows[0] ?? {};
  const promoters = promoterRows[0] ?? {};
  const detractors = detractorRows[0] ?? {};
  const totalTime = totalDurationRows[0] ?? {};

  return {
    dailySessions: dailyRows.map((r) => ({
      day: String(r.day),
      sessions: Number(r.sessions ?? 0),
    })),
    completion: {
      totalSessions: Number(total.total ?? 0),
      completedSessions: Number(completed.completed ?? 0),
    },
    nps: {
      responses: Number(nps.responses ?? 0),
      avgScore:
        nps.avg_score === null || nps.avg_score === undefined
          ? null
          : Number(nps.avg_score),
      promoters: Number(promoters.promoters ?? 0),
      detractors: Number(detractors.detractors ?? 0),
      comments: Number(commentRows[0]?.comments ?? 0),
    },
    stepTimings: stepTimingRows
      .map((r) => ({
        step: Number(r.step ?? 0),
        avgSeconds: Number(r.avg_seconds ?? 0),
        count: Number(r.n ?? 0),
      }))
      .filter((r) => r.step > 0),
    avgTotalMinutes:
      totalTime.n && Number(totalTime.n) > 0 ? Number(totalTime.avg_minutes ?? 0) : null,
  };
}
