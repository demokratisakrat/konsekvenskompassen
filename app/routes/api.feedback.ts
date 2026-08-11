import type { Route } from "./+types/api.feedback";
import { cloudflareContext } from "../lib/cloudflare-context.server";
import { logFeedback } from "../lib/usage-log.server";

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  const { sessionId, score } = (await request.json()) as {
    sessionId?: string;
    score?: number;
  };

  if (typeof score !== "number" || score < 0 || score > 10) {
    return Response.json({ error: "Ogiltigt betyg" }, { status: 400 });
  }

  const { env } = context.get(cloudflareContext);
  logFeedback(env.DEMOKRATISAKRAT_ANALYTICS, sessionId, Math.round(score));

  return Response.json({ ok: true });
}

export async function loader() {
  return new Response("method not allowed", { status: 405 });
}
