import type { Route } from "./+types/api.feedback";
import { cloudflareContext } from "../lib/cloudflare-context.server";
import { logFeedback, logFeedbackComment } from "../lib/usage-log.server";

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  const { sessionId, score, comment } = (await request.json()) as {
    sessionId?: string;
    score?: number;
    comment?: string;
  };

  const { env } = context.get(cloudflareContext);

  // Antingen ett betyg eller en frivillig textkommentar (skickas separat).
  if (typeof score === "number" && score >= 0 && score <= 10) {
    logFeedback(env.DEMOKRATISAKRAT_ANALYTICS, sessionId, Math.round(score));
    return Response.json({ ok: true });
  }
  if (typeof comment === "string" && comment.trim().length > 0) {
    logFeedbackComment(env.DEMOKRATISAKRAT_ANALYTICS, sessionId, comment.trim());
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Ogiltig feedback" }, { status: 400 });
}

export async function loader() {
  return new Response("method not allowed", { status: 405 });
}
