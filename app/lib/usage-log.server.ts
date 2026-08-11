// Bara struktur loggas (session, samtalsdjup, feltyp, NPS) — aldrig
// svarsinnehåll, eftersom testpersonernas ståndpunkter inte ska hamna i loggarna.
// Enda undantaget är frivilliga feedbackkommentarer, som användaren uttryckligen
// väljer att skicka in och som UI:t upplyser om att de sparas.

type ChatEvent = {
  sessionId?: string;
  turnIndex: number;
  step: number;
  messageCount: number;
  mode: "mock" | "live";
  errorType?: string;
};

export function logChatEvent(
  analytics: AnalyticsEngineDataset | undefined,
  event: ChatEvent,
): void {
  const sessionId = event.sessionId ?? "unknown";

  console.log(
    JSON.stringify({
      event: "chat_turn",
      timestamp: new Date().toISOString(),
      sessionId,
      turnIndex: event.turnIndex,
      step: event.step,
      messageCount: event.messageCount,
      mode: event.mode,
      errorType: event.errorType ?? null,
    }),
  );

  if (event.turnIndex === 0) {
    analytics?.writeDataPoint({
      indexes: [sessionId],
      blobs: ["session_started"],
      doubles: [0, 1],
    });
  }

  analytics?.writeDataPoint({
    indexes: [sessionId],
    blobs: ["turn", event.mode, event.errorType ?? ""],
    doubles: [event.turnIndex, event.step],
  });
}

export function logStepTiming(
  analytics: AnalyticsEngineDataset | undefined,
  sessionId: string | undefined,
  step: number,
  lapMs: number,
  totalElapsedMs: number,
): void {
  const id = sessionId ?? "unknown";

  console.log(
    JSON.stringify({
      event: "step_timing",
      timestamp: new Date().toISOString(),
      sessionId: id,
      step,
      lapMs,
      totalElapsedMs,
    }),
  );

  analytics?.writeDataPoint({
    indexes: [id],
    blobs: ["step_timing"],
    doubles: [step, lapMs, totalElapsedMs],
  });
}

export function logFeedback(
  analytics: AnalyticsEngineDataset | undefined,
  sessionId: string | undefined,
  score: number,
): void {
  const id = sessionId ?? "unknown";

  console.log(
    JSON.stringify({
      event: "feedback_nps",
      timestamp: new Date().toISOString(),
      sessionId: id,
      score,
    }),
  );

  analytics?.writeDataPoint({
    indexes: [id],
    blobs: ["feedback_nps"],
    doubles: [score],
  });
}

// Blobbar får vara max 5120 byte totalt per datapunkt — trunkera med marginal.
const MAX_COMMENT_LENGTH = 2000;

export function logFeedbackComment(
  analytics: AnalyticsEngineDataset | undefined,
  sessionId: string | undefined,
  comment: string,
): void {
  const id = sessionId ?? "unknown";
  const truncated = comment.slice(0, MAX_COMMENT_LENGTH);

  console.log(
    JSON.stringify({
      event: "feedback_comment",
      timestamp: new Date().toISOString(),
      sessionId: id,
      length: truncated.length,
    }),
  );

  analytics?.writeDataPoint({
    indexes: [id],
    blobs: ["feedback_comment", truncated],
    doubles: [],
  });
}
