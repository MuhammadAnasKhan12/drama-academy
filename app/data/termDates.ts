/**
 * ✏️ Term dates. We follow Kent County Council school terms.
 * [PLACEHOLDER] check against the official KCC calendar each year.
 */
import type { Term } from "./types";

export const termDatesYear = "2026–27";

export const termDates: Term[] = [
  { name: "Autumn term", start: "2026-09-07", end: "2026-12-18", halfTerm: { start: "2026-10-26", end: "2026-10-30" } },
  { name: "Spring term", start: "2027-01-04", end: "2027-03-26", halfTerm: { start: "2027-02-15", end: "2027-02-19" } },
  { name: "Summer term", start: "2027-04-12", end: "2027-07-16", halfTerm: { start: "2027-05-31", end: "2027-06-04" } },
];
