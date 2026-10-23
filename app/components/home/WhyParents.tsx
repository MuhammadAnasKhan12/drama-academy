import { BadgeCheck, Drama, Heart, Palette, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "~/components/anim/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";

const reasons = [
  { Icon: Heart, title: "Confidence that sticks", text: "Speaking up, standing tall and believing in themselves — in class, in the playground and beyond.", tone: "bg-magenta text-paper" },
  { Icon: Users, title: "Friendships for life", text: "Teamwork is at the heart of everything we do. Children leave with a gang of creative friends.", tone: "bg-teal text-ink" },
  { Icon: Palette, title: "Creativity unleashed", text: "Imagination is a muscle. We give it a proper workout with stories, characters and play.", tone: "bg-spotlight text-ink" },
  { Icon: ShieldCheck, title: "DBS-checked teachers", text: "Every teacher holds an enhanced DBS check and annual safeguarding training. Most are first-aid trained.", tone: "bg-blue text-paper" },
  { Icon: BadgeCheck, title: "Small groups", text: "Never more than 16 children per class (12 for Mini Stars), so everyone is seen, heard and supported.", tone: "bg-magenta text-paper" },
  { Icon: Drama, title: "Real stage experience", text: "Proper productions in a real theatre, with costumes, lights and an audience cheering them on.", tone: "bg-teal text-ink" },
];

export function WhyParents() {
  return (
    <section aria-labelledby="why-title" className="on-light section-y relative bg-cream">
      <div className="container-site">
        <SectionHeading
          align="center"
          eyebrow="For grown-ups"
          title={<span id="why-title">Why Canterbury parents choose us</span>}
          intro="Drama isn’t just about performing. It builds skills your child will use for the rest of their life."
        />
        <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ Icon, title, text, tone }) => (
            <article key={title} className="rounded-card bg-paper p-6 shadow-card ring-1 ring-line transition-transform duration-300 hover:-translate-y-1">
              <span className={`grid size-12 -rotate-6 place-items-center rounded-2xl shadow-pop-sm ${tone}`}>
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-h4">{title}</h3>
              <p className="mt-2 text-ink-soft">{text}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
