import { ArrowRight, CalendarDays, Clock, MapPin, PoundSterling, Shirt, Sparkles as SparklesIcon, Users } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { ImageReveal } from "~/components/anim/ImageReveal";
import { Parallax } from "~/components/anim/Parallax";
import { Reveal } from "~/components/anim/Reveal";
import { Accordion } from "~/components/ui/Accordion";
import { Button, ButtonLink } from "~/components/ui/Button";
import { PageHero } from "~/components/ui/PageHero";
import { Picture } from "~/components/ui/Picture";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { classes } from "~/data/classes";
import { faqs } from "~/data/faqs";
import { termDates, termDatesYear } from "~/data/termDates";
import { buildCatalogue, dateRange, money } from "~/lib/booking/catalogue";
import { photos } from "~/lib/images";
import { organisationLd, seo } from "~/lib/seo";
import { site } from "~/lib/site";
import { useNow } from "~/lib/useNow";
import { useBookingStore } from "~/stores/booking";

export const meta = () =>
  seo({
    title: "Kids drama classes in Canterbury",
    description:
      "Wednesday Drama Club for ages 4–11, 4–5pm at Ash Village Hall near Canterbury. £10.50 a session, end-of-term performances. Book the term online.",
    path: "/classes",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Wednesday Drama Club",
        description: "Weekly after-school drama class for children aged 4–11 in Canterbury, Kent.",
        provider: { "@id": organisationLd["@id"] },
        offers: { "@type": "Offer", price: 10.5, priceCurrency: "GBP", category: "Per session" },
      },
    ],
  });

/** What an hour looks like. [PLACEHOLDER] adjust to match how sessions really run. */
const session = [
  { time: "4:00", title: "Warm-up games", text: "Energetic drama games to wake up bodies, voices and imaginations — and to let off some after-school steam." },
  { time: "4:15", title: "Skills", text: "Voice, movement and character work: projecting, using the space, and becoming someone else." },
  { time: "4:30", title: "Scene work", text: "In small groups the children build scenes from the term’s script or project, with lots of encouragement." },
  { time: "4:50", title: "Share & cheer", text: "We finish by sharing what we’ve made with each other — the first step towards performing to an audience." },
];

const learn = [
  "Confidence speaking in front of others",
  "Clear voice and expressive movement",
  "Creating characters and stories",
  "Listening and teamwork",
  "Script work and remembering lines",
  "Performing to a live audience",
];

const tones = ["border-t-teal", "border-t-magenta", "border-t-spotlight"];

