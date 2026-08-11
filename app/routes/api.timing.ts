import type { Route } from "./+types/api.timing";
import { cloudflareContext } from "../lib/cloudflare-context.server";
import { logStepTiming } from "../lib/usage-log.server";

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  const { sessionId, step, lapMs, totalElapsedMs } = (await request.json()) as {
    sessionId?: string;
    step?: number;
    lapMs?: number;
    totalElapsedMs?: number;
  };

  if (
    typeof step !== "number" ||
    typeof lapMs !== "number" ||
    typeof totalElapsedMs !== "number"
  ) {
    return Response.json({ error: "Ogiltig data" }, { status: 400 });
  }

  const { env } = context.get(cloudflareContext);
  logStepTiming(env.DEMOKRATISAKRAT_ANALYTICS, sessionId, step, lapMs, totalElapsedMs);

  return Response.json({ ok: true });
}

export async function loader() {
  return new Response("method not allowed", { status: 405 });
}
