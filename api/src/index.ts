/**
 * Drama Kids booking API — Cloudflare Worker (Hono + D1 + Stripe).
 *
 *   GET   /api/availability                     places left per club/term
 *   POST  /api/payment-intent                   hold places + create Stripe PaymentIntent
 *   GET   /api/bookings/:reference/status       status for the confirmation page
 *   POST  /api/stripe/webhook                   Stripe events (signature-verified)
 *   POST  /api/auth/login · logout, GET /me    admin sign-in (email + password, session cookie)
 *   *     /api/admin/*                          admin screens (signed-in admins only)
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { getDb } from "./db/client";
import type { AppEnv, Env } from "./env";
import { adminRoutes } from "./routes/admin";
import { authRoutes, pruneLoginAttempts } from "./routes/auth";
import { publicRoutes } from "./routes/public";
import { expireHolds, webhookRoutes } from "./routes/webhook";

const app = new Hono<AppEnv>().basePath("/api");

app.use("*", secureHeaders());

// Only our own website may call the API from a browser (the Stripe webhook is server-to-server)
app.use("*", async (c, next) => {
  const allowed = c.env.SITE_ORIGIN.split(",").map((s) => s.trim());
  return cors({
    origin: (origin) => (allowed.includes(origin) ? origin : null),
    allowMethods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    credentials: true,
    maxAge: 600,
  })(c, next);
});

app.get("/health", (c) => c.json({ ok: true }));
app.route("/", publicRoutes);
app.route("/", webhookRoutes);
app.route("/auth", authRoutes);
app.route("/admin", adminRoutes);

app.notFound((c) => c.json({ message: "Not found" }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ message: "Something went wrong. Please try again." }, 500);
});

export default {
  fetch: app.fetch,
  scheduled: (_controller: ScheduledController, env: Env, ctx: ExecutionContext) =>
    ctx.waitUntil(Promise.all([expireHolds(env), pruneLoginAttempts(getDb(env))])),
} satisfies ExportedHandler<Env>;
