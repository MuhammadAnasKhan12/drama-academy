/**
 * ✏️ Performances. The flyer says the autumn and summer terms each end with a live performance.
 * Paste a ticket link into ticketUrl if tickets are sold (null shows "Details to follow").
 * [PLACEHOLDER] dates, times and venue — confirm with the client.
 */
import type { PastShow, Show } from "./types";

export const shows: Show[] = [
  {
    id: "autumn-performance-2026",
    title: "Autumn Term Performance",
    strapline: "An original play celebrating diversity in literature",
    description:
      "This term our Wednesday Drama Club has been creating an original play script that celebrates the rich diversity within literature. Families are invited to the live performance at the end of term.",
    performances: [{ date: "2026-12-16", time: "16:00" }],
    venue: "Ash Village Hall",
    priceFrom: 0,
    ticketUrl: null,
    cast: "Wednesday Drama Club",
    tone: "blue",
    icon: "feather",
  },
  {
    id: "summer-production-2027",
    title: "Summer Production",
    strapline: "Our spectacular end-of-year show",
    description:
      "The summer term builds to a spectacular production, with a part for every child. A brilliant way to celebrate everything they've learned this year.",
    performances: [{ date: "2027-07-14", time: "16:00" }],
    venue: "Ash Village Hall",
    priceFrom: 0,
    ticketUrl: null,
    cast: "Wednesday Drama Club",
    tone: "magenta",
    icon: "crown",
  },
];

/** [PLACEHOLDER] examples — replace with real past productions and photos */
export const pastShows: PastShow[] = [
  { id: "summer-2026", title: "Summer Production 2026", year: 2026, note: "Summer term", photos: ["runningGame", "drumGame"] },
  { id: "autumn-2025", title: "Autumn Performance 2025", year: 2025, note: "Autumn term", photos: ["huddle", "warmupCircle"] },
];
