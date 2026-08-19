// Routen (api.chat) äger SSE-protokollet, STEG-tolkningen och mock-läget;
// leverantören äger strömningen och översättningen av sina egna fel.

export type ProviderChatMessage = { role: "user" | "assistant"; content: string };

export type ProviderEnv = {
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  GOOGLE_CLOUD_PROJECT?: string;
  GOOGLE_SERVICE_ACCOUNT_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_LOCATION?: string;
  CLAUDE_VERTEX_MODEL?: string;
  CLAUDE_VERTEX_LOCATION?: string;
  CHAT_PROVIDER?: string;
};

// "truncated" = strömmen tog slut utan avslutssignal (avbruten uppströms).
export type StreamOutcome = "complete" | "max_tokens" | "truncated";

export type ProviderErrorInfo = { message: string; errorType: string };

export interface ChatProvider {
  name: string;
  isConfigured(env: ProviderEnv): boolean;
  streamChat(
    env: ProviderEnv,
    opts: { system: string; messages: ProviderChatMessage[] },
    onDelta: (text: string) => void,
  ): Promise<StreamOutcome>;
  describeError(err: unknown): ProviderErrorInfo;
}

export const GENERIC_ERROR: ProviderErrorInfo = {
  message: "Något gick fel. Skriv gärna ditt svar igen om en stund.",
  errorType: "unknown",
};
