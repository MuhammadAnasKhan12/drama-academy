/**
 * Shapes returned by the (future) admin API — GET /api/admin/bookings.
 * The sample data in mock.ts uses exactly these types, so swapping in the real API is a one-line change.
 */
/** "expired" = the parent never finished paying and the held places were released */
export type BookingStatus = "paid" | "pending" | "failed" | "refunded" | "cancelled" | "expired";

export type AdminChild = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO date
  needs: string; // allergies / specific needs, "None" if none
  photoConsent: boolean;
  /** Item ids this child is booked onto, e.g. "club:easter-2027" */
  items: string[];
};

export type AdminBooking = {
  id: string;
  reference: string; // shown to parents, e.g. "DK-7Q2M4X"
  createdAt: string; // ISO datetime
  status: BookingStatus;
  parent: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: { street: string; street2: string; town: string; county: string; postcode: string };
  };
  children: AdminChild[];
  totalPence: number;
  /** Stripe PaymentIntent id, for the "View in Stripe" link */
  stripePaymentId: string | null;
  /** Admin actions, newest first */
  log: { at: string; by: string; action: string }[];
};

/** Something a child can be booked onto, as seen by the admin (includes past dates). */
export type AdminItem = {
  id: string;
  kind: "club" | "term" | "workshop";
  title: string;
  when: string;
  startDate: string;
  endDate: string;
  venue: string;
  capacity: number;
  pricePence: number;
};
