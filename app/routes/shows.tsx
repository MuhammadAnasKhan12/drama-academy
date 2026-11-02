import { ArrowRight, Drama, Heart, Mic, Users } from "lucide-react";
import { useMemo } from "react";
import { Countdown } from "~/components/anim/Countdown";
import { ImageReveal } from "~/components/anim/ImageReveal";
import { Reveal } from "~/components/anim/Reveal";
import { Spotlight } from "~/components/anim/Spotlight";
import { ButtonLink } from "~/components/ui/Button";
import { PageHero } from "~/components/ui/PageHero";
import { Picture } from "~/components/ui/Picture";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { TicketCard } from "~/components/ui/TicketCard";
import { pastShows, shows } from "~/data/shows";
import { photos } from "~/lib/images";
import { organisationLd, seo, ukDate, venueLd } from "~/lib/seo";
import { performanceDate, upcomingShows } from "~/lib/upcoming";
import { useNow } from "~/lib/useNow";

export const meta = () =>
  seo({
    title: "Shows & performances",
    description:
      "End-of-term children’s drama performances in Canterbury by the Drama Kids Wednesday club — an original play in autumn and a spectacular summer production.",
    path: "/shows",
    jsonLd: shows.flatMap((s) =>
      s.performances.map((p) => ({
        "@context": "https://schema.org",
        "@type": "TheaterEvent",
        name: s.title,
        description: s.description,
        startDate: `${p.date}T${p.time}:00+00:00`,
        location: venueLd("ashVillageHall"),
        organizer: { "@id": organisationLd["@id"] },
      })),
    ),
  });

const journey = [
  { Icon: Users, title: "Everyone’s in the cast", text: "Every child who wants a part gets one, with lines matched to their age and confidence." },
  { Icon: Mic, title: "Rehearsed in class", text: "Scenes, songs and movement are built up week by week in the Wednesday sessions — no extra rehearsals to fit in." },
  { Icon: Drama, title: "Costumes & stagecraft", text: "Simple costumes and props bring the story to life, and the children learn how a real show fits together." },
  { Icon: Heart, title: "Families in the audience", text: "Parents, grandparents and friends are invited to the live performance at the end of term." },
];

export default function ShowsPage() {
  const now = useNow();
  const upcoming = useMemo(() => upcomingShows(now), [now]);
  const next = upcoming[0];
  const nextDate = next ? performanceDate(next.performances.find((p) => performanceDate(p) > now) ?? next.performances[0]) : null;

  return (
    <>
      <PageHero
        eyebrow="On stage"
        title="Shows & performances"
        intro="Twice a year the Wednesday Drama Club takes to the stage: an original play at the end of the autumn term and a spectacular summer production."
      />

      {/* Next performance spotlight */}
      {next && nextDate && (
        <section aria-labelledby="next-show-title" className="on-light bg-cream pt-14 md:pt-20">
          <div className="container-site">
            <Reveal variant="pop">
              <div className="relative isolate overflow-hidden rounded-blob bg-stage p-7 text-cream shadow-stage sm:p-10">
                <Spotlight />
                <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
                  <div>
                    <p className="eyebrow text-spotlight">Next performance</p>
                    <h2 id="next-show-title" className="mt-2 text-h2">{next.title}</h2>
                    <p className="mt-2 text-lead text-mist">{next.strapline}</p>
                    <p className="mt-4 font-bold text-mist">
                      {ukDate(nextDate.toISOString(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {next.venue}
                    </p>
                  </div>
                  <Countdown target={nextDate} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section aria-labelledby="upcoming-title" className="on-light section-y bg-cream">
        <div className="container-site">
          <SectionHeading
            eyebrow="This year"
            title={<span id="upcoming-title">Upcoming performances</span>}
            intro="Hover over or tap a ticket for the details. Dates and venues are confirmed with families nearer the time."
          />
          {upcoming.length ? (
            <Reveal stagger variant="pop" className="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl">
              {upcoming.map((s) => (
                <TicketCard key={s.id} show={s} />
              ))}
            </Reveal>
          ) : (
            <p className="mt-8 text-ink-soft">New performance dates will be announced soon.</p>
          )}
        </div>
      </section>

      {/* How a show comes together */}
      <section className="stage-texture section-y bg-stage">
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <ImageReveal picture={photos.huddle} alt="Children huddled together with their teacher before a scene" sizes="(min-width: 1024px) 28rem, 90vw" className="h-full rounded-blob shadow-stage" />
          </div>
          <div>
            <SectionHeading tone="dark" eyebrow="Behind the curtain" title="How a show comes together" />
            <Reveal stagger className="mt-8 grid gap-5 sm:grid-cols-2">
              {journey.map(({ Icon, title, text }) => (
                <article key={title}>
                  <span className="grid size-11 place-items-center rounded-xl bg-spotlight text-ink">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-h4 text-cream">{title}</h3>
                  <p className="mt-1 text-mist">{text}</p>
                </article>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Past productions */}
      <section aria-labelledby="past-title" className="on-light section-y bg-cream-2">
        <div className="container-site">
          <SectionHeading eyebrow="From the archive" title={<span id="past-title">Past productions</span>} />
          <Reveal stagger className="mt-10 grid gap-6 md:grid-cols-2">
            {pastShows.map((s) => (
              <article key={s.id} className="overflow-hidden rounded-card bg-paper shadow-card ring-1 ring-line">
                <div className="grid grid-cols-2 gap-1">
                  {s.photos.slice(0, 2).map((p) => (
                    <Picture key={p} picture={photos[p]} alt="" sizes="(min-width: 768px) 22vw, 45vw" imgClassName="aspect-[4/3] w-full object-cover" />
                  ))}
                </div>
                <div className="p-5">
                  <p className="text-sm font-bold text-magenta-deep">{s.note} · {s.year}</p>
                  <h3 className="mt-1 text-h4">{s.title}</h3>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="on-light bg-cream-2 pb-20">
        <div className="container-site">
          <Reveal className="flex flex-col items-start justify-between gap-6 rounded-card bg-teal p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-h3 text-ink">Want your child in the next show?</h2>
              <p className="mt-1 text-ink/80">Join the Wednesday Drama Club — performers are cast from the club each term.</p>
            </div>
            <ButtonLink to="/classes" variant="secondary" icon={<ArrowRight className="size-4" />}>
              About the club
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
