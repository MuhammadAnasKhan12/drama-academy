import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Reveal } from "~/components/anim/Reveal";
import { ButtonLink } from "~/components/ui/Button";
import { PageHero } from "~/components/ui/PageHero";
import { Picture } from "~/components/ui/Picture";
import { gallery } from "~/data/gallery";
import { Flip, gsap, prefersReducedMotion } from "~/lib/gsap";
import { photos } from "~/lib/images";
import { seo } from "~/lib/seo";
import { useGalleryStore, type GalleryFilter } from "~/stores/gallery";
import { useUiStore } from "~/stores/ui";

export const meta = () =>
  seo({
    title: "Photo gallery",
    description: "Photos from Drama Kids Canterbury’s Wednesday Drama Club and holiday clubs — games, stories, crafts and performances.",
    path: "/gallery",
  });

const filters: GalleryFilter[] = ["All", "Classes", "Holiday clubs"];

export default function GalleryPage() {
  const { filter, setFilter, lightbox, open } = useGalleryStore();
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const list = useMemo(() => (filter === "All" ? gallery : gallery.filter((g) => g.category === filter)), [filter]);

  // Photos glide to their new places when the filter changes (GSAP Flip)
  const choose = (f: GalleryFilter) => {
    if (f === filter) return;
    if (grid.current && !prefersReducedMotion()) flipState.current = Flip.getState(grid.current.children);
    setFilter(f);
  };
  useEffect(() => {
    if (!flipState.current || !grid.current) return;
    Flip.from(flipState.current, {
      targets: grid.current.children,
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.3 }),
    });
    flipState.current = null;
  }, [filter]);

  // Reset the filter when leaving the page
  useEffect(() => () => setFilter("All"), [setFilter]);

  return (
    <>
      <PageHero eyebrow="Backstage pass" title="Gallery" intro="A peek at what goes on at Drama Kids — games, stories, crafts and a whole lot of fun." />

      <section aria-labelledby="gallery-heading" className="on-light section-y bg-cream">
        <h2 id="gallery-heading" className="sr-only">Photos</h2>
        <div className="container-site">
          <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const count = f === "All" ? gallery.length : gallery.filter((g) => g.category === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => choose(f)}
                  className={`min-h-11 rounded-full px-5 font-bold transition-colors ${
                    filter === f ? "bg-ink text-cream" : "bg-paper text-ink ring-1 ring-line hover:bg-cream-2"
                  }`}
                >
                  {f} <span className="ml-1 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          <div ref={grid} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {list.map((g, i) => (
              <figure
                key={g.photo}
                data-flip-id={g.photo}
                className={`group relative overflow-hidden rounded-card bg-cream-2 shadow-card ${i % 5 === 0 ? "row-span-2" : ""}`}
              >
                <button type="button" onClick={() => open(i)} className="block h-full w-full text-left" aria-label={`Open photo: ${g.caption}`}>
                  <Picture
                    picture={photos[g.photo]}
                    alt={g.alt}
                    sizes="(min-width: 1024px) 30vw, 48vw"
                    className="block h-full"
                    imgClassName={`h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105 ${
                      i % 5 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"
                    }`}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/80 to-transparent p-3 pt-10 text-sm font-bold text-cream">
                    <span>{g.caption}</span>
                    <Expand className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </figcaption>
                </button>
              </figure>
            ))}
          </div>

          <Reveal className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="text-lead text-ink-soft">Fancy being in the next photo?</p>
            <ButtonLink to="/book" size="lg">Book now</ButtonLink>
          </Reveal>
        </div>
      </section>

      {lightbox !== null && list[lightbox] && <Lightbox list={list} index={lightbox} />}
    </>
  );
}

/** Full-screen photo viewer: arrow keys / buttons to move, Escape or the X to close. */
function Lightbox({ list, index }: { list: typeof gallery; index: number }) {
  const { close, step } = useGalleryStore();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const item = list[index];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const lenis = useUiStore.getState().lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1, list.length);
      if (e.key === "ArrowLeft") step(-1, list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      opener?.focus();
    };
  }, [close, step, list.length]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Photo ${index + 1} of ${list.length}: ${item.caption}`} className="fixed inset-0 z-[90] flex flex-col bg-stage/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 p-4 text-cream">
        <p className="font-bold">
          {index + 1} / {list.length} · <span className="text-mist">{item.caption}</span>
        </p>
        <button ref={closeBtn} type="button" onClick={close} aria-label="Close photo" className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16" onClick={(e) => e.target === e.currentTarget && close()}>
        <Picture key={item.photo} picture={photos[item.photo]} alt={item.alt} sizes="90vw" priority className="block max-h-full" imgClassName="max-h-[78vh] w-auto rounded-card object-contain shadow-stage" />
        {list.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1, list.length)} aria-label="Previous photo" className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-cream hover:bg-white/20 sm:left-4">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => step(1, list.length)} aria-label="Next photo" className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-cream hover:bg-white/20 sm:right-4">
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
