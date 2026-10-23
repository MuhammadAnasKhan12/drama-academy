import type { ReactNode } from "react";
import { Sparkles } from "~/components/anim/Sparkles";
import { SplitHeading } from "~/components/anim/SplitHeading";

/** Dark stage-style banner at the top of inner pages. */
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="stage-texture relative overflow-hidden bg-stage pt-[calc(var(--spacing-nav)+4rem)] pb-20 md:pb-28">
      <Sparkles count={4} />
      <div className="container-site relative">
        <p className="eyebrow mb-4 text-spotlight">{eyebrow}</p>
        <SplitHeading as="h1" className="max-w-4xl text-h1 text-cream">
          {title}
        </SplitHeading>
        {intro && <p className="mt-6 max-w-2xl text-lead text-mist">{intro}</p>}
        {children}
      </div>
      {/* Stage-edge wave into the cream page */}
      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-8 w-full text-cream md:h-12">
        <path fill="currentColor" d="M0 60V30c120-20 240-30 360-20s240 30 360 30 240-20 360-30 240 0 360 20v30Z" />
      </svg>
    </section>
  );
}
