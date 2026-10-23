import { ArrowRight } from "lucide-react";
import { Parallax } from "~/components/anim/Parallax";
import { ButtonLink } from "~/components/ui/Button";
import { Picture } from "~/components/ui/Picture";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { photos } from "~/lib/images";

const collage = [
  // Mobile: simple 12-col flow. Desktop: explicit placement (cols 1–6 | 7–9 | 10–12, 8 rows).
  { p: photos.runningGame, alt: "Children laughing as they run in a warm-up game", cls: "col-span-12 row-span-4 md:col-span-6 md:col-start-1 md:row-span-8 md:row-start-1", speed: -0.2 },
  { p: photos.craftPlaydough, alt: "A girl holding up a green model she made", cls: "col-span-6 row-span-4 md:col-span-3 md:col-start-7 md:row-span-4 md:row-start-1", speed: 0.35 },
  { p: photos.warmupCircle, alt: "A group circle game led by a teacher", cls: "col-span-6 row-span-4 md:col-span-3 md:col-start-10 md:row-span-5 md:row-start-1", speed: -0.15 },
  { p: photos.musicGuitar, alt: "Children dancing while a teacher plays guitar", cls: "hidden md:block md:col-span-3 md:col-start-7 md:row-span-4 md:row-start-5", speed: 0.3 },
  { p: photos.outingGroup, alt: "Children on a camp outing in hi-vis vests", cls: "col-span-12 row-span-3 md:col-span-3 md:col-start-10 md:row-span-3 md:row-start-6", speed: -0.25 },
];

/** Parallax photo collage — a taste of the gallery. */
export function GalleryPeek() {
  return (
    <section aria-labelledby="gallery-title" className="on-light section-y relative overflow-hidden bg-cream">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Backstage pass" title={<span id="gallery-title">Moments from the wings</span>} />
          <ButtonLink to="/gallery" variant="ghost-dark" icon={<ArrowRight className="size-4" />}>
            See the full gallery
          </ButtonLink>
        </div>
        <div className="mt-10 grid auto-rows-[3.2rem] grid-cols-12 gap-3 sm:auto-rows-[4rem] md:auto-rows-[3.5rem] md:gap-4 lg:auto-rows-[4.25rem]">
          {collage.map(({ p, alt, cls, speed }, i) => (
            <Parallax key={i} speed={speed} className={cls}>
              <Picture
                picture={p}
                alt={alt}
                sizes="(min-width: 768px) 40vw, 60vw"
                className="block h-full"
                imgClassName="h-full w-full rounded-card object-cover shadow-card"
              />
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
