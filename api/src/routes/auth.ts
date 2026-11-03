import { zValidator } from "@hono/zod-validator";
import { and, eq, gt, inArray, lt, sql } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { getDb, schema, type Db } from "../db/client";
import type { AppEnv } from "../env";
import { authConfigured, checkPassword, createSession, readSession, SESSION_COOKIE, SESSION_HOURS } from "../lib/auth";
import { invalidRequest, loginSchema } from "../lib/validation";

const { loginAttempts } = schema;

/** Failed sign-ins allowed in the window, per email and per IP address */
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;
const WINDOW_MINUTES = 15;

export const authRoutes = new Hono<AppEnv>();
authRoutes.use("*", async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store");
});

const cookieOptions = { path: "/api", httpOnly: true, secure: true, sameSite: "Strict" } as const;

/** Who is signed in (the admin screens call this first) */
authRoutes.get("/me", async (c) => {
  const email = await readSession(c.env, getCookie(c, SESSION_COOKIE));
  return email ? c.json({ email }) : c.json({ message: "Not signed in" }, 401);
});

authRoutes.post("/login", zValidator("json", loginSchema, invalidRequest), async (c) => {
  if (!authConfigured(c.env)) return c.json({ message: "Admin sign-in is not configured" }, 503);
  const db = getDb(c.env);
  const { email, password } = c.req.valid("json");
  const keys = { email: `email:${email.toLowerCase()}`, ip: `ip:${c.req.header("CF-Connecting-IP") ?? "unknown"}` };

  if (await tooManyAttempts(db, keys)) {
    return c.json({ message: `Too many sign-in attempts. Please wait ${WINDOW_MINUTES} minutes and try again.` }, 429);
  }
  if (!(await checkPassword(c.env, email, password))) {
    await db.insert(loginAttempts).values([{ key: keys.email }, { key: keys.ip }]);
    return c.json({ message: "That email and password don’t match." }, 401);
  }

  await db.delete(loginAttempts).where(eq(loginAttempts.key, keys.email));
  setCookie(c, SESSION_COOKIE, await createSession(c.env, email), { ...cookieOptions, maxAge: SESSION_HOURS * 3600 });
  return c.json({ email: email.toLowerCase() });
});

authRoutes.post("/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, cookieOptions);
  return c.json({ ok: true });
});

async function tooManyAttempts(db: Db, keys: { email: string; ip: string }) {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const rows = await db
    .select({ key: loginAttempts.key, n: sql<number>`count(*)` })
    .from(loginAttempts)
    .where(and(inArray(loginAttempts.key, [keys.email, keys.ip]), gt(loginAttempts.at, since)))
    .groupBy(loginAttempts.key);
  const count = (k: string) => rows.find((r) => r.key === k)?.n ?? 0;
  return count(keys.email) >= MAX_PER_EMAIL || count(keys.ip) >= MAX_PER_IP;
}

/** Called by the cron: forget failed attempts older than a day */
export const pruneLoginAttempts = (db: Db) =>
  db.delete(loginAttempts).where(lt(loginAttempts.at, new Date(Date.now() - 86_400_000).toISOString()));
