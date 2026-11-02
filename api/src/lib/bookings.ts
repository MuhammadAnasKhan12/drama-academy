import { desc, eq, inArray } from "drizzle-orm";
import { schema, type Db } from "../db/client";

const { bookings, bookingChildren, bookingItems, auditLog } = schema;

/**
 * A booking with its children, items and history, in the shape the admin screens use
 * (`AdminBooking` in app/lib/admin/types.ts).
 */
export type FullBooking = Awaited<ReturnType<typeof loadBookings>>[number];

export async function loadBookings(db: Db, ids?: string[]) {
  const rows = ids ? await db.select().from(bookings).where(inArray(bookings.id, ids)) : await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  if (!rows.length) return [];
  const bookingIds = rows.map((b) => b.id);
  const [children, items, log] = await Promise.all([
    db.select().from(bookingChildren).where(inArray(bookingChildren.bookingId, bookingIds)).orderBy(bookingChildren.position),
    db.select().from(bookingItems).where(inArray(bookingItems.bookingId, bookingIds)),
    db.select().from(auditLog).where(inArray(auditLog.bookingId, bookingIds)).orderBy(desc(auditLog.id)),
  ]);

  return rows.map((b) => ({
    id: b.id,
    reference: b.reference,
    createdAt: b.createdAt,
    status: b.status,
    parent: {
      firstName: b.parentFirstName,
      lastName: b.parentLastName,
      email: b.email,
      phone: b.phone,
      address: { street: b.street, street2: b.street2, town: b.town, county: b.county, postcode: b.postcode },
    },
    children: children
      .filter((c) => c.bookingId === b.id)
      .map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        dob: c.dob,
        needs: c.needs,
        photoConsent: c.photoConsent,
        items: items.filter((i) => i.childId === c.id).map((i) => i.itemId),
      })),
    lines: items.filter((i) => i.bookingId === b.id),
    totalPence: b.totalPence,
    stripePaymentId: b.stripePaymentIntentId,
    log: log.filter((l) => l.bookingId === b.id).map((l) => ({ at: l.at, by: l.by, action: l.action })),
  }));
}

export async function loadBooking(db: Db, id: string) {
  return (await loadBookings(db, [id]))[0];
}

export async function findBookingIdByPaymentIntent(db: Db, paymentIntentId: string) {
  const row = await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.stripePaymentIntentId, paymentIntentId)).get();
  return row?.id;
}

export const audit = (db: Db, bookingId: string, by: string, action: string) => db.insert(auditLog).values({ bookingId, by, action });
