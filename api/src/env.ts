/** Everything the Worker receives from Cloudflare: bindings, settings and secrets. */
export type Env = {
  DB: D1Database;

  // vars (wrangler.jsonc)
  SITE_ORIGIN: string;
  HOLD_MINUTES: string;
  ADMIN_NOTIFY_EMAIL: string;
  EMAIL_FROM: string;

  // secrets (.dev.vars locally, `wrangler secret put` in production)
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY?: string;
  /** Who may sign in to the admin: "email:hash,email:hash" (make entries with `npm run admin:user`) */
  ADMIN_USERS?: string;
  /** Random string (32+ characters) that signs admin session cookies */
  SESSION_SECRET?: string;
};

export type AppEnv = { Bindings: Env; Variables: { adminEmail: string } };
