/**
 * Everything a parent can book, built from the content files in app/data.
 * Prices here are per child. Money is kept in pence to avoid rounding errors.
 */
import { camps } from "~/data/camps";
import { classes } from "~/data/classes";
import { noClassDates, termDates } from "~/data/termDates";
import type { Tone, VenueKey } from "~/data/types";
import { workshops } from "~/data/workshops";

export type ItemKind = "club" | "term" | "workshop";

export type BookableItem = {
  /** Stable id sent to the backend, e.g. "club:easter-2027" or "term:wednesday-club:spring-2027" */
  id: string;
  kind: ItemKind;
  title: string;
  subtitle: string;
  /** Human dates, e.g. "5–9 April 2027" */
  when: string;
  time: string;
  venue: VenueKey;
  ageMin: number;
  ageMax: number;
  /** First day — ages are checked against this date */
  startDate: string;
  endDate: string;
  pricePence: number;
  priceNote: string;
  capacity: number;
  tone: Tone;
  /** Weekly class only: the sessions being paid for */
  sessions?: string[];
};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const day = (s: string) => new Date(`${s}T12:00:00Z`);
const fmt = (s: string, o: Intl.DateTimeFormatOptions) => day(s).toLocaleDateString("en-GB", { ...o, timeZone: "UTC" });

export function dateRange(start: string, end: string) {
  if (start === end) return fmt(start, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const a = day(start);
  const b = day(end);
  if (a.getUTCMonth() === b.getUTCMonth()) return `${a.getUTCDate()}–${fmt(end, { day: "numeric", month: "long", year: "numeric" })}`;
  return `${fmt(start, { day: "numeric", month: "short" })} – ${fmt(end, { day: "numeric", month: "short", year: "numeric" })}`;
}

export const toPence = (pounds: number) => Math.round(pounds * 100);
export const money = (pence: number) => `£${(pence / 100).toFixed(pence % 100 === 0 ? 0 : 2)}`;

/** Every class date in a term on or after `from`, skipping half-term and listed closures. */
export function remainingSessions(termId: string, weekday: number, from: Date) {
  const term = termDates.find((t) => t.id === termId);
  if (!term) return [];
  const today = iso(from);
  const out: string[] = [];
  for (let d = day(term.start); d <= day(term.end); d.setUTCDate(d.getUTCDate() + 1)) {
    const s = iso(d);
    if (d.getUTCDay() !== weekday || s < today) continue;
    if (s >= term.halfTerm.start && s <= term.halfTerm.end) continue;
    if (noClassDates.includes(s)) continue;
    out.push(s);
  }
  return out;
}

export function buildCatalogue(now: Date): BookableItem[] {
  const today = iso(now);
  const items: BookableItem[] = [];

  for (const c of camps) {
    if (c.startDate < today) continue; // no booking once a club has started
    items.push({
      id: `club:${c.id}`,
      kind: "club",
      title: c.name,
      subtitle: `${c.format} · ${c.days} days`,
      when: dateRange(c.startDate, c.endDate),
      time: c.dailyTime,
      venue: c.venue,
      ageMin: c.ageMin,
      ageMax: c.ageMax,
      startDate: c.startDate,
      endDate: c.endDate,
      pricePence: toPence(c.price),
      priceNote: c.dayPrice ? `£${c.dayPrice} a day` : "",
      capacity: c.capacity,
      tone: c.tone,
    });
  }

  for (const cls of classes) {
    for (const term of termDates) {
      const sessions = remainingSessions(term.id, cls.weekday, now);
      if (!sessions.length) continue;
      const started = term.start < today;
      items.push({
        id: `term:${cls.id}:${term.id}`,
        kind: "term",
        title: `${cls.name} — ${term.name}`,
        subtitle: `${sessions.length} ${cls.day} session${sessions.length === 1 ? "" : "s"}${started ? " left this term" : ""}`,
        when: dateRange(sessions[0], sessions[sessions.length - 1]),
        time: `${cls.day}s, ${cls.time}`,
        venue: cls.venue,
        ageMin: cls.ageMin,
        ageMax: cls.ageMax,
        startDate: sessions[0],
        endDate: sessions[sessions.length - 1],
        pricePence: toPence(cls.pricePerSession) * sessions.length,
        priceNote: `£${cls.pricePerSession.toFixed(2)} a session`,
        capacity: cls.capacity,
        tone: cls.tone,
        sessions,
      });
    }
  }

  for (const w of workshops) {
    if (w.date < today) continue;
    items.push({
      id: `workshop:${w.id}`,
      kind: "workshop",
      title: w.name,
      subtitle: w.theme,
      when: dateRange(w.date, w.date),
      time: w.time,
      venue: w.venue,
      ageMin: w.ageMin,
      ageMax: w.ageMax,
      startDate: w.date,
      endDate: w.date,
      pricePence: toPence(w.price),
      priceNote: "",
      capacity: w.capacity,
      tone: w.tone,
    });
  }

  return items;
}

/** Child's age in whole years on a given date */
export function ageOn(dob: string, on: string) {
  const b = day(dob);
  const d = day(on);
  let age = d.getUTCFullYear() - b.getUTCFullYear();
  if (d.getUTCMonth() < b.getUTCMonth() || (d.getUTCMonth() === b.getUTCMonth() && d.getUTCDate() < b.getUTCDate())) age--;
  return age;
}
