import { jwtVerify, SignJWT } from "jose";
import type { Env } from "../env";

/**
 * Admin sign-in: email + password, checked against the ADMIN_USERS secret.
 *
 *   ADMIN_USERS = "email:hash,email:hash"   (make an entry with `npm run admin:user`)
 *   hash        = "pbkdf2.<iterations>.<salt>.<key>"   (base64url, PBKDF2-SHA256)
 *
 * A signed session token (HS256, SESSION_SECRET) is kept in an HttpOnly cookie. Removing someone from
 * ADMIN_USERS signs them out on their next request; changing SESSION_SECRET signs everyone out.
 */

export const SESSION_COOKIE = "dk_admin";
export const SESSION_HOURS = 12;

/** Cloudflare Workers cap PBKDF2 at 100,000 iterations */
const MAX_ITERATIONS = 100_000;

// Compared against when the email isn't an admin, so a wrong email takes as long as a wrong password
const DUMMY_HASH = "pbkdf2.100000.AAAAAAAAAAAAAAAAAAAAAA.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export const authConfigured = (env: Env) => !!env.ADMIN_USERS?.trim() && (env.SESSION_SECRET?.length ?? 0) >= 32;

/** email (lower case) → password hash */
export function adminUsers(env: Env): Map<string, string> {
  const users = new Map<string, string>();
  for (const entry of (env.ADMIN_USERS ?? "").split(/[,\n]/)) {
    const at = entry.indexOf(":");
    if (at > 0) users.set(entry.slice(0, at).trim().toLowerCase(), entry.slice(at + 1).trim());
  }
  return users;
}

export async function checkPassword(env: Env, email: string, password: string): Promise<boolean> {
  const stored = adminUsers(env).get(email.trim().toLowerCase());
  const ok = await verifyPassword(password, stored ?? DUMMY_HASH);
  return ok && !!stored;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iter, salt, key] = stored.split(".");
  const iterations = Number(iter);
  if (scheme !== "pbkdf2" || !salt || !key || !Number.isInteger(iterations) || iterations < 1 || iterations > MAX_ITERATIONS) return false;
  const expected = fromBase64Url(key);
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromBase64Url(salt), iterations },
    material,
    expected.length * 8,
  );
  return timingSafeEqual(new Uint8Array(bits), expected);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function fromBase64Url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
}

const secretKey = (env: Env) => new TextEncoder().encode(env.SESSION_SECRET);

export const createSession = (env: Env, email: string) =>
  new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email.trim().toLowerCase())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secretKey(env));

/** The admin's email if the token is valid and they are still in ADMIN_USERS, otherwise null */
export async function readSession(env: Env, token: string | undefined): Promise<string | null> {
  if (!token || !authConfigured(env)) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(env), { algorithms: ["HS256"] });
    return payload.sub && adminUsers(env).has(payload.sub) ? payload.sub : null;
  } catch {
    return null;
  }
}
