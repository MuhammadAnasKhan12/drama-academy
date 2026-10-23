import { Quote, Star } from "lucide-react";
import { Marquee } from "~/components/anim/Marquee";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { testimonials } from "~/data/testimonials";

const tilts = ["rotate-[-1.5deg]", "rotate-[1deg]", "rotate-[-0.5deg]", "rotate-[1.5deg]"];
const accents = ["bg-teal", "bg-magenta", "bg-spotlight", "bg-blue"];

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="stage-texture section-y relative overflow-hidden bg-stage">
      <div className="container-site">
        <SectionHeading
          tone="dark"
          align="center"
          eyebrow="Rave reviews"
          title={<span id="testimonials-title">Standing ovations from parents</span>}
        />
      </div>
      <Marquee label="Parent testimonials — drag to scroll" duration={55} className="mt-10 gap-6 py-4 [--marquee-gap:1.5rem]">
        {testimonials.map((t, i) => (
          <figure
            key={t.name + t.detail}
            className={`relative flex w-[18rem] shrink-0 flex-col rounded-card bg-cream p-6 text-ink shadow-stage sm:w-[21rem] ${tilts[i % tilts.length]}`}
          >
            <span className={`absolute -top-4 left-7 grid size-10 place-items-center rounded-full ${accents[i % accents.length]} shadow-pop-sm`}>
              <Quote className="size-5" aria-hidden="true" />
            </span>
            <div className="mt-2 flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="size-4 fill-spotlight text-spotlight-deep" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="mt-3 flex-1 leading-relaxed">“{t.quote}”</blockquote>
            <figcaption className="mt-5 font-bold">
              {t.name} <span className="font-normal text-ink-soft">· {t.detail}</span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
