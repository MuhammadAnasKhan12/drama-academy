import { and, eq, inArray, lt } from "drizzle-orm";
import { Hono } from "hono";
import type Stripe from "stripe";
import { getDb, schema, type Db } from "../db/client";
import type { AppEnv, Env } from "../env";
import { audit, findBookingIdByPaymentIntent, loadBooking } from "../lib/bookings";
import { sendAdminNotification } from "../lib/email";
import { cryptoProvider, getStripe } from "../lib/stripe";

const { bookings, webhookEvents } = schema;

export const webhookRoutes = new Hono<AppEnv>();

/**
 * Stripe → us. The ONLY place a booking becomes "paid".
 * Every request's signature is verified with STRIPE_WEBHOOK_SECRET; anything else is rejected.
 */
webhookRoutes.post("/stripe/webhook", async (c) => {
  const signature = c.req.header("stripe-signature");
  if (!signature || !c.env.STRIPE_WEBHOOK_SECRET) return c.json({ message: "Missing signature" }, 400);

  let event: Stripe.Event;
  try {
    const raw = await c.req.text();
    event = await getStripe(c.env).webhooks.constructEventAsync(raw, signature, c.env.STRIPE_WEBHOOK_SECRET, undefined, cryptoProvider);
  } catch (err) {
    console.warn("Rejected webhook with bad signature", err);
    return c.json({ message: "Invalid signature" }, 400);
  }

  const db = getDb(c.env);
  // Stripe may deliver an event more than once — handle each id only once
  const fresh = await db.insert(webhookEvents).values({ id: event.id, type: event.type }).onConflictDoNothing().returning({ id: webhookEvents.id });
  if (!fresh.length) return c.json({ received: true, duplicate: true });

  switch (event.type) {
    case "payment_intent.succeeded":
      await onPaid(db, c.env, event.data.object, (p) => c.executionCtx.waitUntil(p));
      break;
    case "payment_intent.payment_failed":
      await setStatusByIntent(db, event.data.object.id, ["pending"], "failed", "Payment failed — places released");
      break;
    case "payment_intent.canceled":
      await setStatusByIntent(db, event.data.object.id, ["pending", "failed"], "cancelled", "Payment cancelled");
      break;
    case "charge.refunded": {
      const charge = event.data.object;
      if (charge.refunded && typeof charge.payment_intent === "string")
        await setStatusByIntent(db, charge.payment_intent, ["paid"], "refunded", "Fully refunded in Stripe");
      break;
    }
  }
  return c.json({ received: true });
});

async function onPaid(db: Db, env: Env, intent: Stripe.PaymentIntent, defer: (p: Promise<unknown>) => void) {
  const id = intent.metadata.booking_id ?? (await findBookingIdByPaymentIntent(db, intent.id));
  if (!id) return console.error(`Paid PaymentIntent ${intent.id} has no booking`);
  const booking = await loadBooking(db, id);
  if (!booking || booking.status === "paid") return;
  if (intent.amount_received !== booking.totalPence) console.error(`Amount mismatch on ${booking.reference}: got ${intent.amount_received}, expected ${booking.totalPence}`);

  await db.batch([
    db.update(bookings).set({ status: "paid", paidAt: new Date().toISOString() }).where(eq(bookings.id, id)),
    audit(db, id, "stripe", `Payment received (${intent.id})`),
  ]);
  const paid = { ...booking, status: "paid" as const };
  // Only the academy is notified (parents get no email). Sent after responding so Stripe isn't kept waiting.
  defer(sendAdminNotification(env, paid).catch((e) => console.error("Admin notification failed", e)));
}

async function setStatusByIntent(db: Db, intentId: string, from: (typeof schema.BOOKING_STATUSES)[number][], to: (typeof schema.BOOKING_STATUSES)[number], note: string) {
  const id = await findBookingIdByPaymentIntent(db, intentId);
  if (!id) return;
  const updated = await db
    .update(bookings)
    .set({ status: to })
    .where(and(eq(bookings.id, id), inArray(bookings.status, from)))
    .returning({ id: bookings.id });
  if (updated.length) await audit(db, id, "stripe", note);
}

/**
 * Cron (every 15 min): bookings still "pending" after their hold expired release their places,
 * and their PaymentIntents are cancelled so a late payment can't go through.
 */
export async function expireHolds(env: Env) {
  const db = getDb(env);
  const expired = await db
    .update(bookings)
    .set({ status: "expired" })
    .where(and(eq(bookings.status, "pending"), lt(bookings.holdExpiresAt, new Date().toISOString())))
    .returning({ id: bookings.id, pi: bookings.stripePaymentIntentId });
  if (!expired.length) return;
  const stripe = getStripe(env);
  await Promise.allSettled(
    expired.map(async (b) => {
      await audit(db, b.id, "system", "Hold expired — places released");
      if (b.pi) await stripe.paymentIntents.cancel(b.pi).catch((e) => console.warn(`Could not cancel ${b.pi}`, e.message));
    }),
  );
  console.log(`Expired ${expired.length} unpaid booking(s)`);
}