export default function ClassesPage() {
  const cls = classes[0];
  const venue = site.venues[cls.venue];
  const now = useNow();
  const terms = useMemo(() => buildCatalogue(now).filter((i) => i.kind === "term"), [now]);
  const addItem = useBookingStore((s) => s.addItem);
  const navigate = useNavigate();
  const book = (id: string) => {
    addItem(id);
    navigate("/book");
  };
  const classFaqs = faqs.filter((f) => f.category === "Classes" || f.category === "Shows");
  const next = terms[0];

  return (
    <>
      <PageHero
        eyebrow="Weekly class · ages 4–11"
        title="Wednesday Drama Club"
        intro="An hour of games, stories and performance every Wednesday after school — building confidence, friendships and imagination one week at a time."
      >
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-bold text-mist">
          <li className="inline-flex items-center gap-2"><Clock className="size-4 text-teal" aria-hidden="true" /> Wednesdays, {cls.time}</li>
          <li className="inline-flex items-center gap-2"><MapPin className="size-4 text-teal" aria-hidden="true" /> {venue.name}</li>
          <li className="inline-flex items-center gap-2"><PoundSterling className="size-4 text-teal" aria-hidden="true" /> £{cls.pricePerSession.toFixed(2)} a session</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-4">
          {next ? (
            <Button size="lg" onClick={() => book(next.id)}>
              Book the {next.title.split("— ")[1]?.toLowerCase()} · {money(next.pricePence)}
            </Button>
          ) : (
            <ButtonLink to="/book" size="lg">Book now</ButtonLink>
          )}
        </div>
      </PageHero>

      {/* About the club */}
      <section className="on-light section-y bg-cream">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="About the club" title="Where every child gets to shine" intro={cls.blurb} />
            <Reveal stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {learn.map((l) => (
                <p key={l} className="flex items-start gap-2.5 rounded-xl bg-paper p-3.5 font-bold shadow-card ring-1 ring-line">
                  <SparklesIcon className="mt-0.5 size-4 shrink-0 text-magenta" aria-hidden="true" />
                  {l}
                </p>
              ))}
            </Reveal>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <Parallax speed={-0.3} className="absolute top-0 left-0 h-[70%] w-[78%]">
              <ImageReveal picture={photos.runningGame} alt="A smiling teacher and children running in a drama warm-up game" sizes="(min-width: 1024px) 24rem, 75vw" className="h-full rounded-blob shadow-pop" />
            </Parallax>
            <Parallax speed={0.4} className="absolute right-0 bottom-0 h-[46%] w-[62%]">
              <ImageReveal picture={photos.drumGame} alt="A teacher with bongo drums leading a rhythm game" sizes="(min-width: 1024px) 18rem, 60vw" from="right" className="h-full rounded-blob shadow-pop ring-8 ring-cream" />
            </Parallax>
          </div>
        </div>
      </section>

      {/* A typical session */}
      <section className="stage-texture section-y bg-stage">
        <div className="container-site">
          <SectionHeading tone="dark" eyebrow="4:00–5:00pm" title="What happens in a session" intro="Every week follows a familiar shape, so children feel settled — with plenty of surprises along the way." />
          <Reveal stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {session.map((s, i) => (
              <article key={s.title} className="rounded-card bg-stage-2 p-6 ring-1 ring-white/10">
                <p className="font-display text-h3 text-spotlight">{s.time}</p>
                <h3 className="mt-2 text-h4 text-cream">
                  <span className="text-white/30">0{i + 1} </span>
                  {s.title}
                </h3>
                <p className="mt-2 text-mist">{s.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Terms & prices */}
      <section className="on-light section-y bg-cream" aria-labelledby="terms-title">
        <div className="container-site">
          <SectionHeading
            eyebrow={`Terms ${termDatesYear}`}
            title={<span id="terms-title">Our exciting terms</span>}
            intro={`£${cls.pricePerSession.toFixed(2)} per session, paid for the rest of the term when you book — so you can join at any point and only pay for the weeks that are left. No classes during half-term.`}
          />
          <Reveal stagger className="mt-10 grid gap-6 lg:grid-cols-3">
            {termDates.map((t, i) => {
              const item = terms.find((x) => x.id.endsWith(`:${t.id}`));
              return (
                <article key={t.id} className={`flex flex-col rounded-card border-t-4 bg-paper p-6 shadow-card ring-1 ring-line ${tones[i % tones.length]}`}>
                  <h3 className="text-h3">{t.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm font-bold text-ink-soft">
                    <CalendarDays className="size-4" aria-hidden="true" /> {dateRange(t.start, t.end)}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">Half-term: {dateRange(t.halfTerm.start, t.halfTerm.end)}</p>
                  <p className="mt-4 flex-1 text-ink-soft">{t.focus}</p>
                  <div className="mt-6 border-t-2 border-dashed border-line pt-4">
                    {item ? (
                      <>
                        <p className="flex items-baseline justify-between gap-3">
                          <span className="font-bold">{item.subtitle}</span>
                          <span className="font-display text-h4">{money(item.pricePence)}</span>
                        </p>
                        <Button variant={i === 1 ? "magenta" : i === 2 ? "primary" : "teal"} className="mt-4 w-full" onClick={() => book(item.id)}>
                          Book {t.name.toLowerCase()}
                        </Button>
                      </>
                    ) : (
                      <p className="font-bold text-ink-soft">This term has finished.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Practical info */}
      <section className="on-light section-y bg-cream-2">
        <div className="container-site grid gap-6 lg:grid-cols-3">
          <Reveal className="rounded-card bg-paper p-6 shadow-card ring-1 ring-line">
            <MapPin className="size-7 text-teal-deep" aria-hidden="true" />
            <h2 className="mt-3 text-h4">Where</h2>
            <p className="mt-2 text-ink-soft">
              <strong className="text-ink">{venue.name}</strong>
              <br />
              {venue.town}, {venue.county}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.town}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-bold text-blue-deep hover:underline"
            >
              Open in Google Maps <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal className="rounded-card bg-paper p-6 shadow-card ring-1 ring-line">
            <Shirt className="size-7 text-magenta-deep" aria-hidden="true" />
            <h2 className="mt-3 text-h4">What to wear & bring</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
              <li>Comfy clothes they can move in</li>
              <li>Trainers or soft shoes</li>
              <li>Long hair tied back</li>
              <li>A named water bottle</li>
            </ul>
          </Reveal>
          <Reveal className="rounded-card bg-paper p-6 shadow-card ring-1 ring-line">
            <Users className="size-7 text-blue-deep" aria-hidden="true" />
            <h2 className="mt-3 text-h4">Drop-off & pick-up</h2>
            <p className="mt-2 text-ink-soft">
              Please bring your child to the hall door for 4:00pm, where a teacher will sign them in. At 5:00pm we only hand children
              over to a parent or a named adult.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Photo strip */}
      <section aria-label="Photos from class" className="on-light bg-cream-2 pb-4">
        <div className="container-site grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[photos.storyCircle, photos.huddle, photos.warmupCircle, photos.musicGuitar].map((p, i) => (
            <Reveal key={i} variant="pop">
              <Picture picture={p} alt="" sizes="(min-width: 640px) 25vw, 50vw" imgClassName="aspect-square w-full rounded-card object-cover shadow-card" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="on-light section-y bg-cream-2" aria-labelledby="class-faq-title">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Good to know" title={<span id="class-faq-title">Questions about classes</span>} />
          <Reveal>
            <Accordion items={classFaqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
