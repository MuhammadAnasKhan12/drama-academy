import { ArrowRight, Clock, PoundSterling, Users } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Reveal } from "~/components/anim/Reveal";
import { Button } from "~/components/ui/Button";
import { Picture } from "~/components/ui/Picture";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { toneBg, toneOn, toneText } from "~/components/ui/tone";
import { classes } from "~/data/classes";
import { photos } from "~/lib/images";
import { useBookingStore } from "~/stores/booking";

export function ClassesByAge() {
  const prefill = useBookingStore((s) => s.prefill);
  const navigate = useNavigate();

  const book = (id: string) => {
    prefill("trial", id);
    navigate("/book");
  };

  return (
    <section aria-labelledby="classes-title" className="on-light section-y relative bg-cream">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Weekly classes"
            title={<span id="classes-title">A class for every age and stage</span>}
            intro="Term-time classes in Canterbury, grouped by age so every child is challenged, supported and having a ball."
          />
          <Link to="/classes" className="group inline-flex shrink-0 items-center gap-2 font-bold text-magenta-deep hover:underline">
            Compare all classes <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Reveal stagger variant="pop" className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
          {classes.map((c) => (
            <div key={c.id}>
              <motion.article
                whileHover={{ y: -10, rotate: -0.6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="flex h-full flex-col overflow-hidden rounded-card bg-paper shadow-card ring-1 ring-line hover:shadow-lift"
              >
                <div className="relative">
                  <Picture picture={photos[c.photo]} alt="" sizes="(min-width: 768px) 30vw, 92vw" imgClassName="aspect-[16/10] w-full object-cover" />
                  <span className={`absolute -bottom-6 left-6 grid size-14 place-items-center rounded-full font-display text-lg shadow-pop-sm ring-4 ring-paper ${toneBg[c.tone]} ${toneOn[c.tone]}`}>
                    {c.ages}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-9">
                  <h3 className="text-h3">{c.name}</h3>
                  <p className={`font-bold ${toneText[c.tone]}`}>Ages {c.ages}</p>
                  <p className="mt-3 text-ink-soft">{c.blurb}</p>
                  <dl className="mt-5 grid gap-2 text-sm font-bold">
                    <div className="flex items-center gap-2"><Clock className="size-4 text-ink-soft" aria-hidden="true" /><dt className="sr-only">When</dt><dd>{c.day}s, {c.time}</dd></div>
                    <div className="flex items-center gap-2"><PoundSterling className="size-4 text-ink-soft" aria-hidden="true" /><dt className="sr-only">Price</dt><dd>£{c.pricePerTerm} per term</dd></div>
                    <div className="flex items-center gap-2"><Users className="size-4 text-ink-soft" aria-hidden="true" /><dt className="sr-only">Group size</dt><dd>Max {c.groupSize} children</dd></div>
                  </dl>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                    <Button variant={c.tone === "magenta" ? "magenta" : c.tone === "teal" ? "teal" : "primary"} onClick={() => book(c.id)}>
                      Book a free trial
                    </Button>
                    <Link to={`/classes#${c.id}`} className="font-bold underline-offset-4 hover:underline">
                      Details<span className="sr-only"> about {c.name}</span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
