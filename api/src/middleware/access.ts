import { createMiddleware } from "hono/factory";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AppEnv } from "../env";

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

/**
 * Protects /api/admin/*. Cloudflare Access sits in front of the admin and adds a signed token
 * (Cf-Access-Jwt-Assertion header / CF_Authorization cookie) to every request. We verify that
 * token's signature, issuer and audience here too, so the API is safe even if Access were bypassed.
 *
 * Local development: with ADMIN_DEV_EMAIL set AND the request coming to localhost, sign-in is skipped.
 * If Access isn't configured in production, admin routes refuse every request (never open by default).
 */
export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
  const host = new URL(c.req.url).hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  if (isLocal && c.env.ADMIN_DEV_EMAIL) {
    c.set("adminEmail", c.env.ADMIN_DEV_EMAIL);
    return next();
  }

  const team = c.env.ACCESS_TEAM_DOMAIN;
  const aud = c.env.ACCESS_AUD;
  if (!team || !aud) return c.json({ message: "Admin sign-in is not configured" }, 503);

  const token = c.req.header("Cf-Access-Jwt-Assertion") ?? getCookie(c.req.header("Cookie") ?? "", "CF_Authorization");
  if (!token) return c.json({ message: "Not signed in" }, 401);

  const issuer = `https://${team.replace(/^https?:\/\//, "")}`;
  let jwks = jwksCache.get(issuer);
  if (!jwks) jwksCache.set(issuer, (jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`))));

  try {
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: aud });
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!email) return c.json({ message: "Not signed in" }, 401);
    c.set("adminEmail", email);
    return next();
  } catch {
    return c.json({ message: "Not signed in" }, 401);
  }
});

function getCookie(header: string, name: string) {
  const match = header.split(/;\s*/).find((p) => p.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}
