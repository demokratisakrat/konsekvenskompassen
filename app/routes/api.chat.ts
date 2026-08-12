import Anthropic from "@anthropic-ai/sdk";
import type { Route } from "./+types/api.chat";
import { buildSystemPrompt } from "../lib/system-prompt.server";
import { mockResponse } from "../lib/mock-responses.server";
import { cloudflareContext } from "../lib/cloudflare-context.server";
import { logChatEvent } from "../lib/usage-log.server";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STEP_MARKER = /^\**\[STEG:\s*([1-5])\]\**:?\s*/i;
const STEP_MARKER_GIVEUP_LENGTH = 40;

function sse(event: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  const { messages, sessionId } = (await request.json()) as {
    messages: ChatMessage[];
    sessionId?: string;
  };
  const turnIndex = messages.filter((m) => m.role === "assistant").length;
  const messageCount = messages.length;

  const { env } = context.get(cloudflareContext);
  const analytics = env.DEMOKRATISAKRAT_ANALYTICS;
  const apiKey = env.ANTHROPIC_API_KEY;
  const model = env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const stream = new ReadableStream({
    async start(controller) {
      if (!apiKey) {
        const raw = mockResponse(turnIndex);
        const match = raw.match(STEP_MARKER);
        const step = match ? Number(match[1]) : 1;
        controller.enqueue(sse("step", { step }));
        controller.enqueue(sse("delta", { text: match ? raw.slice(match[0].length) : raw }));
        controller.enqueue(sse("done", {}));
        logChatEvent(analytics, { sessionId, turnIndex, step, messageCount, mode: "mock" });
        controller.close();
        return;
      }

      let buffer = "";
      let stepSent = false;
      let resolvedStep = 1;

      try {
        const client = new Anthropic({ apiKey });
        const anthropicStream = client.messages.stream({
          model,
          // claude-sonnet-5 tänker adaptivt som standard och max_tokens är ett
          // hårt tak på tänkande + svarstext tillsammans — för lågt tak kapar
          // långa svar (steg 4-analysen) mitt i meningen med stop_reason max_tokens.
          max_tokens: 32000,
          system: [
            { type: "text", text: buildSystemPrompt(), cache_control: { type: "ephemeral" } },
          ],
          messages,
        });

        let stopReason: string | null = null;
        for await (const event of anthropicStream) {
          if (event.type === "message_delta" && event.delta.stop_reason) {
            stopReason = event.delta.stop_reason;
          }
          if (event.type !== "content_block_delta" || event.delta.type !== "text_delta") {
            continue;
          }
          const chunk = event.delta.text;
          if (stepSent) {
            controller.enqueue(sse("delta", { text: chunk }));
            continue;
          }
          buffer += chunk;
          const match = buffer.match(STEP_MARKER);
          if (match) {
            resolvedStep = Number(match[1]);
            controller.enqueue(sse("step", { step: resolvedStep }));
            const rest = buffer.slice(match[0].length);
            if (rest) controller.enqueue(sse("delta", { text: rest }));
            stepSent = true;
            buffer = "";
          } else if (buffer.length > STEP_MARKER_GIVEUP_LENGTH) {
            controller.enqueue(sse("step", { step: resolvedStep }));
            controller.enqueue(sse("delta", { text: buffer }));
            stepSent = true;
            buffer = "";
          }
        }
        if (!stepSent && buffer) {
          controller.enqueue(sse("step", { step: resolvedStep }));
          controller.enqueue(sse("delta", { text: buffer }));
        }

        if (stopReason === null || stopReason === "max_tokens") {
          // Strömmen tog slut utan att modellen blev klar (avbruten uppströms
          // eller max_tokens) — säg det ärligt istället för att låtsas vara klar.
          controller.enqueue(
            sse("error", {
              message:
                "Svaret bröts innan det var klart. Skriv gärna \"fortsätt\" så tar jag vid där det slutade.",
            }),
          );
          logChatEvent(analytics, {
            sessionId,
            turnIndex,
            step: resolvedStep,
            messageCount,
            mode: "live",
            errorType: stopReason === "max_tokens" ? "max_tokens" : "truncated_stream",
          });
        } else {
          controller.enqueue(sse("done", {}));
          logChatEvent(analytics, { sessionId, turnIndex, step: resolvedStep, messageCount, mode: "live" });
        }
      } catch (err) {
        // Full detalj till loggarna, aldrig rå JSON till användaren.
        console.log(
          JSON.stringify({
            event: "chat_error",
            timestamp: new Date().toISOString(),
            sessionId: sessionId ?? "unknown",
            detail: err instanceof Error ? err.message : String(err),
          }),
        );
        let message = "Något gick fel. Skriv gärna ditt svar igen om en stund.";
        let errorType = "unknown";
        const raw = err instanceof Error ? err.message : "";
        if (
          err instanceof Anthropic.APIError &&
          (err.status === 529 || /overloaded/i.test(raw))
        ) {
          message =
            "AI-tjänsten är tillfälligt överbelastad — vänta en liten stund och skicka ditt svar igen. Samtalet är kvar.";
          errorType = "overloaded";
        } else if (err instanceof Anthropic.RateLimitError) {
          message = "För många förfrågningar just nu — vänta en stund och skicka igen.";
          errorType = "rate_limit";
        } else if (err instanceof Anthropic.APIError) {
          message = `Något gick fel hos AI-tjänsten${err.status ? ` (${err.status})` : ""} — vänta en stund och skicka ditt svar igen.`;
          errorType = `api_error_${err.status ?? "instream"}`;
        }
        logChatEvent(analytics, {
          sessionId,
          turnIndex,
          step: resolvedStep,
          messageCount,
          mode: "live",
          errorType,
        });
        controller.enqueue(sse("error", { message }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/event-stream", "cache-control": "no-cache" },
  });
}

export async function loader() {
  return new Response("method not allowed", { status: 405 });
}
