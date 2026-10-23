/**
 * ✏️ Shows and productions.
 * Paste the ticket link into ticketUrl when tickets go on sale (null shows "Tickets coming soon").
 * [PLACEHOLDER] titles, dates and venues are examples.
 */
import type { PastShow, Show } from "./types";

export const shows: Show[] = [
  {
    id: "snow-queen-2026",
    title: "The Snow Queen",
    strapline: "A frosty fairytale of friendship and courage",
    description:
      "Gerda sets off across a frozen kingdom to rescue her best friend Kai in our Christmas production — with snowstorms, talking reindeer and a whole lot of heart.",
    performances: [
      { date: "2026-12-12", time: "14:00" },
      { date: "2026-12-12", time: "18:00" },
      { date: "2026-12-13", time: "14:00" },
    ],
    venue: "[PLACEHOLDER] Theatre name, Canterbury",
    priceFrom: 9,
    ticketUrl: null,
    cast: "Juniors & Seniors",
    tone: "blue",
    icon: "snowflake",
  },
  {
    id: "alice-2027",
    title: "Alice: Down the Rabbit Hole",
    strapline: "Curiouser and curiouser…",
    description:
      "Tea parties, card soldiers and a very late rabbit. Our Mini Stars and Juniors tumble into Wonderland for a spring show full of colour and nonsense.",
    performances: [
      { date: "2027-03-20", time: "14:00" },
      { date: "2027-03-20", time: "17:30" },
    ],
    venue: "[PLACEHOLDER] Theatre name, Canterbury",
    priceFrom: 8,
    ticketUrl: null,
    cast: "Mini Stars & Juniors",
    tone: "magenta",
    icon: "rabbit",
  },
  {
    id: "pied-piper-2027",
    title: "The Pied Piper of Canterbury",
    strapline: "A brand-new musical, written by our Seniors",
    description:
      "Rats in the Cathedral! A Canterbury twist on the classic tale, devised and written by our Seniors, with original songs.",
    performances: [
      { date: "2027-07-10", time: "14:00" },
      { date: "2027-07-10", time: "19:00" },
    ],
    venue: "[PLACEHOLDER] Theatre name, Canterbury",
    priceFrom: 10,
    ticketUrl: null,
    cast: "The whole academy",
    tone: "teal",
    icon: "music",
  },
];

export const pastShows: PastShow[] = [
  { id: "wind-willows-2026", title: "The Wind in the Willows", year: 2026, note: "Summer production", photos: ["runningGame", "drumGame"] },
  { id: "robin-hood-2025", title: "Robin Hood & the Merry Band", year: 2025, note: "Christmas production", photos: ["huddle", "warmupCircle"] },
  { id: "peter-pan-2025", title: "Peter Pan", year: 2025, note: "Summer production", photos: ["musicGuitar", "storyCircle"] },
];
