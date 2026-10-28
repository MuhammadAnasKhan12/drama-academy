import { CampsHighlight } from "~/components/home/CampsHighlight";
import { ClassesByAge } from "~/components/home/ClassesByAge";
import { FaqSection, homeFaqs } from "~/components/home/FaqSection";
import { FinalCta } from "~/components/home/FinalCta";
import { GalleryPeek } from "~/components/home/GalleryPeek";
import { Hero } from "~/components/home/Hero";
import { NextUpBanner } from "~/components/home/NextUpBanner";
import { Testimonials } from "~/components/home/Testimonials";
import { TrustStrip } from "~/components/home/TrustStrip";
import { UpcomingShows } from "~/components/home/UpcomingShows";
import { WhyParents } from "~/components/home/WhyParents";
import { YearStory } from "~/components/home/YearStory";
import { camps } from "~/data/camps";
import { shows } from "~/data/shows";
import { organisationLd, seo, venueLd } from "~/lib/seo";
import { site } from "~/lib/site";

const eventsLd = [
  ...shows.flatMap((s) =>
    s.performances.map((p) => ({
      "@context": "https://schema.org",
      "@type": "TheaterEvent",
      name: s.title,
      description: s.description,
      startDate: `${p.date}T${p.time}:00+00:00`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: venueLd("ashVillageHall"),
      organizer: { "@id": organisationLd["@id"] },
      offers: { "@type": "Offer", price: s.priceFrom, priceCurrency: "GBP", url: s.ticketUrl ?? `${site.url}/shows` },
    })),
  ),
  ...camps.map((c) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${c.name} — drama holiday club Canterbury`,
    description: c.theme,
    startDate: c.startDate,
    endDate: c.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: venueLd(c.venue),
    organizer: { "@id": organisationLd["@id"] },
    typicalAgeRange: c.ages.replace("–", "-"),
    offers: { "@type": "Offer", price: c.price, priceCurrency: "GBP", url: `${site.url}/book` },
  })),
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const meta = () =>
  seo({
    title: "Drama Kids Canterbury | Kids Drama Classes & Holiday Clubs in Kent",
    description:
      "Fun, confidence-building kids drama in Canterbury for ages 4–11: a weekly Wednesday club (£10.50 a session) and drama holiday clubs from £25 a day. Book online.",
    path: "/",
    jsonLd: [organisationLd, faqLd, ...eventsLd],
  });

export default function Home() {
  return (
    <>
      <Hero />
      <NextUpBanner />
      <TrustStrip />
      <ClassesByAge />
      <CampsHighlight />
      <YearStory />
      <UpcomingShows />
      <WhyParents />
      <Testimonials />
      <GalleryPeek />
      <FaqSection />
      <FinalCta />
    </>
  );
}
