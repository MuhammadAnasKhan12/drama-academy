/**
 * The only place the booking flow talks to a server.
 *
 * Today (site.bookingApiUrl = null) it runs in DEMO MODE: every place shows as available and
 * "Pay" goes straight to the confirmation page without taking money or saving anything.
 *
 * When the backend is ready, set site.bookingApiUrl. It needs two endpoints:
 *   GET  {api}/availability?items=a,b      → { [itemId]: placesLeft }
 *   POST {api}/checkout  (BookingPayload)  → { checkoutUrl } — a hosted payment page
 *        (e.g. Stripe Checkout). The server must recalculate prices itself and hold the places;
 *        the payment provider sends the parent back to /book/confirmation?ref=… afterwards.
 * Card details are never entered on this site.
 */
import { site } from "~/lib/site";
import type { BookableItem } from "./catalogue";

export type BookingPayload = {
  parent: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: { street: string; street2: string; town: string; county: string; postcode: string };
  };
  children: {
    firstName: string;
    lastName: string;
    dob: string;
    needs: string;
    photoConsent: boolean;
    items: string[];
  }[];
  /** What the browser calculated — the server must check it, never trust it */
  expectedTotalPence: number;
  agreedToTerms: true;
};

export type CheckoutResult = { mode: "demo"; reference: string } | { mode: "redirect"; checkoutUrl: string };

export const isDemoMode = () => !site.bookingApiUrl;

export async function getAvailability(items: BookableItem[]): Promise<Record<string, number>> {
  if (!site.bookingApiUrl) return Object.fromEntries(items.map((i) => [i.id, i.capacity]));
  const res = await fetch(`${site.bookingApiUrl}/availability?items=${encodeURIComponent(items.map((i) => i.id).join(","))}`);
  if (!res.ok) throw new Error("Could not check availability");
  return res.json();
}

export async function startCheckout(payload: BookingPayload): Promise<CheckoutResult> {
  if (!site.bookingApiUrl) {
    await new Promise((r) => setTimeout(r, 1600)); // long enough to see the processing screen
    return { mode: "demo", reference: `DEMO-${Date.now().toString(36).toUpperCase()}` };
  }
  const res = await fetch(`${site.bookingApiUrl}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Sorry, we couldn't start the payment. Please try again.");
  }
  const { checkoutUrl } = await res.json();
  return { mode: "redirect", checkoutUrl };
}
