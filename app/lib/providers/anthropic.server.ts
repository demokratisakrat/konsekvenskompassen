import Anthropic from "@anthropic-ai/sdk";
import {
  GENERIC_ERROR,
  type ChatProvider,
} from "./types";

export const anthropicProvider: ChatProvider = {
  name: "anthropic",

  isConfigured(env) {
    return Boolean(env.ANTHROPIC_API_KEY);
  },

  async streamChat(env, { system, messages }, onDelta) {
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const stream = client.messages.stream({
      model: env.ANTHROPIC_MODEL || "claude-sonnet-5",
      // claude-sonnet-5 tänker adaptivt som standard och max_tokens är ett
      // hårt tak på tänkande + svarstext tillsammans — för lågt tak kapar
      // långa svar (steg 4-analysen) mitt i meningen med stop_reason max_tokens.
      max_tokens: 32000,
      system: [
        { type: "text", text: system, cache_control: { type: "ephemeral" } },
      ],
      messages,
    });

    let stopReason: string | null = null;
    for await (const event of stream) {
      if (event.type === "message_delta" && event.delta.stop_reason) {
        stopReason = event.delta.stop_reason;
      }
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        onDelta(event.delta.text);
      }
    }

    if (stopReason === null) return "truncated";
    if (stopReason === "max_tokens") return "max_tokens";
    return "complete";
  },

  describeError(err) {
    const raw = err instanceof Error ? err.message : "";
    if (
      err instanceof Anthropic.APIError &&
      (err.status === 529 || /overloaded/i.test(raw))
    ) {
      return {
        message:
          "AI-tjänsten är tillfälligt överbelastad — vänta en liten stund och skicka ditt svar igen. Samtalet är kvar.",
        errorType: "overloaded",
      };
    }
    if (err instanceof Anthropic.RateLimitError) {
      return {
        message: "För många förfrågningar just nu — vänta en stund och skicka igen.",
        errorType: "rate_limit",
      };
    }
    if (err instanceof Anthropic.APIError) {
      return {
        message: `Något gick fel hos AI-tjänsten${err.status ? ` (${err.status})` : ""} — vänta en stund och skicka ditt svar igen.`,
        errorType: `api_error_${err.status ?? "instream"}`,
      };
    }
    return GENERIC_ERROR;
  },
};
