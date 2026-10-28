import { Crown, Feather, MapPin, Music, Rabbit, Rocket, RotateCcw, Snowflake, Ticket } from "lucide-react";
import { useState } from "react";
import type { Show } from "~/data/types";
import { gbp, ukDate } from "~/lib/seo";
import { toneBg, toneOn } from "./tone";

const icons = { snowflake: Snowflake, rabbit: Rabbit, music: Music, crown: Crown, rocket: Rocket, feather: Feather };

const time12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
};

/**
 * Theatre ticket with a perforated edge. Hover (desktop) or tap the button to flip it in 3D
 * and see performance times, venue and the ticket link. Both faces stay accessible.
 */
export function TicketCard({ show }: { show: Show }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = icons[show.icon];
  const first = show.performances[0].date;
  const last = show.performances[show.performances.length - 1].date;
  const dates =
    first === last
      ? ukDate(first, { weekday: "short", day: "numeric", month: "long" })
      : `${ukDate(first, { day: "numeric", month: "short" })} – ${ukDate(last, { day: "numeric", month: "short", year: "numeric" })}`;

  const face = "col-start-1 row-start-1 flex flex-col overflow-hidden rounded-card [backface-visibility:hidden] [--perf-y:calc(100%-4.75rem)]";

  return (
    <div
      className="h-full [perspective:1400px]"
      // Desktop: flip on hover. Touch: the Details button flips it.
      onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
    >
      <div
        className={`grid h-full transition-transform duration-700 ease-[var(--ease-out-soft)] [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front — poster */}
        <article aria-hidden={flipped} inert={flipped} className={`${face} perforated ${toneBg[show.tone]} ${toneOn[show.tone]} shadow-lift`}>
          <div className="relative flex-1 p-7">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgb(255_255_255_/_0.35),transparent_45%)]" />
            <p className="eyebrow relative opacity-90">{show.cast} present</p>
            <Icon aria-hidden="true" className="relative my-5 size-12 stroke-[1.5]" />
            <h3 className="relative text-h3">{show.title}</h3>
            <p className="relative mt-2 font-bold opacity-90">{show.strapline}</p>
          </div>
          <div className="relative flex h-[4.75rem] items-center justify-between gap-4 border-t-[3px] border-dashed border-current/40 bg-black/10 px-7">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase opacity-80">Admit one</p>
              <p className="font-display">{dates}</p>
            </div>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-paper/90 px-4 font-bold text-ink transition hover:bg-paper"
              aria-label={`Show details for ${show.title}`}
            >
              <Ticket className="size-4" aria-hidden="true" /> Details
            </button>
          </div>
        </article>

        {/* Back — details */}
        <article
          aria-hidden={!flipped}
          inert={!flipped}
          className={`${face} perforated bg-paper text-ink shadow-lift ring-1 ring-line [transform:rotateY(180deg)]`}
        >
          <div className="flex-1 p-7">
            <h3 className="text-h4">{show.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{show.description}</p>
            <ul className="mt-4 space-y-1 text-sm font-bold">
              {show.performances.map((p) => (
                <li key={p.date + p.time}>
                  {ukDate(p.date, { weekday: "short", day: "numeric", month: "short" })} · {time12(p.time)}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-start gap-1.5 text-sm text-ink-soft">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {show.venue}
            </p>
          </div>
          <div className="flex min-h-[4.75rem] items-center justify-between gap-3 border-t-[3px] border-dashed border-line px-7 py-3">
            {show.ticketUrl ? (
              <a href={show.ticketUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-spotlight px-5 font-display text-ink shadow-pop-sm">
                Tickets from {gbp(show.priceFrom)}
              </a>
            ) : (
              <p className="font-bold text-ink-soft">
                {show.priceFrom > 0 ? `Tickets on sale soon · from ${gbp(show.priceFrom)}` : "Family details to follow"}
              </p>
            )}
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-cream-2 transition hover:bg-line"
              aria-label={`Back to the ${show.title} poster`}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
