import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Picture } from "~/components/ui/Picture";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { ease, gsap, mq, prefersReducedMotion, useGSAP } from "~/lib/gsap";
import { photos, type PhotoKey } from "~/lib/images";
import { site } from "~/lib/site";

const chapters: { act: string; title: string; when: string; text: string; photo: PhotoKey; alt: string; tone: string }[] = [
  {
    act: "Act I",
    title: "Classes",
    when: "Every week, term-time",
    text: "Warm-ups, games and stories. Children learn to listen, play, project their voices and work as a team — and make friends along the way.",
    photo: "warmupCircle",
    alt: "Children gathered in a circle game with their teacher in a bright studio",
    tone: "bg-teal",
  },
  {
    act: "Act II",
    title: "Rehearsals",
    when: "The weeks before a show",
    text: "Scripts come out, characters come alive. Everyone gets lines matched to their confidence, plus songs, movement and a little bit of stage magic.",
    photo: "drumGame",
    alt: "A teacher with bongo drums directing children in a rhythm game",
    tone: "bg-magenta",
  },
  {
    act: "Act III",
    title: "Show Night",
    when: "End of autumn & summer terms",
    text: "Costumes on, lights up, butterflies fluttering. Families fill the seats and our performers take their bow. Pure magic.",
    photo: "huddle",
    alt: "Children huddled together in a circle before performing",
    tone: "bg-spotlight",
  },
  {
    act: "Encore",
    title: "Holiday Clubs",
    when: "Every holiday except Christmas",
    text: "3-day half-term intensives and 5-day Easter and summer workshops, each ending in a showcase. The best way to fill the school holidays.",
    photo: "parkClimbing",
    alt: "Three children in hi-vis vests pulling silly faces on a climbing frame",
    tone: "bg-blue",
  },
];

/** Seconds each slide stays before auto-advancing */
const AUTOPLAY = 5;
/** Pixels a drag must travel to count as a swipe */
const SWIPE = 60;

/**
 * "A year at Drama Kids": a carousel that plays itself and can be dragged / swiped.
 * Pauses on hover, keyboard focus, while dragging and when off-screen.
 * Reduced motion: no autoplay, instant slide changes. No JS: a native swipeable row.
 */
