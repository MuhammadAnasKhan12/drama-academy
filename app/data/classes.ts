/**
 * ✏️ Weekly classes. Edit names, times and prices here — the website updates itself.
 * Source: client message (Oct 2026) — "We only run the weekly Wednesday 16:00–17:00 for ages 4–11,
 * £10.50 per hour". Parents book the rest of a term and pay per session.
 */
import type { DramaClass } from "./types";

export const classes: DramaClass[] = [
  {
    id: "wednesday-club",
    name: "Wednesday Drama Club",
    ages: "4–11",
    ageMin: 4,
    ageMax: 11,
    tone: "teal",
    day: "Wednesday",
    time: "4:00–5:00pm",
    weekday: 3,
    venue: "ashVillageHall",
    pricePerSession: 10.5,
    groupSize: 16, // [PLACEHOLDER] confirm maximum group size
    capacity: 16, // [PLACEHOLDER] places per term for online booking
    blurb:
      "Our after-school drama club: games, storytelling, characters and scripts, building to a live performance at the end of the autumn and summer terms. No experience needed.",
    learn: ["Confidence and voice projection", "Storytelling and character", "Working as an ensemble", "Performing to a live audience"],
    photo: "runningGame",
  },
];

/** How long one session lasts, in hours (price is £10.50 per hour) */
export const SESSION_HOURS = 1;
