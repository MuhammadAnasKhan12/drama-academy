import type { MetaDescriptor } from "react-router";
import { site } from "./site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd?: Record<string, unknown>[];
};

/** Builds the <title>, description, canonical, Open Graph and JSON-LD tags for a page. */
export function seo({ title, description, path, image = "/og-image.jpg", jsonLd = [] }: SeoInput): MetaDescriptor[] {
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;
  const url = new URL(path, site.url).toString();
  const img = new URL(image, site.url).toString();
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: site.name },
    { property: "og:locale", content: "en_GB" },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: img },
    { name: "twitter:card", content: "summary_large_image" },
    ...jsonLd.map((data) => ({ "script:ld+json": data })),
  ];
}

const address = {
  "@type": "PostalAddress",
  streetAddress: site.venue.street,
  addressLocality: site.venue.town,
  addressRegion: site.venue.county,
  postalCode: site.venue.postcode,
  addressCountry: "GB",
};

export const organisationLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": `${site.url}/#organisation`,
  name: site.name,
  description:
    "Kids drama classes in Canterbury, Kent — weekly classes, stage shows and holiday camps for ages 4–16.",
  url: site.url,
  logo: `${site.url}/logo.png`,
  image: `${site.url}/og-image.jpg`,
  telephone: site.contact.phone,
  email: site.contact.email,
  address,
  geo: { "@type": "GeoCoordinates", latitude: site.venue.geo.lat, longitude: site.venue.geo.lng },
  areaServed: ["Canterbury", "Whitstable", "Herne Bay", "Faversham", "Kent"],
  sameAs: [site.contact.instagram, site.contact.facebook],
};

export const venueLd = { "@type": "Place", name: site.venue.name, address };

export const ukDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("en-GB", { ...opts, timeZone: "Europe/London" });

export const gbp = (n: number) => `£${n % 1 === 0 ? n : n.toFixed(2)}`;
