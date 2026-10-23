import type { PhotoKey } from "~/lib/images";

/** Brand colour used to theme a card. */
export type Tone = "teal" | "magenta" | "blue" | "spotlight";

export type DramaClass = {
  id: string;
  name: string;
  ages: string;
  ageMin: number;
  ageMax: number;
  tone: Tone;
  day: string;
  time: string;
  pricePerTerm: number;
  groupSize: number;
  blurb: string;
  learn: string[];
  photo: PhotoKey;
};

export type Camp = {
  id: string;
  name: string;
  season: "Half-term" | "Easter" | "Summer" | "Christmas";
  theme: string;
  startDate: string; // ISO date, e.g. "2026-10-26"
  endDate: string;
  dailyTime: string;
  ages: string;
  price: number; // full week
  dayPrice?: number;
  earlyBird?: { price: number; until: string };
  siblingDiscount?: string;
  bring: string[];
  week: { day: string; plan: string }[];
  photo: PhotoKey;
  tone: Tone;
};

export type Show = {
  id: string;
  title: string;
  strapline: string;
  description: string;
  performances: { date: string; time: string }[]; // ISO date + 24h time "14:00"
  venue: string;
  priceFrom: number;
  ticketUrl: string | null;
  cast: string; // who's in it, e.g. "Juniors & Seniors"
  tone: Tone;
  icon: "snowflake" | "rabbit" | "music" | "crown" | "rocket" | "feather";
};

export type PastShow = {
  id: string;
  title: string;
  year: number;
  note: string;
  photos: PhotoKey[];
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  dbs: boolean;
  firstAid?: boolean;
  initials: string;
  tone: Tone;
};

export type Testimonial = {
  quote: string;
  name: string;
  detail: string; // e.g. "Mum of Ava, 7"
};

export type Faq = {
  q: string;
  a: string;
  category: "General" | "Classes" | "Camps" | "Shows" | "Safety";
};

export type Term = {
  name: string;
  start: string;
  end: string;
  halfTerm: { start: string; end: string };
};
