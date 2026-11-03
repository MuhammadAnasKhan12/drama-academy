/**
 * The admin area's only connection to the server.
 *
 * Today (site.bookingApiUrl = null) it serves SAMPLE DATA from mock.ts.
 * When the backend is live it calls these routes (the /admin ones need a signed-in admin):
 *   GET   {api}/auth/me                           → { email }   (401 when signed out)
 *   POST  {api}/auth/login   { email, password }  → { email }   (sets the session cookie)
 *   POST  {api}/auth/logout
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

/** Thrown when the session has expired or the admin was removed — the admin screens show the sign-in form */
export class SignedOutError extends Error {}

/** Shown in the corner in sample-data mode */
const SAMPLE_ADMIN = "admin@dramakids.co.uk";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${site.bookingApiUrl}${path}`, {
    ...init,
    credentials: "include", // sends the admin session cookie
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (res.status === 401) throw new SignedOutError("Please sign in again.");
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

/** The signed-in admin's email, or null */
export async function fetchSession(): Promise<string | null> {
  if (isSampleData()) return SAMPLE_ADMIN;
  try {
    return (await request<{ email: string }>("/auth/me")).email;
  } catch (e) {
    if (e instanceof SignedOutError) return null;
    throw e;
  }
}

export async function signIn(email: string, password: string): Promise<string> {
  const res = await fetch(`${site.bookingApiUrl}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = (await res.json().catch(() => ({}))) as { email?: string; message?: string };
  if (!res.ok || !body.email) throw new Error(body.message ?? "Could not sign in. Please try again.");
  return body.email;
}

export async function signOut(): Promise<void> {
  if (isSampleData()) return;
  await request("/auth/logout", { method: "POST" });
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
