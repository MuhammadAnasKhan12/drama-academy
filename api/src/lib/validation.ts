import type { Context } from "hono";
import { z } from "zod";

/**
 * What the booking page sends to POST /api/payment-intent.
 * Matches `BookingPayload` in app/lib/booking/api.ts. Every field is checked here before
 * anything touches the database or Stripe.
 */
const text = (max: number) => z.string().trim().min(1).max(max);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const bookingSchema = z.object({
  parent: z.object({
    firstName: text(60),
    lastName: text(60),
    phone: z.string().trim().regex(/^(\+44\s?|0)[\d\s]{9,13}$/, "UK phone number"),
    email: z.string().trim().toLowerCase().pipe(z.email()).refine((e) => e.length <= 254),
    address: z.object({
      street: text(120),
      street2: z.string().trim().max(120).default(""),
      town: text(80),
      county: z.string().trim().max(80).default(""),
      postcode: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/, "UK postcode"),
    }),
  }),
  children: z
    .array(
      z.object({
        firstName: text(60),
        lastName: text(60),
        dob: isoDate,
        needs: text(1000),
        photoConsent: z.boolean(),
        items: z.array(z.string().max(120)).min(1).max(20),
      }),
    )
    .min(1)
    .max(6),
  expectedTotalPence: z.number().int().nonnegative(),
  agreedToTerms: z.literal(true),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const adminStatusSchema = z.object({ status: z.enum(["refunded", "cancelled"]) });
export const itemOpenSchema = z.object({ open: z.boolean() });

/** zValidator hook: a short, safe error message (no schema internals) listing the fields to fix */
export const invalidRequest = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }, c: Context) => {
  if (result.success) return;
  const fields = [...new Set(result.error?.issues.map((i) => i.path.map(String).join(".")) ?? [])];
  return c.json({ message: "Please check the details you entered.", fields }, 400);
};
