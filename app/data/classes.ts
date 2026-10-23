/**
 * ✏️ Weekly classes. Edit names, times and prices here — the website updates itself.
 * [PLACEHOLDER] days, times and prices are examples.
 */
import type { DramaClass } from "./types";

export const classes: DramaClass[] = [
  {
    id: "mini-stars",
    name: "Mini Stars",
    ages: "4–6",
    ageMin: 4,
    ageMax: 6,
    tone: "spotlight",
    day: "Saturday",
    time: "9:30–10:30am",
    pricePerTerm: 120,
    groupSize: 12,
    blurb:
      "Big imaginations, tiny feet! Story-led drama games, songs and movement that help little ones find their voice — no experience needed.",
    learn: ["Listening and taking turns", "Storytelling through play", "Singing and movement", "Making new friends"],
    photo: "drumGame",
  },
  {
    id: "juniors",
    name: "Juniors",
    ages: "7–11",
    ageMin: 7,
    ageMax: 11,
    tone: "teal",
    day: "Saturday",
    time: "10:45am–12:15pm",
    pricePerTerm: 150,
    groupSize: 16,
    blurb:
      "Improvisation, character work and scripts, building towards an end-of-term sharing for families. Brilliant for confidence in the classroom too.",
    learn: ["Improvisation and character", "Voice projection", "Working as an ensemble", "Performing to an audience"],
    photo: "runningGame",
  },
  {
    id: "seniors",
    name: "Seniors",
    ages: "12–16",
    ageMin: 12,
    ageMax: 16,
    tone: "magenta",
    day: "Wednesday",
    time: "5:00–6:30pm",
    pricePerTerm: 165,
    groupSize: 16,
    blurb:
      "Devising, monologues and full productions with real technical theatre. A creative space to try bold ideas — with optional LAMDA exam preparation.",
    learn: ["Script and text work", "Devising original theatre", "Audition technique", "Optional LAMDA exams"],
    photo: "huddle",
  },
];
