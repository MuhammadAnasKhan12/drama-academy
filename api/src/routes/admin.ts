import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { getDb, schema } from "../db/client";
import type { AppEnv } from "../env";
import { audit, loadBooking, loadBookings } from "../lib/bookings";
import { closedItems } from "../lib/places";
import { getStripe } from "../lib/stripe";
import { adminStatusSchema, invalidRequest, itemOpenSchema } from "../lib/validation";
import { requireAdmin } from "../middleware/session";

const { bookings, itemSettings } = schema;

export const adminRoutes = new Hono<AppEnv>();
adminRoutes.use("*", requireAdmin);
adminRoutes.use("*", async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store"); // children's data must never be cached
});

/** Everything for the admin screens (shape: AdminBooking[] in app/lib/admin/types.ts) */
adminRoutes.get("/bookings", async (c) => {
  const all = await loadBookings(getDb(c.env));
  return c.json(all.map(({ lines: _lines, ...b }) => b));
});

/** Mark refunded (after refunding in Stripe) or cancel. Cancelling an unpaid booking also cancels its payment. */
adminRoutes.patch("/bookings/:id", zValidator("json", adminStatusSchema, invalidRequest), async (c) => {
  const db = getDb(c.env);
  const id = c.req.param("id");
  const { status } = c.req.valid("json");
  const allowedFrom = status === "refunded" ? (["paid"] as const) : (["paid", "pending"] as const);
  const updated = await db
    .update(bookings)
    .set({ status })
    .where(and(eq(bookings.id, id), inArray(bookings.status, [...allowedFrom])))
    .returning({ pi: bookings.stripePaymentIntentId, was: bookings.status });
  if (!updated.length) return c.json({ message: `This booking can't be marked as ${status}.` }, 409);

  await audit(db, id, c.var.adminEmail, `Marked as ${status}`);
  if (status === "cancelled" && updated[0].pi) {
    // Harmless if the payment already succeeded (Stripe refuses); refunds are done in the Stripe dashboard
    await getStripe(c.env).paymentIntents.cancel(updated[0].pi).catch(() => undefined);
  }
  const { lines: _lines, ...booking } = (await loadBooking(db, id))!;
  return c.json(booking);
});

/** Which clubs/terms are closed for online booking */
adminRoutes.get("/items", async (c) => c.json({ closed: [...(await closedItems(getDb(c.env)))] }));

adminRoutes.patch("/items/:id", zValidator("json", itemOpenSchema, invalidRequest), async (c) => {
  const itemId = c.req.param("id");
  const closed = !c.req.valid("json").open;
  await getDb(c.env)
    .insert(itemSettings)
    .values({ itemId, closed, updatedBy: c.var.adminEmail })
    .onConflictDoUpdate({ target: itemSettings.itemId, set: { closed, updatedBy: c.var.adminEmail, updatedAt: new Date().toISOString() } });
  return c.json({ ok: true });
});