export function YearStory() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const [index, setIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const indexRef = useRef(0);
  const count = chapters.length;

  /** x offset that lines slide i up with the track's left padding */
  const xFor = useCallback((i: number) => {
    const slide = track.current?.children[i] as HTMLElement | undefined;
    if (!slide || !track.current) return 0;
    const pad = parseFloat(getComputedStyle(track.current).paddingLeft) || 0;
    return -(slide.offsetLeft - pad);
  }, []);

  const goTo = useCallback(
    (i: number, instant = false) => {
      const next = (i + count) % count;
      indexRef.current = next;
      setIndex(next);
      gsap.to(track.current, {
        x: xFor(next),
        duration: instant || prefersReducedMotion() ? 0 : 0.9,
        ease: ease.inOut,
        overwrite: true,
      });
      timer.current?.restart();
    },
    [count, xFor],
  );

  // Autoplay clock: one tween that fills the progress bar, then advances.
  useGSAP(
    () => {
      setEnhanced(true);
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        timer.current = gsap.fromTo(
          "[data-autoplay-bar]",
          { scaleX: 0 },
          { scaleX: 1, duration: AUTOPLAY, ease: "none", paused: true, onComplete: () => goTo(indexRef.current + 1) },
        );
        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? timer.current?.play() : timer.current?.pause()), {
          threshold: 0.35,
        });
        io.observe(section.current!);
        return () => {
          io.disconnect();
          timer.current = null;
        };
      });
    },
    { scope: section },
  );

  // Keep the active slide aligned when the window resizes
  useEffect(() => {
    if (!enhanced) return;
    const onResize = () => gsap.set(track.current, { x: xFor(indexRef.current) });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [enhanced, xFor]);

  // Drag / swipe
  useEffect(() => {
    if (!enhanced) return;
    const vp = viewport.current!;
    let startX = 0;
    let startTrackX = 0;
    let dragging = false;
    let moved = 0;

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startTrackX = Number(gsap.getProperty(track.current, "x"));
      gsap.killTweensOf(track.current);
      timer.current?.pause();
      vp.setPointerCapture(e.pointerId);
      vp.dataset.dragging = "true";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      moved = e.clientX - startX;
      // a little resistance past the first / last slide
      const min = xFor(count - 1);
      let x = startTrackX + moved;
      if (x > 0) x *= 0.35;
      if (x < min) x = min + (x - min) * 0.35;
      gsap.set(track.current, { x });
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      delete vp.dataset.dragging;
      const i = indexRef.current;
      if (moved < -SWIPE) goTo(Math.min(i + 1, count - 1));
      else if (moved > SWIPE) goTo(Math.max(i - 1, 0));
      else goTo(i);
      if (!vp.matches(":hover")) timer.current?.play();
    };
    const pause = () => timer.current?.pause();
    const resume = () => !dragging && timer.current?.play();
    // Only keyboard focus pauses autoplay — a mouse drag also focuses the carousel
    const focusIn = (e: FocusEvent) => (e.target as HTMLElement).matches(":focus-visible") && pause();
    const focusOut = () => !section.current?.matches(":hover") && resume();

    vp.addEventListener("pointerdown", down);
    vp.addEventListener("pointermove", move);
    vp.addEventListener("pointerup", up);
    vp.addEventListener("pointercancel", up);
    section.current!.addEventListener("mouseenter", pause);
    section.current!.addEventListener("mouseleave", resume);
    section.current!.addEventListener("focusin", focusIn);
    section.current!.addEventListener("focusout", focusOut);
    return () => {
      vp.removeEventListener("pointerdown", down);
      vp.removeEventListener("pointermove", move);
      vp.removeEventListener("pointerup", up);
      vp.removeEventListener("pointercancel", up);
      section.current?.removeEventListener("mouseenter", pause);
      section.current?.removeEventListener("mouseleave", resume);
      section.current?.removeEventListener("focusin", focusIn);
      section.current?.removeEventListener("focusout", focusOut);
    };
  }, [enhanced, count, goTo, xFor]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(index + 1);
    if (e.key === "ArrowLeft") goTo(index - 1);
  };

  return (
    <section ref={section} aria-labelledby="year-title" className="stage-texture relative overflow-hidden bg-stage section-y">
      <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading tone="dark" eyebrow="The show must go on" title={<span id="year-title">A year at {site.shortName}</span>} />
        <div className={`gap-3 ${enhanced ? "flex" : "hidden"}`}>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="grid size-12 place-items-center rounded-full bg-stage-2 text-cream ring-1 ring-white/15 transition hover:bg-spotlight hover:text-ink"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="grid size-12 place-items-center rounded-full bg-stage-2 text-cream ring-1 ring-white/15 transition hover:bg-spotlight hover:text-ink"
            >
              <ChevronRight className="size-5" />
            </button>
        </div>
      </div>

      <div
        ref={viewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="A year at Drama Kids — use the arrow keys, buttons or drag to move between slides"
        tabIndex={0}
        onKeyDown={onKey}
        className={`mt-8 touch-pan-y outline-none data-[dragging=true]:cursor-grabbing ${
          enhanced ? "cursor-grab overflow-clip select-none" : "snap-x snap-mandatory overflow-x-auto"
        }`}
      >
        <div
          ref={track}
          className="flex w-max gap-5 pr-[var(--spacing-gutter)] pl-[max(var(--spacing-gutter),calc((100vw-var(--container-site))/2+var(--spacing-gutter)))] md:gap-8"
        >
          {chapters.map((c, i) => (
            <article
              key={c.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${c.title}`}
              aria-hidden={enhanced && i !== index}
              className={`grid w-[min(86vw,50rem)] snap-start overflow-hidden rounded-blob bg-stage-2 ring-1 ring-white/10 transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)] md:w-[min(62vw,50rem)] md:grid-cols-[1.1fr_1fr] ${
                enhanced && i !== index ? "scale-[0.94] opacity-45" : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[22rem]">
                <Picture
                  picture={photos[c.photo]}
                  alt={c.alt}
                  sizes="(min-width: 768px) 34vw, 86vw"
                  className="block h-full"
                  imgClassName="pointer-events-none h-full w-full object-cover"
                  draggable={false}
                />
                <span className={`absolute top-5 left-5 rounded-full px-4 py-1.5 font-display text-ink shadow-pop-sm ${c.tone}`}>{c.act}</span>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <p className="eyebrow text-spotlight">{c.when}</p>
                <h3 className="mt-2 text-h3 text-cream">{c.title}</h3>
                <p className="mt-3 text-mist">{c.text}</p>
                <p aria-hidden="true" className="mt-6 font-display text-5xl text-white/10">0{i + 1}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={`container-site mt-8 items-center gap-6 ${enhanced ? "flex" : "hidden"}`}>
          <div className="flex gap-2">
            {chapters.map((c, i) => (
              <button
                key={c.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${c.title}`}
                aria-current={i === index}
                className="grid h-11 place-items-center"
              >
                <span
                  className={`block h-2.5 rounded-full transition-[width,background-color] duration-500 ${
                    i === index ? "w-8 bg-spotlight" : "w-2.5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
          {/* Time until the next slide */}
          <div aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-white/10 motion-reduce:hidden">
            <div data-autoplay-bar className="h-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-teal),var(--color-magenta),var(--color-spotlight))]" />
          </div>
      </div>
    </section>
  );
}
