// Secrets, not committed to wrangler.jsonc's plaintext "vars". Set locally
// via .dev.vars (gitignored) and in production via `wrangler secret put`.
// Merges with the generated Env interface in worker-configuration.d.ts.
interface Env {
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  GOOGLE_CLOUD_PROJECT?: string;
  GOOGLE_SERVICE_ACCOUNT_KEY?: string;
  GEMINI_MODEL?: string;
  GEMINI_LOCATION?: string;
  CLAUDE_VERTEX_MODEL?: string;
  CLAUDE_VERTEX_LOCATION?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_ANALYTICS_API_TOKEN?: string;
}
