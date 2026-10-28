import { ArrowRight, CalendarDays, Clock, MapPin, PoundSterling, Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Reveal } from "~/components/anim/Reveal";
import { Button, ButtonLink } from "~/components/ui/Button";
import { Picture } from "~/components/ui/Picture";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { classes } from "~/data/classes";
import { termDates } from "~/data/termDates";
import { buildCatalogue, money } from "~/lib/booking/catalogue";
import { photos } from "~/lib/images";
import { site } from "~/lib/site";
import { useNow } from "~/lib/useNow";
import { useBookingStore } from "~/stores/booking";

const termTones = ["border-t-teal", "border-t-magenta", "border-t-spotlight"];

/** The weekly Wednesday class plus what each term focuses on, with per-term booking. */
export function ClassesByAge() {
  const cls = classes[0];
  const now = useNow();
  const addItem = useBookingStore((s) => s.addItem);
  const navigate = useNavigate();
  const termItems = useMemo(() => buildCatalogue(now).filter((i) => i.kind === "term"), [now]);

  const book = (id: string) => {
    addItem(id);
    navigate("/book");
  };

  if (!cls) return null;
  const nextTerm = termItems[0];

  return (
    <section aria-labelledby="classes-title" className="on-light section-y relative bg-cream">
      <div className="container-site">
        <SectionHeading
          eyebrow="Weekly class"
          title={<span id="classes-title">Wednesday Drama Club</span>}
          intro="Our after-school club for ages 4–11 — an hour of games, stories and performance every Wednesday in term time."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <Reveal variant="pop">
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="overflow-hidden rounded-card bg-paper shadow-card ring-1 ring-line"
            >
              <Picture picture={photos[cls.photo]} alt="A teacher and children running in a drama warm-up game" sizes="(min-width: 1024px) 34rem, 92vw" imgClassName="aspect-[16/9] w-full object-cover" />
              <div className="p-6 sm:p-7">
                <p className="text-ink-soft">{cls.blurb}</p>
                <dl className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-2">
                  <div className="flex items-center gap-2"><Clock className="size-4 text-teal-deep" aria-hidden="true" /><dt className="sr-only">When</dt><dd>{cls.day}s, {cls.time}</dd></div>
                  <div className="flex items-center gap-2"><Users className="size-4 text-teal-deep" aria-hidden="true" /><dt className="sr-only">Ages</dt><dd>Ages {cls.ages}</dd></div>
                  <div className="flex items-center gap-2"><MapPin className="size-4 text-teal-deep" aria-hidden="true" /><dt className="sr-only">Where</dt><dd>{site.venues[cls.venue].name}</dd></div>
                  <div className="flex items-center gap-2"><PoundSterling className="size-4 text-teal-deep" aria-hidden="true" /><dt className="sr-only">Price</dt><dd>£{cls.pricePerSession.toFixed(2)} per session</dd></div>
                </dl>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {nextTerm ? (
                    <Button variant="teal" onClick={() => book(nextTerm.id)}>
                      Book {nextTerm.title.split("— ")[1]?.toLowerCase() ?? "this term"} · {money(nextTerm.pricePence)}
                    </Button>
                  ) : (
                    <ButtonLink to="/book" variant="teal">Book now</ButtonLink>
                  )}
                  <ButtonLink to="/classes" variant="ghost-dark" icon={<ArrowRight className="size-4" />}>
                    More about the club
                  </ButtonLink>
                </div>
              </div>
            </motion.article>
          </Reveal>

          <div>
            <h3 className="font-display text-h3">Our exciting terms</h3>
            <p className="mt-1 text-ink-soft">Pay per session for the rest of the term — join any time.</p>
            <Reveal stagger className="mt-5 space-y-4">
              {termDates.map((t, i) => {
                const item = termItems.find((x) => x.id.endsWith(`:${t.id}`));
                return (
                  <article key={t.id} className={`rounded-card border-t-4 bg-paper p-5 shadow-card ring-1 ring-line ${termTones[i % termTones.length]}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-display text-h4">{t.name}</h4>
                      {item ? (
                        <p className="text-sm font-bold text-ink-soft">
                          <CalendarDays className="mr-1 inline size-4 align-[-3px]" aria-hidden="true" />
                          {item.subtitle} · {money(item.pricePence)}
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-ink-soft">Term finished</p>
                      )}
                    </div>
                    <p className="mt-2 text-ink-soft">{t.focus}</p>
                    {item && (
                      <button type="button" onClick={() => book(item.id)} className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-bold text-magenta-deep hover:underline">
                        Book {t.name.toLowerCase()} <ArrowRight className="size-4" aria-hidden="true" />
                      </button>
                    )}
                  </article>
                );
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
