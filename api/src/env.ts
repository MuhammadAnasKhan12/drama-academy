/** Everything the Worker receives from Cloudflare: bindings, settings and secrets. */
export type Env = {
  DB: D1Database;

  // vars (wrangler.jsonc)
  SITE_ORIGIN: string;
  HOLD_MINUTES: string;
  ADMIN_NOTIFY_EMAIL: string;
  EMAIL_FROM: string;
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;

  // secrets (.dev.vars locally, `wrangler secret put` in production)
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY?: string;
  /** Local development only: skip Cloudflare Access and act as this admin email */
  ADMIN_DEV_EMAIL?: string;
};

export type AppEnv = { Bindings: Env; Variables: { adminEmail: string } };
