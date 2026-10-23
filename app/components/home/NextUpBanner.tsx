import { ArrowRight, CalendarDays } from "lucide-react";
import { useMemo } from "react";
import { Countdown } from "~/components/anim/Countdown";
import { Reveal } from "~/components/anim/Reveal";
import { ButtonLink } from "~/components/ui/Button";
import { ukDate } from "~/lib/seo";
import { nextEvent } from "~/lib/upcoming";
import { useNow } from "~/lib/useNow";

const TOP = 22;
const SIDE = 5;

/** Chasing bulbs: each bulb's animation is delayed by its position around the frame. */
function Bulbs({ count, offset, className }: { count: number; offset: number; className: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="size-2.5 rounded-full bg-spotlight shadow-[0_0_10px_2px_rgb(255_200_61_/_0.7)] motion-safe:animate-[bulb_1.4s_linear_infinite] max-sm:[&:nth-child(even)]:hidden"
          style={{ animationDelay: `${-((offset + i) % 7) * 0.2}s` }}
        />
      ))}
    </div>
  );
}

/** Theatre-marquee banner for the very next camp or show, with a live countdown. */
export function NextUpBanner() {
  const now = useNow();
  const next = useMemo(() => nextEvent(now), [now]);
  if (!next) return null;

  return (
    <section aria-labelledby="next-up-title" className="relative bg-stage pb-14 md:pb-20">
      <div className="container-site">
        <Reveal variant="pop">
          <div className="relative rounded-blob bg-[linear-gradient(135deg,var(--color-velvet-dark),var(--color-velvet))] p-6 shadow-stage sm:p-8">
            {/* Bulb frame */}
            <Bulbs count={TOP} offset={0} className="absolute inset-x-6 top-2.5 flex justify-between" />
            <Bulbs count={SIDE} offset={TOP} className="absolute inset-y-8 right-2.5 flex flex-col justify-between" />
            <Bulbs count={TOP} offset={TOP + SIDE} className="absolute inset-x-6 bottom-2.5 flex flex-row-reverse justify-between" />
            <Bulbs count={SIDE} offset={TOP * 2 + SIDE} className="absolute inset-y-8 left-2.5 flex flex-col-reverse justify-between" />

            <div className="relative flex flex-col gap-6 rounded-[1.5rem] bg-stage/70 p-5 ring-1 ring-spotlight/30 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow text-spotlight">{next.kind === "camp" ? "Next holiday camp" : "Next show"} · Now booking</p>
                <h2 id="next-up-title" className="mt-2 text-h2 text-cream">{next.title}</h2>
                <p className="mt-2 inline-flex items-center gap-2 font-bold text-mist">
                  <CalendarDays className="size-4 text-teal" aria-hidden="true" />
                  {ukDate(next.date.toISOString(), { weekday: "short", day: "numeric", month: "long" })} · {next.detail}
                </p>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-end xl:flex-row xl:items-center">
                <Countdown target={next.date} />
                <ButtonLink to={next.to} icon={<ArrowRight className="size-4" />}>
                  {next.kind === "camp" ? "Book camp" : "Get tickets"}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <style>{`@keyframes bulb{0%,100%{opacity:.35;transform:scale(.8)}14%{opacity:1;transform:scale(1.15)}40%{opacity:.35;transform:scale(.8)}}`}</style>
    </section>
  );
}
