import { camps } from "~/data/camps";
import { shows } from "~/data/shows";

/** Start of a show performance as a Date (UK time is close enough for countdowns). */
export const performanceDate = (p: { date: string; time: string }) => new Date(`${p.date}T${p.time}:00`);

export function upcomingCamps(now = new Date()) {
  return camps
    .filter((c) => new Date(`${c.endDate}T23:59:59`) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function upcomingShows(now = new Date()) {
  return shows
    .filter((s) => s.performances.some((p) => performanceDate(p) >= now))
    .sort((a, b) => a.performances[0].date.localeCompare(b.performances[0].date));
}

export type NextEvent =
  | { kind: "camp"; title: string; date: Date; detail: string; to: string }
  | { kind: "show"; title: string; date: Date; detail: string; to: string };

/** The soonest camp or show — powers the marquee banner on the home page. */
export function nextEvent(now = new Date()): NextEvent | null {
  const camp = upcomingCamps(now).find((c) => new Date(`${c.startDate}T09:00:00`) > now);
  const show = upcomingShows(now)[0];
  const showDate = show ? performanceDate(show.performances.find((p) => performanceDate(p) > now) ?? show.performances[0]) : null;
  const campDate = camp ? new Date(`${camp.startDate}T09:00:00`) : null;

  if (camp && campDate && (!showDate || campDate <= showDate)) {
    return { kind: "camp", title: camp.name, date: campDate, detail: `${camp.season} camp · ages ${camp.ages}`, to: "/holiday-camps" };
  }
  if (show && showDate) {
    return { kind: "show", title: show.title, date: showDate, detail: show.cast, to: "/shows" };
  }
  return null;
}
