// Gemini via Vertex AI, pinnad till EU-region för dataresidens. Direkt REST
// med egenmintad OAuth-token: API-nycklar routas tyst till den globala
// endpointen (bryter EU-garantin) och Googles SDK/auth-bibliotek kräver Node.

import {
  GENERIC_ERROR,
  type ChatProvider,
  type ProviderEnv,
} from "./types";

const DEFAULT_MODEL = "gemini-2.5-pro";
const DEFAULT_LOCATION = "europe-west4"; // Nederländerna

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";

class VertexApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function base64url(data: string | ArrayBuffer): string {
  const bin =
    typeof data === "string"
      ? data
      : String.fromCharCode(...new Uint8Array(data));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// Access-token cachas per isolate; Google-tokens lever i 60 min.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(serviceAccountJson: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.token;

  const sa = JSON.parse(serviceAccountJson) as {
    client_email: string;
    private_key: string;
  };

  const unsigned =
    base64url(JSON.stringify({ alg: "RS256", typ: "JWT" })) +
    "." +
    base64url(
      JSON.stringify({
        iss: sa.client_email,
        scope: SCOPE,
        aud: TOKEN_URL,
        iat: now,
        exp: now + 3600,
      }),
    );

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${base64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new VertexApiError(res.status, `tokenutbyte: ${await res.text()}`);
  }
  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = { token: access_token, expiresAt: now + expires_in };
  return access_token;
}

type VertexStreamChunk = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  error?: { code?: number; message?: string };
};

export const geminiProvider: ChatProvider = {
  name: "gemini",

  isConfigured(env) {
    return Boolean(env.GOOGLE_CLOUD_PROJECT && env.GOOGLE_SERVICE_ACCOUNT_KEY);
  },

  async streamChat(env, { system, messages }, onDelta) {
    const project = env.GOOGLE_CLOUD_PROJECT!;
    const location = env.GEMINI_LOCATION || DEFAULT_LOCATION;
    const model = env.GEMINI_MODEL || DEFAULT_MODEL;
    const token = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY!);

    const url =
      `https://${location}-aiplatform.googleapis.com/v1/projects/${project}` +
      `/locations/${location}/publishers/google/models/${model}:streamGenerateContent?alt=sse`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        systemInstruction: { parts: [{ text: system }] },
        // Taket delas med tänkandet — samma resonemang som i anthropic.server.ts.
        generationConfig: { maxOutputTokens: 32000 },
      }),
    });

    if (!res.ok || !res.body) {
      throw new VertexApiError(res.status, await res.text());
    }

    // Vertex SSE: "data: {json}"-rader separerade med dubbla radbrytningar.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finishReason: string | undefined;

    const handleEvent = (raw: string) => {
      const dataLine = raw
        .split("\n")
        .find((line) => line.startsWith("data: "));
      if (!dataLine) return;
      const chunk = JSON.parse(dataLine.slice(6)) as VertexStreamChunk;
      if (chunk.error) {
        throw new VertexApiError(
          chunk.error.code ?? 500,
          chunk.error.message ?? "okänt fel i strömmen",
        );
      }
      const candidate = chunk.candidates?.[0];
      for (const part of candidate?.content?.parts ?? []) {
        if (part.text) onDelta(part.text);
      }
      finishReason = candidate?.finishReason ?? finishReason;
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

    if (finishReason === undefined) return "truncated";
    if (finishReason === "MAX_TOKENS") return "max_tokens";
    return "complete";
  },

  describeError(err) {
    if (err instanceof VertexApiError) {
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
