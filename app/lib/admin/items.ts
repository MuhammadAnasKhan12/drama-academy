import { camps } from "~/data/camps";
import { classes } from "~/data/classes";
import { termDates } from "~/data/termDates";
import { workshops } from "~/data/workshops";
import { dateRange, remainingSessions, toPence } from "~/lib/booking/catalogue";
import { site } from "~/lib/site";
import type { AdminItem } from "./types";

/**
 * Every club, term and workshop for the year — past and future — with the same ids the
 * booking flow uses. (The public catalogue hides things that have started; the admin doesn't.)
 */
export function adminItems(): AdminItem[] {
  const yearStart = new Date(`${termDates[0]?.start ?? "2026-09-01"}T00:00:00Z`);
  const items: AdminItem[] = [];

  for (const c of camps) {
    items.push({
      id: `club:${c.id}`,
      kind: "club",
      title: c.name,
      when: dateRange(c.startDate, c.endDate),
      startDate: c.startDate,
      endDate: c.endDate,
      venue: site.venues[c.venue].name,
      capacity: c.capacity,
      pricePence: toPence(c.price),
    });
  }

  for (const cls of classes) {
    for (const t of termDates) {
      const sessions = remainingSessions(t.id, cls.weekday, yearStart);
      if (!sessions.length) continue;
      items.push({
        id: `term:${cls.id}:${t.id}`,
        kind: "term",
        title: `${cls.name} — ${t.name}`,
        when: dateRange(sessions[0], sessions[sessions.length - 1]),
        startDate: sessions[0],
        endDate: sessions[sessions.length - 1],
        venue: site.venues[cls.venue].name,
        capacity: cls.capacity,
        pricePence: toPence(cls.pricePerSession) * sessions.length,
      });
    }
  }

  for (const w of workshops) {
    items.push({
      id: `workshop:${w.id}`,
      kind: "workshop",
      title: w.name,
      when: dateRange(w.date, w.date),
      startDate: w.date,
      endDate: w.date,
      venue: site.venues[w.venue].name,
      capacity: w.capacity,
      pricePence: toPence(w.price),
    });
  }

  return items.sort((a, b) => a.startDate.localeCompare(b.startDate));
}
