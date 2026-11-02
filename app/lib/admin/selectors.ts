import { ageOn } from "~/lib/booking/catalogue";
import { holdsPlace } from "~/stores/admin";
import type { AdminBooking, AdminChild } from "./types";

export type RosterRow = { child: AdminChild; booking: AdminBooking; age: number };

/** Children booked onto an item (paid + payment pending), sorted by surname. */
export function rosterFor(itemId: string, bookings: AdminBooking[], onDate: string): RosterRow[] {
  return bookings
    .filter((b) => holdsPlace(b.status))
    .flatMap((b) => b.children.filter((c) => c.items.includes(itemId)).map((child) => ({ child, booking: b, age: ageOn(child.dob, onDate) })))
    .sort((a, b) => a.child.lastName.localeCompare(b.child.lastName) || a.child.firstName.localeCompare(b.child.firstName));
}

export const placesTaken = (itemId: string, bookings: AdminBooking[]) => rosterFor(itemId, bookings, "2026-01-01").length;

export const hasNeeds = (needs: string) => !/^\s*(none|n\/a|no)\.?\s*$/i.test(needs);

export const fullName = (p: { firstName: string; lastName: string }) => `${p.firstName} ${p.lastName}`;

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

export const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" });

/** Turns rows into a CSV file and downloads it (opens in Excel / Google Sheets). */
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
