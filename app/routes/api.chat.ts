import type { Route } from "./+types/api.chat";
import { buildSystemPrompt } from "../lib/system-prompt.server";
import { mockResponse } from "../lib/mock-responses.server";
import { cloudflareContext } from "../lib/cloudflare-context.server";
import { logChatEvent } from "../lib/usage-log.server";
import { anthropicProvider } from "../lib/providers/anthropic.server";
import { geminiProvider } from "../lib/providers/gemini.server";
import type { ProviderEnv } from "../lib/providers/types";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STEP_MARKER = /^\**\[STEG:\s*([1-5])\]\**:?\s*/i;
const STEP_MARKER_GIVEUP_LENGTH = 40;

function sse(event: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function selectProvider(env: ProviderEnv) {
  return env.CHAT_PROVIDER === "gemini" ? geminiProvider : anthropicProvider;
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
  const provider = selectProvider(env);

  const stream = new ReadableStream({
    async start(controller) {
      if (!provider.isConfigured(env)) {
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

      function handleDelta(chunk: string) {
        if (stepSent) {
          controller.enqueue(sse("delta", { text: chunk }));
          return;
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

      try {
        const outcome = await provider.streamChat(
          env,
          { system: buildSystemPrompt(), messages },
          handleDelta,
        );

        if (!stepSent && buffer) {
          controller.enqueue(sse("step", { step: resolvedStep }));
          controller.enqueue(sse("delta", { text: buffer }));
        }

        if (outcome !== "complete") {
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
            errorType: outcome === "max_tokens" ? "max_tokens" : "truncated_stream",
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
            provider: provider.name,
            detail: err instanceof Error ? err.message : String(err),
          }),
        );
        const { message, errorType } = provider.describeError(err);
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
