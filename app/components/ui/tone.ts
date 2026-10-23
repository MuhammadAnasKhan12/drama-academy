import type { Tone } from "~/data/types";

/** Tailwind classes per brand tone, so data files can just say tone: "teal". */
export const toneBg: Record<Tone, string> = {
  teal: "bg-teal",
  magenta: "bg-magenta",
  blue: "bg-blue",
  spotlight: "bg-spotlight",
};

/** Text colour that is readable ON the tone's background */
export const toneOn: Record<Tone, string> = {
  teal: "text-ink",
  magenta: "text-paper",
  blue: "text-paper",
  spotlight: "text-ink",
};

/** Tone used as text/accents on a light background (AA contrast) */
export const toneText: Record<Tone, string> = {
  teal: "text-teal-deep",
  magenta: "text-magenta-deep",
  blue: "text-blue-deep",
  spotlight: "text-ink",
};

export const toneRing: Record<Tone, string> = {
  teal: "ring-teal",
  magenta: "ring-magenta",
  blue: "ring-blue",
  spotlight: "ring-spotlight",
};
