/**
 * Academy details used across the whole site.
 * ✏️  Replace every value marked [PLACEHOLDER] before launch (see README).
 */
export const site = {
  name: "Drama Kids Canterbury",
  shortName: "Drama Kids",
  tagline: "Confidence, creativity and a whole lot of fun — on stage and off.",
  url: "https://www.dramakidscanterbury.co.uk", // [PLACEHOLDER] final domain
  ages: { min: 4, max: 16 }, // [PLACEHOLDER] confirm age range
  foundedYear: 2016, // [PLACEHOLDER]

  venue: {
    name: "[PLACEHOLDER] Venue name", // e.g. "St Stephen's Community Hall"
    street: "[PLACEHOLDER] Street address",
    town: "Canterbury",
    county: "Kent",
    postcode: "CT1 0XX", // [PLACEHOLDER]
    // Google Maps embed — swap for the venue's own "Share → Embed a map" link
    mapEmbed: "https://www.google.com/maps?q=Canterbury,+Kent&output=embed",
    geo: { lat: 51.2802, lng: 1.0789 },
  },

  contact: {
    phone: "01227 000000", // [PLACEHOLDER]
    phoneHref: "tel:+441227000000",
    email: "hello@dramakidscanterbury.co.uk", // [PLACEHOLDER]
    whatsapp: "https://wa.me/447000000000", // [PLACEHOLDER] wa.me/44 + mobile without leading 0
    instagram: "https://www.instagram.com/", // [PLACEHOLDER]
    facebook: "https://www.facebook.com/", // [PLACEHOLDER]
  },

  /** Set to the booking platform URL when ready; null = use the enquiry form on /book */
  bookingUrl: null as string | null,
  /** Where forms are sent. Create a free form at formspree.io and paste its URL. null = demo mode */
  formEndpoint: null as string | null,

  safeguardingLead: {
    name: "[PLACEHOLDER] Name",
    email: "safeguarding@dramakidscanterbury.co.uk", // [PLACEHOLDER]
  },

  /** Only flip on if analytics are added — this also turns on the cookie banner */
  analytics: false,
} as const;

export const nav = [
  { label: "Classes", to: "/classes" },
  { label: "Holiday Camps", to: "/holiday-camps" },
  { label: "Shows", to: "/shows" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Parents' Hub", to: "/parents" },
] as const;
