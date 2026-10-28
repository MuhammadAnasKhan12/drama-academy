/**
 * Stripe.js setup (frontend only).
 *
 * Add your *publishable* test key to a `.env` file in the project root:
 *   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
 * (Stripe Dashboard → Developers → API keys). Never put a secret key (sk_...) in the frontend.
 * Without a key the checkout shows a static preview of the payment form instead.
 */
import type { Appearance, Stripe } from "@stripe/stripe-js";
// "/pure" only injects Stripe.js when loadStripe() is called — not on every page
import { loadStripe } from "@stripe/stripe-js/pure";

export const stripeKey: string | undefined = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || undefined;

let stripePromise: Promise<Stripe | null> | null = null;
/** Loads Stripe.js once, in the browser only. */
export function getStripe() {
  if (!stripeKey || typeof window === "undefined") return null;
  stripePromise ??= loadStripe(stripeKey, { locale: "en-GB" });
  return stripePromise;
}

/** Stripe's Payment Element styled to match the site's design tokens. */
export const stripeAppearance: Appearance = {
  theme: "stripe",
  labels: "above",
  variables: {
    colorPrimary: "#1a1630",
    colorBackground: "#ffffff",
    colorText: "#1a1630",
    colorTextSecondary: "#4a4566",
    colorDanger: "#a3125e",
    fontFamily: "Nunito, system-ui, sans-serif",
    fontSizeBase: "16px",
    borderRadius: "10px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "2px solid #e6dccb", boxShadow: "none", padding: "12px 14px" },
    ".Input:focus": { border: "2px solid #1366b0", boxShadow: "none" },
    ".Input--invalid": { border: "2px solid #d81b7f" },
    ".Label": { fontWeight: "700" },
    ".Tab": { border: "2px solid #e6dccb", boxShadow: "none" },
    ".Tab--selected": { border: "2px solid #1a1630", boxShadow: "3px 3px 0 0 #1a1630" },
  },
};

export const stripeFonts = [{ cssSrc: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" }];
