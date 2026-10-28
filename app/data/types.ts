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
  /** Weekday number for date maths: 0 = Sunday … 3 = Wednesday */
  weekday: number;
  venue: VenueKey;
  /** Price for one session; a term is charged per remaining session */
  pricePerSession: number;
  groupSize: number;
  /** Places available per term (used by the booking system) */
  capacity: number;
  blurb: string;
  learn: string[];
  photo: PhotoKey;
};

export type Camp = {
  id: string;
  name: string;
  season: "Half-term" | "Easter" | "Summer" | "Christmas";
  /** Course format from the flyer, e.g. "3-Day Intensive Workshop" */
  format: string;
  theme: string;
  startDate: string; // ISO date, e.g. "2026-10-26"
  endDate: string;
  days: number;
  dailyTime: string;
  ages: string;
  ageMin: number;
  ageMax: number;
  venue: VenueKey;
  price: number; // whole course, per child
  dayPrice?: number;
  /** Places available per child-seat (used by the booking system) */
  capacity: number;
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

export type VenueKey = "ashVillageHall" | "canterburyAcademy";

export type Workshop = {
  id: string;
  name: string;
  theme: string;
  date: string;
  time: string;
  ages: string;
  ageMin: number;
  ageMax: number;
  venue: VenueKey;
  price: number;
  capacity: number;
  tone: Tone;
};

export type Term = {
  id: string;
  name: string;
  /** What the term's classes focus on (from the 2026–27 flyer) */
  focus: string;
  start: string;
  end: string;
  halfTerm: { start: string; end: string };
};
