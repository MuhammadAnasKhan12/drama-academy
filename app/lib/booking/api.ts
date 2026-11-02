/**
 * The only place the booking flow talks to the server (the API in /api).
 *
 * Without VITE_BOOKING_API_URL it runs in DEMO MODE: every place shows as available and
 * "Pay" goes straight to the confirmation page without taking money or saving anything.
 *
 * With the API:
 *   GET  {api}/availability                       → { [itemId]: placesLeft }
 *   POST {api}/payment-intent  (BookingPayload)   → { clientSecret, reference, totalPence }
 *        The server re-checks prices, ages and places, holds the places and creates a Stripe
 *        PaymentIntent. The card is then confirmed in the browser by Stripe.js.
 *   GET  {api}/bookings/:reference/status?payment_intent=pi_…  → { status }
 * Card details are never sent to our server.
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
  /** What the browser calculated — the server checks it and rejects the booking if prices changed */
  expectedTotalPence: number;
  agreedToTerms: true;
};

export type CheckoutResult = { mode: "demo"; reference: string } | { mode: "stripe"; clientSecret: string; reference: string };
export type ServerBookingStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled" | "expired";

export const isDemoMode = () => !site.bookingApiUrl;

/** Reads the API's `{ message }` error so parents see a helpful sentence */
async function errorMessage(res: Response, fallback: string) {
  const body = (await res.json().catch(() => ({}))) as { message?: string };
  return body.message ?? fallback;
}

export async function getAvailability(items: BookableItem[]): Promise<Record<string, number>> {
  if (!site.bookingApiUrl) return Object.fromEntries(items.map((i) => [i.id, i.capacity]));
  const res = await fetch(`${site.bookingApiUrl}/availability`);
  if (!res.ok) throw new Error("Could not check availability");
  return res.json();
}

export async function startCheckout(payload: BookingPayload): Promise<CheckoutResult> {
  if (!site.bookingApiUrl) {
    await new Promise((r) => setTimeout(r, 1600)); // long enough to see the processing screen
    return { mode: "demo", reference: `DEMO-${Date.now().toString(36).toUpperCase()}` };
  }
  const res = await fetch(`${site.bookingApiUrl}/payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await errorMessage(res, "Sorry, we couldn't start the payment. Please try again."));
  const { clientSecret, reference } = (await res.json()) as { clientSecret: string; reference: string };
  return { mode: "stripe", clientSecret, reference };
}

export async function getBookingStatus(reference: string, paymentIntentId: string): Promise<ServerBookingStatus> {
  const res = await fetch(`${site.bookingApiUrl}/bookings/${encodeURIComponent(reference)}/status?payment_intent=${encodeURIComponent(paymentIntentId)}`);
  if (!res.ok) throw new Error(await errorMessage(res, "Could not check the booking"));
  return ((await res.json()) as { status: ServerBookingStatus }).status;
}
