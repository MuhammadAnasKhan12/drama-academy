import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import { Reveal } from "~/components/anim/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { TicketCard } from "~/components/ui/TicketCard";
import { upcomingShows } from "~/lib/upcoming";
import { useNow } from "~/lib/useNow";

export function UpcomingShows() {
  const now = useNow();
  const list = useMemo(() => upcomingShows(now).slice(0, 3), [now]);
  if (!list.length) return null;

  return (
    <section aria-labelledby="shows-title" className="on-light section-y relative bg-cream-2">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="End-of-term performances"
            title={<span id="shows-title">Upcoming shows</span>}
            intro="The autumn and summer terms each end with a live performance, with a part for every child. Hover or tap a ticket for details."
          />
          <Link to="/shows" className="group inline-flex shrink-0 items-center gap-2 font-bold text-magenta-deep hover:underline">
            All shows & past productions <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <Reveal stagger variant="pop" className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {list.map((s) => (
            <TicketCard key={s.id} show={s} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
