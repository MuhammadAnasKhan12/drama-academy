/**
 * Database tables (Cloudflare D1 / SQLite), defined with Drizzle.
 * After changing this file run `npm run api:db:generate` to create a migration.
 *
 * Card details are NEVER stored — only Stripe's PaymentIntent id.
 */
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const BOOKING_STATUSES = ["pending", "paid", "failed", "refunded", "cancelled", "expired"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const now = sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

export const bookings = sqliteTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull(),
    status: text("status", { enum: BOOKING_STATUSES }).notNull().default("pending"),
    parentFirstName: text("parent_first_name").notNull(),
    parentLastName: text("parent_last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    street: text("street").notNull(),
    street2: text("street2").notNull().default(""),
    town: text("town").notNull(),
    county: text("county").notNull().default(""),
    postcode: text("postcode").notNull(),
    totalPence: integer("total_pence").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: text("created_at").notNull().default(now),
    /** Places are held until this time while the parent pays */
    holdExpiresAt: text("hold_expires_at").notNull(),
    paidAt: text("paid_at"),
  },
  (t) => [
    uniqueIndex("bookings_reference_idx").on(t.reference),
    uniqueIndex("bookings_pi_idx").on(t.stripePaymentIntentId),
    index("bookings_status_idx").on(t.status),
  ],
);

export const bookingChildren = sqliteTable(
  "booking_children",
  {
    id: text("id").primaryKey(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    dob: text("dob").notNull(),
    needs: text("needs").notNull(),
    photoConsent: integer("photo_consent", { mode: "boolean" }).notNull(),
    position: integer("position").notNull(),
  },
  (t) => [index("children_booking_idx").on(t.bookingId)],
);

/** One row per child per club/term/workshop — this is what counts towards capacity */
export const bookingItems = sqliteTable(
  "booking_items",
  {
    id: text("id").primaryKey(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    childId: text("child_id")
      .notNull()
      .references(() => bookingChildren.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    pricePence: integer("price_pence").notNull(),
  },
  (t) => [index("items_item_idx").on(t.itemId), index("items_booking_idx").on(t.bookingId)],
);

/** Clubs/terms the admin has closed for online booking */
export const itemSettings = sqliteTable("item_settings", {
  itemId: text("item_id").primaryKey(),
  closed: integer("closed", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull().default(now),
  updatedBy: text("updated_by").notNull().default(""),
});

/** Every admin action and payment event, for accountability */
export const auditLog = sqliteTable(
  "audit_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bookingId: text("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
    at: text("at").notNull().default(now),
    by: text("by").notNull(),
    action: text("action").notNull(),
  },
  (t) => [index("audit_booking_idx").on(t.bookingId)],
);

/** Stripe webhook events already handled — Stripe can send the same event more than once */
export const webhookEvents = sqliteTable("webhook_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  receivedAt: text("received_at").notNull().default(now),
});
