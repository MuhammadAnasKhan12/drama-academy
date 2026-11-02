/**
 * SAMPLE DATA for the admin screens while the backend isn't built.
 * Every name, email and phone number here is made up. Generated from a fixed seed, so it's
 * the same on every load. Delete this file once the real API is connected.
 */
import type { AdminBooking, AdminItem, BookingStatus } from "./types";

// Small deterministic random number generator (mulberry32)
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const childNames = ["Ava", "Leo", "Isla", "Oliver", "Mia", "Arlo", "Rosie", "Freddie", "Amara", "Theo", "Poppy", "Zayn", "Evie", "Kai", "Maisie", "Noah", "Ivy", "Reggie", "Lila", "Jude", "Nia", "Albie", "Daisy", "Rafi"];
const parentNames = ["Sarah", "James", "Priya", "Tom", "Emma", "Chloe", "Daniel", "Aisha", "Laura", "Ben", "Hannah", "Marcus", "Fatima", "Rachel", "Owen", "Grace"];
const surnames = ["Smith", "Patel", "Jones", "Okafor", "Taylor", "Brown", "Khan", "Wilson", "Evans", "Clarke", "Hughes", "Ahmed", "Walker", "Green", "Hall", "Wood"];
const streets = ["Station Road", "The Street", "Church Lane", "Sandwich Road", "Mill Lane", "Orchard Close", "St Dunstan's Street", "London Road"];
const towns = [
  { town: "Canterbury", postcode: "CT1 3AB" },
  { town: "Canterbury", postcode: "CT2 7NZ" },
  { town: "Ash", postcode: "CT3 2BD" },
  { town: "Sandwich", postcode: "CT13 9EF" },
  { town: "Whitstable", postcode: "CT5 1QT" },
  { town: "Wingham", postcode: "CT3 1AS" },
];
const needsList = ["None", "None", "None", "None", "None", "Nut allergy — carries an EpiPen", "Asthma (inhaler in bag)", "Mild dairy intolerance", "Autistic — may need quiet breaks", "Hay fever", "None", "Shy at first, settles quickly"];

const pick = <T,>(r: () => number, list: T[]) => list[Math.floor(r() * list.length)];

export function sampleBookings(items: AdminItem[]): AdminBooking[] {
  const r = rng(20261030);
  const base = Date.UTC(2026, 6, 1); // bookings made from 1 July 2026 onwards
  const statuses: BookingStatus[] = ["paid", "paid", "paid", "paid", "paid", "paid", "paid", "pending", "failed", "refunded"];
  const out: AdminBooking[] = [];

  for (let i = 0; i < 46; i++) {
    const surname = pick(r, surnames);
    const place = pick(r, towns);
    const nChildren = r() < 0.25 ? 2 : 1;
    // Each booking takes 1–2 items; siblings usually attend the same things
    const chosen = Array.from(new Set([pick(r, items).id, ...(r() < 0.35 ? [pick(r, items).id] : [])]));
    const used = new Set<string>();
    const children = Array.from({ length: nChildren }, (_, c) => {
      let firstName = pick(r, childNames);
      while (used.has(firstName)) firstName = pick(r, childNames); // siblings get different names
      used.add(firstName);
      const age = 4 + Math.floor(r() * 8);
      const dob = new Date(Date.UTC(2026 - age, Math.floor(r() * 12), 1 + Math.floor(r() * 27))).toISOString().slice(0, 10);
      return {
        id: `c${i}-${c}`,
        firstName,
        lastName: surname,
        dob,
        needs: pick(r, needsList),
        photoConsent: r() < 0.78,
        items: c === 0 || r() < 0.8 ? chosen : chosen.slice(0, 1),
      };
    });
    const totalPence = children.reduce((sum, c) => sum + c.items.reduce((s, id) => s + (items.find((x) => x.id === id)?.pricePence ?? 0), 0), 0);
    const status = pick(r, statuses);
    const createdAt = new Date(base + Math.floor(r() * 118) * 86_400_000 + Math.floor(r() * 50_000_000)).toISOString();
    const parent = pick(r, parentNames);
    const ref = `DK-${Math.floor(r() * 36 ** 6).toString(36).toUpperCase().padStart(6, "0")}`;

    out.push({
      id: `b${i}`,
      reference: ref,
      createdAt,
      status,
      parent: {
        firstName: parent,
        lastName: surname,
        email: `${parent.toLowerCase()}.${surname.toLowerCase()}@example.com`,
        phone: `07700 9${String(Math.floor(r() * 100000)).padStart(5, "0")}`,
        address: { street: `${1 + Math.floor(r() * 120)} ${pick(r, streets)}`, street2: "", town: place.town, county: "Kent", postcode: place.postcode },
      },
      children,
      totalPence,
      stripePaymentId: status === "failed" ? null : `pi_sample${i.toString().padStart(4, "0")}`,
      log: status === "refunded" ? [{ at: createdAt, by: "admin@example.com", action: "Marked as refunded" }] : [],
    });
  }

  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
