/**
 * Academy details used across the whole site.
 * ✏️  Replace every value marked [PLACEHOLDER] before launch (see README).
 */
export const site = {
  name: "Drama Kids Canterbury",
  shortName: "Drama Kids",
  tagline: "Confidence, creativity and a whole lot of fun — on stage and off.",
  url: "https://www.dramakidscanterbury.co.uk", // [PLACEHOLDER] final domain
  ages: { min: 4, max: 11 }, // from the client: weekly class is ages 4–11
  foundedYear: 2016, // [PLACEHOLDER]

  /** Every venue we use. Classes and clubs refer to these by key. */
  venues: {
    ashVillageHall: {
      name: "Ash Village Hall",
      street: "[PLACEHOLDER] Street address", // confirm with the client
      town: "Ash, Canterbury",
      county: "Kent",
      postcode: "[PLACEHOLDER]",
      mapEmbed: "https://www.google.com/maps?q=Ash+Village+Hall,+Ash,+Canterbury&output=embed",
      geo: { lat: 51.2789, lng: 1.2766 },
    },
    canterburyAcademy: {
      name: "Canterbury Academy",
      street: "Knight Avenue",
      town: "Canterbury",
      county: "Kent",
      postcode: "CT2 8QA",
      mapEmbed: "https://www.google.com/maps?q=Canterbury+Academy,+Knight+Avenue,+Canterbury+CT2+8QA&output=embed",
      geo: { lat: 51.2849, lng: 1.0577 },
    },
  },

  contact: {
    phone: "07786 834581",
    phoneHref: "tel:+447786834581",
    email: "canterbury@dramakids.co.uk",
    whatsapp: "https://wa.me/447786834581", // [PLACEHOLDER] confirm this number is on WhatsApp
    instagram: "https://www.instagram.com/", // [PLACEHOLDER]
    facebook: "https://www.facebook.com/search/top?q=Drama%20kids%20Canterbury", // [PLACEHOLDER] swap for the page URL
  },

  /**
   * Booking & payments backend. null = demo mode: the booking flow works end to end
   * but no payment is taken and nothing is saved (see app/lib/booking-api.ts).
   */
  bookingApiUrl: null as string | null,

  safeguardingLead: {
    name: "[PLACEHOLDER] Name",
    email: "canterbury@dramakids.co.uk", // [PLACEHOLDER] confirm safeguarding contact
  },

  /** Only flip on if analytics are added — this also turns on the cookie banner */
  analytics: false,
} as const;

export const nav = [
  { label: "Classes", to: "/classes" },
  { label: "Holiday Clubs", to: "/holiday-camps" },
  { label: "Shows", to: "/shows" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Parents' Hub", to: "/parents" },
] as const;

export type Venue = (typeof site.venues)[keyof typeof site.venues];
/** Main venue (weekly class) — used for the organisation's address in search results */
export const mainVenue = site.venues.ashVillageHall;
