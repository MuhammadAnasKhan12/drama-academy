import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../env";
import { authConfigured, readSession, SESSION_COOKIE } from "../lib/auth";

/**
 * Protects /api/admin/*: needs a valid admin session cookie (see lib/auth.ts).
 * If sign-in isn't configured, admin routes refuse every request (never open by default).
 */
export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
  if (!authConfigured(c.env)) return c.json({ message: "Admin sign-in is not configured" }, 503);
  const email = await readSession(c.env, getCookie(c, SESSION_COOKIE));
  if (!email) return c.json({ message: "Not signed in" }, 401);
  c.set("adminEmail", email);
  return next();
});
