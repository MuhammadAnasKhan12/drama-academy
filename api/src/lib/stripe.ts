import Stripe from "stripe";
import type { Env } from "../env";

/** Stripe client configured for Cloudflare Workers (fetch-based HTTP, Web Crypto for webhooks). */
export function getStripe(env: Env) {
  if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 2,
    appInfo: { name: "drama-kids-booking" },
  });
}

export const cryptoProvider = Stripe.createSubtleCryptoProvider();
