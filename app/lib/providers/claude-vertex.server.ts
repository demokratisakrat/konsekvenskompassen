// Claude via Vertex AI (Agent Platform), EU-multiregion för dataresidens.
// Samma Messages-format som Anthropic direkt, men modellen ligger i URL:en
// och anthropic_version i kroppen. Kräver att Claude aktiverats i Model
// Garden för projektet — annars 404.

import {
  GoogleApiError,
  getGoogleAccessToken,
  vertexHost,
} from "./google-auth.server";
import {
  GENERIC_ERROR,
  type ChatProvider,
} from "./types";

const DEFAULT_MODEL = "claude-sonnet-5";
const DEFAULT_LOCATION = "eu";

type AnthropicStreamEvent = {
  type?: string;
  delta?: { type?: string; text?: string; stop_reason?: string };
  error?: { type?: string; message?: string };
};

export const claudeVertexProvider: ChatProvider = {
  name: "claude-vertex",

  isConfigured(env) {
    return Boolean(env.GOOGLE_CLOUD_PROJECT && env.GOOGLE_SERVICE_ACCOUNT_KEY);
  },

  async streamChat(env, { system, messages }, onDelta) {
    const project = env.GOOGLE_CLOUD_PROJECT!;
    const location = env.CLAUDE_VERTEX_LOCATION || DEFAULT_LOCATION;
    const model = env.CLAUDE_VERTEX_MODEL || DEFAULT_MODEL;
    const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY!);

    const url =
      `https://${vertexHost(location)}/v1/projects/${project}` +
      `/locations/${location}/publishers/anthropic/models/${model}:streamRawPredict`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "vertex-2023-10-16",
        stream: true,
        // Taket delas med tänkandet — samma resonemang som i anthropic.server.ts.
        max_tokens: 32000,
        system: [
          { type: "text", text: system, cache_control: { type: "ephemeral" } },
        ],
        messages,
      }),
    });

    if (!res.ok || !res.body) {
      throw new GoogleApiError(res.status, await res.text());
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let stopReason: string | undefined;

    const handleEvent = (raw: string) => {
      const dataLine = raw
        .split("\n")
        .find((line) => line.startsWith("data: "));
      if (!dataLine) return;
      const event = JSON.parse(dataLine.slice(6)) as AnthropicStreamEvent;
      if (event.type === "error") {
        const status = event.error?.type === "overloaded_error" ? 529 : 500;
        throw new GoogleApiError(
          status,
          event.error?.message ?? "okänt fel i strömmen",
        );
      }
      if (
        event.type === "content_block_delta" &&
        event.delta?.type === "text_delta" &&
        event.delta.text
      ) {
        onDelta(event.delta.text);
      }
      if (event.type === "message_delta" && event.delta?.stop_reason) {
        stopReason = event.delta.stop_reason;
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.search(/\r?\n\r?\n/)) !== -1) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx).replace(/^\r?\n\r?\n/, "");
        handleEvent(raw);
      }
    }
    if (buffer.trim()) handleEvent(buffer);

    if (stopReason === undefined) return "truncated";
    if (stopReason === "max_tokens") return "max_tokens";
    return "complete";
  },

  describeError(err) {
    if (err instanceof GoogleApiError) {
      if (err.status === 429) {
        return {
          message: "För många förfrågningar just nu — vänta en stund och skicka igen.",
          errorType: "rate_limit",
        };
      }
      if (err.status === 503 || err.status === 529) {
        return {
          message:
            "AI-tjänsten är tillfälligt överbelastad — vänta en liten stund och skicka ditt svar igen. Samtalet är kvar.",
          errorType: "overloaded",
        };
      }
      return {
        message: `Något gick fel hos AI-tjänsten (${err.status}) — vänta en stund och skicka ditt svar igen.`,
        errorType: `api_error_${err.status}`,
      };
    }
    return GENERIC_ERROR;
  },
};
