import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { ageOn, buildCatalogue, money } from "~/lib/booking/catalogue";
import { getDb, schema } from "../db/client";
import type { AppEnv } from "../env";
import { audit } from "../lib/bookings";
import { newId, newReference } from "../lib/ids";
import { closedItems, placesTaken } from "../lib/places";
import { getStripe } from "../lib/stripe";
import { bookingSchema, invalidRequest } from "../lib/validation";

const { bookings, bookingChildren, bookingItems } = schema;

export const publicRoutes = new Hono<AppEnv>();

/** Places left for everything currently bookable. Closed items report 0. */
publicRoutes.get("/availability", async (c) => {
  const db = getDb(c.env);
  const now = new Date();
  const [taken, closed] = await Promise.all([placesTaken(db, now.toISOString()), closedItems(db)]);
  const places = Object.fromEntries(
    buildCatalogue(now).map((i) => [i.id, closed.has(i.id) ? 0 : Math.max(0, i.capacity - (taken.get(i.id) ?? 0))]),
  );
  c.header("Cache-Control", "no-store");
  return c.json(places);
});

/**
 * Creates a pending booking that holds the places, then a Stripe PaymentIntent for it.
 * Prices, ages and availability are all re-checked here — nothing from the browser is trusted.
 */
publicRoutes.post("/payment-intent", bodyLimit({ maxSize: 32 * 1024 }), zValidator("json", bookingSchema, invalidRequest), async (c) => {
  const input = c.req.valid("json");
  const db = getDb(c.env);
  const now = new Date();
  const nowIso = now.toISOString();
  const catalogue = new Map(buildCatalogue(now).map((i) => [i.id, i]));
  const closed = await closedItems(db);

  // 1. Every item must exist, be open, suit the child's age and appear once per child
  const needed = new Map<string, number>();
  let total = 0;
  for (const child of input.children) {
    if (new Set(child.items).size !== child.items.length) return c.json({ message: "A child is booked onto the same session twice." }, 400);
    for (const id of child.items) {
      const item = catalogue.get(id);
      if (!item || closed.has(id)) return c.json({ message: "One of your choices is no longer available. Please go back and check your booking." }, 409);
      const age = ageOn(child.dob, item.startDate);
      if (age < item.ageMin || age > item.ageMax)
        return c.json({ message: `${child.firstName} is outside the age range (${item.ageMin}–${item.ageMax}) for ${item.title}.` }, 400);
      needed.set(id, (needed.get(id) ?? 0) + 1);
      total += item.pricePence;
    }
  }

  // 2. The price the parent saw must match the real price
  if (total !== input.expectedTotalPence)
    return c.json({ message: `Prices have changed — the correct total is ${money(total)}. Please review your booking.`, totalPence: total }, 409);

  // 3. Enough places?
  const full = async (excludeCheck = false) => {
    const taken = await placesTaken(db, nowIso, [...needed.keys()]);
    for (const [id, n] of needed) {
      const item = catalogue.get(id)!;
      if ((taken.get(id) ?? 0) + (excludeCheck ? 0 : n) > item.capacity) return item.title;
    }
    return null;
  };
  const fullBefore = await full();
  if (fullBefore) return c.json({ message: `Sorry, there aren't enough places left on ${fullBefore}.` }, 409);

  // 4. Save the pending booking (one atomic batch) — this holds the places
  const bookingId = newId();
  const reference = newReference();
  const holdMinutes = Number(c.env.HOLD_MINUTES) || 30;
  const p = input.parent;
  const childRows = input.children.map((ch, position) => ({
    id: newId(),
    bookingId,
    firstName: ch.firstName,
    lastName: ch.lastName,
    dob: ch.dob,
    needs: ch.needs,
    photoConsent: ch.photoConsent,
    position,
  }));
  const itemRows = input.children.flatMap((ch, i) =>
    ch.items.map((itemId) => ({ id: newId(), bookingId, childId: childRows[i].id, itemId, pricePence: catalogue.get(itemId)!.pricePence })),
  );
  await db.batch([
    db.insert(bookings).values({
      id: bookingId,
      reference,
      status: "pending",
      parentFirstName: p.firstName,
      parentLastName: p.lastName,
      email: p.email,
      phone: p.phone,
      street: p.address.street,
      street2: p.address.street2,
      town: p.address.town,
      county: p.address.county,
      postcode: p.address.postcode,
      totalPence: total,
      holdExpiresAt: new Date(now.getTime() + holdMinutes * 60_000).toISOString(),
    }),
    db.insert(bookingChildren).values(childRows),
    db.insert(bookingItems).values(itemRows),
  ]);

  // 5. Two parents may have grabbed the last place at the same moment — check again, now including us
  const fullAfter = await full(true);
  if (fullAfter) {
    await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, bookingId));
    return c.json({ message: `Sorry, the last places on ${fullAfter} were just taken.` }, 409);
  }

  // 6. Create the PaymentIntent (card only). The idempotency key stops duplicate charges on retries.
  try {
    const stripe = getStripe(c.env);
    const intent = await stripe.paymentIntents.create(
      {
        amount: total,
        currency: "gbp",
        allowed_payment_method_types: ["card"],
        description: `Drama Kids booking ${reference}`,
        metadata: { booking_id: bookingId, reference },
      },
      { idempotencyKey: `booking-${bookingId}` },
    );
    await db.batch([
      db.update(bookings).set({ stripePaymentIntentId: intent.id }).where(eq(bookings.id, bookingId)),
      audit(db, bookingId, "system", `Booking created, places held for ${holdMinutes} minutes`),
    ]);
    return c.json({ clientSecret: intent.client_secret, reference, totalPence: total });
  } catch (err) {
    console.error("Stripe PaymentIntent error", err);
    await db.update(bookings).set({ status: "failed" }).where(eq(bookings.id, bookingId));
    return c.json({ message: "We couldn't start the payment. Please try again in a moment." }, 502);
  }
});

/**
 * Status for the confirmation page after Stripe redirects back.
 * Needs both the reference and the PaymentIntent id, so bookings can't be guessed.
 */
publicRoutes.get("/bookings/:reference/status", async (c) => {
  const pi = c.req.query("payment_intent");
  if (!pi) return c.json({ message: "Missing payment_intent" }, 400);
  const row = await getDb(c.env)
    .select({ status: bookings.status, reference: bookings.reference, totalPence: bookings.totalPence })
    .from(bookings)
    .where(and(eq(bookings.reference, c.req.param("reference")), eq(bookings.stripePaymentIntentId, pi)))
    .get();
  if (!row) return c.json({ message: "Booking not found" }, 404);
  c.header("Cache-Control", "no-store");
  return c.json(row);
});
