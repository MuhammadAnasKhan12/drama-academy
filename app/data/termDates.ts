/**
 * ✏️ Term dates and what each term focuses on (from the 2026–27 flyer).
 * We follow Kent County Council school terms — the half-terms match the holiday club dates.
 * The weekly class runs every Wednesday in term time, except during half-term.
 * [PLACEHOLDER] check start/end dates against the official KCC calendar.
 */
import type { Term } from "./types";

export const termDatesYear = "2026–27";

export const termDates: Term[] = [
  {
    id: "autumn-2026",
    name: "Autumn term",
    focus: "An original play script celebrating the rich diversity within literature, with a live performance at the end of term.",
    start: "2026-09-07",
    end: "2026-12-18",
    halfTerm: { start: "2026-10-26", end: "2026-10-30" },
  },
  {
    id: "spring-2027",
    name: "Spring term",
    focus: "An immersive multimedia project to develop contemporary performance skills.",
    start: "2027-01-04",
    end: "2027-03-26",
    halfTerm: { start: "2027-02-15", end: "2027-02-19" },
  },
  {
    id: "summer-2027",
    name: "Summer term",
    focus: "A spectacular summer production, with a live performance at the end of term.",
    start: "2027-04-12",
    end: "2027-07-21",
    halfTerm: { start: "2027-05-31", end: "2027-06-04" },
  },
];

/** Individual dates with no class (e.g. bank holidays or venue closures). Year-month-day. */
export const noClassDates: string[] = [];
