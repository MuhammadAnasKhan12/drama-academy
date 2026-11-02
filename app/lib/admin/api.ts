/**
 * The admin area's only connection to the server.
 *
 * Today (site.bookingApiUrl = null) it serves SAMPLE DATA from mock.ts.
 * When the backend is live it calls these protected routes (Cloudflare Access sits in front of them):
 *   GET   {api}/admin/bookings                    → AdminBooking[]
 *   PATCH {api}/admin/bookings/:id  { status }    → AdminBooking
 *   GET   {api}/admin/items                       → { closed: string[] }
 *   PATCH {api}/admin/items/:id     { open }      → { ok: true }
 */
import { site } from "~/lib/site";
import { adminItems } from "./items";
import { sampleBookings } from "./mock";
import type { AdminBooking, BookingStatus } from "./types";

export const isSampleData = () => !site.bookingApiUrl;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${site.bookingApiUrl}${path}`, {
    ...init,
    credentials: "include", // sends the Cloudflare Access cookie
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchBookings(): Promise<AdminBooking[]> {
  if (isSampleData()) {
    await wait(350);
    return sampleBookings(adminItems());
  }
  return request("/admin/bookings");
}

export async function fetchClosedItems(): Promise<string[]> {
  if (isSampleData()) return [];
  return (await request<{ closed: string[] }>("/admin/items")).closed;
}

/** Returns the updated booking from the server (null with sample data) */
export async function setBookingStatus(id: string, status: BookingStatus): Promise<AdminBooking | null> {
  if (isSampleData()) {
    await wait(300);
    return null;
  }
  return request(`/admin/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function setItemOpen(id: string, open: boolean): Promise<void> {
  if (isSampleData()) return wait(250);
  await request(`/admin/items/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ open }) });
}
