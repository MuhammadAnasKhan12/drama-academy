import { Star } from "lucide-react";
import { Counter } from "~/components/anim/Counter";
import { Reveal } from "~/components/anim/Reveal";
import { parentRating, stats } from "~/data/stats";

const accents = ["text-teal-deep", "text-magenta-deep", "text-blue-deep", "text-ink"];

/** Animated counters + parent rating. Sits just under the hero to build trust quickly. */
export function TrustStrip() {
  return (
    <section aria-label="Drama Kids in numbers" className="on-light relative bg-cream py-12 md:py-16">
      <div className="container-site">
        <Reveal stagger className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5 md:items-center">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center md:text-left">
              <p className={`font-display text-h2 leading-none ${accents[i]}`}>
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 font-bold text-ink-soft">{s.label}</p>
            </div>
          ))}
          <div className="col-span-2 rounded-card bg-paper p-5 text-center shadow-card ring-1 ring-line md:col-span-1">
            <div className="flex justify-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-spotlight text-spotlight-deep" />
              ))}
            </div>
            <p className="mt-2 font-display text-h3 leading-none">
              <Counter value={parentRating.score} decimals={1} />
              <span className="text-ink-soft">/5</span>
            </p>
            <p className="mt-1 text-sm font-bold text-ink-soft">
              {parentRating.count}+ {parentRating.source}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
