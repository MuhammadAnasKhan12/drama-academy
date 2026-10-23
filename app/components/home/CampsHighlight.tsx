import { ArrowRight, BadgePercent, CalendarDays, Clock, Sparkle, Users } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { ImageReveal } from "~/components/anim/ImageReveal";
import { Parallax } from "~/components/anim/Parallax";
import { Reveal } from "~/components/anim/Reveal";
import { Sparkles } from "~/components/anim/Sparkles";
import { SplitHeading } from "~/components/anim/SplitHeading";
import { Button, ButtonLink } from "~/components/ui/Button";
import { photos } from "~/lib/images";
import { gbp, ukDate } from "~/lib/seo";
import { upcomingCamps } from "~/lib/upcoming";
import { useNow } from "~/lib/useNow";
import { useBookingStore } from "~/stores/booking";

const range = (a: string, b: string) =>
  `${ukDate(a, { day: "numeric", month: "short" })} – ${ukDate(b, { day: "numeric", month: "short", year: "numeric" })}`;

/** Energetic, colourful camps section featuring the next camp and the ones after it. */
export function CampsHighlight() {
  const now = useNow();
  const [featured, ...rest] = useMemo(() => upcomingCamps(now), [now]);
  const prefill = useBookingStore((s) => s.prefill);
  const navigate = useNavigate();
  if (!featured) return null;

  const earlyBird = featured.earlyBird && new Date(featured.earlyBird.until) >= now ? featured.earlyBird : null;

  return (
    <section aria-labelledby="camps-title" className="section-y relative overflow-hidden bg-teal">
      {/* Playful confetti blobs */}
      <div aria-hidden="true" className="absolute -top-24 -left-24 size-72 rounded-full bg-spotlight/60 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 size-80 rounded-full bg-magenta/40 blur-3xl" />
      <Sparkles count={4} />

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3 text-ink">Holiday camps</p>
          <SplitHeading className="text-h1 text-ink">
            <span id="camps-title">School’s out. Showtime’s in!</span>
          </SplitHeading>
          <p className="mt-5 max-w-xl text-lead text-ink/80">
            Action-packed drama weeks every half-term, Easter and summer. New friends, games, crafts and songs — all ending in a
            mini showcase for families on Friday afternoon.
          </p>

          <Reveal variant="pop" className="mt-8">
            <article className="relative rounded-card bg-paper p-6 shadow-pop sm:p-7">
              <span className="absolute -top-4 right-6 rotate-3 rounded-full bg-magenta px-4 py-1.5 font-display text-paper shadow-pop-sm">
                Next up!
              </span>
              <p className="eyebrow text-magenta-deep">{featured.season} camp · Ages {featured.ages}</p>
              <h3 className="mt-1 text-h3">{featured.name}</h3>
              <p className="mt-1 text-ink-soft">{featured.theme}</p>
              <ul className="mt-5 grid gap-2 font-bold sm:grid-cols-2">
                <li className="flex items-center gap-2"><CalendarDays className="size-4 text-teal-deep" aria-hidden="true" />{range(featured.startDate, featured.endDate)}</li>
                <li className="flex items-center gap-2"><Clock className="size-4 text-teal-deep" aria-hidden="true" />{featured.dailyTime} daily</li>
                <li className="flex items-center gap-2"><Users className="size-4 text-teal-deep" aria-hidden="true" />Ages {featured.ages}</li>
                <li className="flex items-center gap-2">
                  <Sparkle className="size-4 text-teal-deep" aria-hidden="true" />
                  {gbp(featured.price)} week{featured.dayPrice ? ` · ${gbp(featured.dayPrice)} day` : ""}
                </li>
              </ul>
              {(earlyBird || featured.siblingDiscount) && (
                <p className="mt-5 flex items-start gap-2 rounded-chip bg-spotlight/25 p-3 text-sm font-bold">
                  <BadgePercent className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    {earlyBird && <>Early bird {gbp(earlyBird.price)} until {ukDate(earlyBird.until, { day: "numeric", month: "long" })}. </>}
                    {featured.siblingDiscount}
                  </span>
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    prefill("camp", featured.id);
                    navigate("/book");
                  }}
                >
                  Book this camp
                </Button>
                <ButtonLink to="/holiday-camps" variant="ghost-dark" icon={<ArrowRight className="size-4" />}>
                  What’s the week like?
                </ButtonLink>
              </div>
            </article>
          </Reveal>

          {rest.length > 0 && (
            <Reveal stagger className="mt-8 flex flex-wrap gap-3">
              {rest.slice(0, 3).map((c) => (
                <span key={c.id} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream">
                  {c.season}: {ukDate(c.startDate, { day: "numeric", month: "short" })} · {c.name}
                </span>
              ))}
            </Reveal>
          )}
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
          <Parallax speed={-0.4} className="absolute top-0 left-0 h-[72%] w-[66%]">
            <ImageReveal picture={photos[featured.photo]} alt="Children enjoying a Drama Kids holiday camp activity" sizes="(min-width: 1024px) 26rem, 62vw" className="h-full rounded-blob shadow-pop" />
          </Parallax>
          <Parallax speed={0.5} className="absolute right-0 bottom-0 h-[46%] w-[58%]">
            <ImageReveal picture={photos.outingGroup} alt="A group of children in hi-vis vests on a camp outing with their leader" sizes="(min-width: 1024px) 22rem, 54vw" from="right" className="h-full rounded-blob shadow-pop ring-8 ring-teal" />
          </Parallax>
          <span aria-hidden="true" className="absolute top-[64%] left-[6%] -rotate-6 rounded-full bg-spotlight px-4 py-1.5 font-display text-ink shadow-pop">
            Friday showcase!
          </span>
        </div>
      </div>
    </section>
  );
}
