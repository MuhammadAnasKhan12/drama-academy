import { and, eq, gt, inArray, or, sql } from "drizzle-orm";
import { schema, type Db } from "../db/client";

const { bookings, bookingItems, itemSettings } = schema;

/**
 * Places taken per item: paid bookings, plus pending ones whose hold hasn't expired yet
 * (a parent is in the middle of paying).
 */
export async function placesTaken(db: Db, nowIso: string, itemIds?: string[]) {
  const holding = or(eq(bookings.status, "paid"), and(eq(bookings.status, "pending"), gt(bookings.holdExpiresAt, nowIso)));
  const rows = await db
    .select({ itemId: bookingItems.itemId, taken: sql<number>`count(*)` })
    .from(bookingItems)
    .innerJoin(bookings, eq(bookings.id, bookingItems.bookingId))
    .where(itemIds?.length ? and(holding, inArray(bookingItems.itemId, itemIds)) : holding)
    .groupBy(bookingItems.itemId);
  return new Map(rows.map((r) => [r.itemId, Number(r.taken)]));
}

export async function closedItems(db: Db) {
  const rows = await db.select({ itemId: itemSettings.itemId }).from(itemSettings).where(eq(itemSettings.closed, true));
  return new Set(rows.map((r) => r.itemId));
}
