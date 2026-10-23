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
      location: venueLd,
      organizer: { "@id": organisationLd["@id"] },
      offers: { "@type": "Offer", price: s.priceFrom, priceCurrency: "GBP", url: s.ticketUrl ?? `${site.url}/shows` },
    })),
  ),
  ...camps.map((c) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${c.name} — drama holiday camp Canterbury`,
    description: c.theme,
    startDate: c.startDate,
    endDate: c.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: venueLd,
    organizer: { "@id": organisationLd["@id"] },
    typicalAgeRange: c.ages.replace("–", "-"),
    offers: { "@type": "Offer", price: c.price, priceCurrency: "GBP", url: `${site.url}/holiday-camps` },
  })),
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const meta = () =>
  seo({
    title: "Drama Kids Canterbury | Kids Drama Classes, Shows & Holiday Camps in Kent",
    description:
      "Fun, confidence-building kids drama classes in Canterbury for ages 4–16. Weekly classes, real stage shows and drama holiday camps. Book a free trial today.",
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
