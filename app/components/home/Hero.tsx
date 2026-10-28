import { ArrowRight, ShieldCheck, Star, Users } from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "~/components/anim/MagneticButton";
import { Sparkles } from "~/components/anim/Sparkles";
import { SplitHeading } from "~/components/anim/SplitHeading";
import { Spotlight } from "~/components/anim/Spotlight";
import { ButtonLink } from "~/components/ui/Button";
import { Picture } from "~/components/ui/Picture";
import { parentRating } from "~/data/stats";
import { ease, gsap, mq, useGSAP } from "~/lib/gsap";
import { photos } from "~/lib/images";
import { site } from "~/lib/site";
import { useIntroStore } from "~/stores/intro";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroStore((s) => s.done);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const items = ["[data-hero-fade]", "[data-hero-photo]"];
        if (!ready) {
          gsap.set(items, { autoAlpha: 0 });
          return;
        }
        gsap
          .timeline({ delay: 0.35 })
          .fromTo("[data-hero-fade]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7 })
          .fromTo(
            "[data-hero-photo]",
            // base tilt lives in the CSS `rotate` property; GSAP only adds a temporary extra spin
            { autoAlpha: 0, y: 80, rotate: (i) => (i % 2 ? 10 : -10), scale: 0.8 },
            { autoAlpha: 1, y: 0, rotate: 0, scale: 1, stagger: 0.12, duration: 1, ease: ease.playful },
            0.1,
          );
      });

      // Scroll away: drapes drift in a little, content lifts — feels like the scene changing
      mm.add(mq.desktop, () => {
        gsap.to("[data-drape=left]", { xPercent: 18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to("[data-drape=right]", { xPercent: -18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to("[data-hero-photos]", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      });
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <section ref={ref} aria-labelledby="hero-title" className="stage-texture relative isolate flex min-h-[100svh] items-center overflow-hidden bg-stage pt-[var(--spacing-nav)]">
      {/* Pelmet with gold scallops */}
      <div aria-hidden="true" className="velvet absolute inset-x-0 top-[var(--spacing-nav)] z-10 h-5 md:h-8">
        <div className="absolute inset-x-0 -bottom-3 h-3 bg-[radial-gradient(circle_at_50%_0,var(--color-spotlight-deep)_55%,transparent_58%)] bg-[length:22px_12px] opacity-90" />
      </div>
      {/* Side drapes, tied back */}
      <div aria-hidden="true" data-drape="left" className="velvet absolute inset-y-0 -left-4 z-[5] w-[11vw] max-w-36 rounded-br-[100%_30%] shadow-stage md:w-[8vw]" />
      <div aria-hidden="true" data-drape="right" className="velvet absolute inset-y-0 -right-4 z-[5] w-[11vw] max-w-36 rounded-bl-[100%_30%] shadow-stage md:w-[8vw]" />
      {/* Stage floor + footlights */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[12%] bg-[linear-gradient(180deg,#3a2414,#1d120a)] [mask-image:linear-gradient(transparent,#000_35%)]">
        <div className="absolute inset-x-[12%] bottom-4 flex justify-between">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="size-2 rounded-full bg-spotlight shadow-[0_0_18px_6px_rgb(255_200_61_/_0.45)]" />
          ))}
        </div>
      </div>

      <Spotlight className="z-[1]" />
      <Sparkles className="z-[2]" />

      <div className="container-site relative z-[6] grid items-center gap-10 pt-12 pb-20 md:pt-16 md:pb-24 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="max-w-2xl px-[4vw] sm:px-[6vw] lg:px-0 lg:pl-[4vw] min-[90rem]:pl-0">
          <p data-hero-fade className="eyebrow mb-5 text-spotlight">
            Weekly class · Holiday clubs · Workshops
          </p>
          <SplitHeading as="h1" trigger="ready" ready={ready} className="text-display text-cream">
            <span id="hero-title">
              Where Canterbury’s kids find their <span className="text-spotlight">spotlight</span>
            </span>
          </SplitHeading>
          <p data-hero-fade className="mt-6 max-w-xl text-lead text-mist">
            A weekly Wednesday drama club, live end-of-term performances and holiday clubs for ages {site.ages.min}–{site.ages.max}. Brilliant
            DBS-checked teachers, and confidence that lasts long after the curtain falls.
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <ButtonLink to="/book" size="lg">
                Book now
              </ButtonLink>
            </MagneticButton>
            <ButtonLink to="/classes" size="lg" variant="ghost-light" icon={<ArrowRight className="size-5" />}>
              Explore Classes
            </ButtonLink>
          </div>
          <ul data-hero-fade className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-mist">
            <li className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-spotlight text-spotlight" aria-hidden="true" /> {parentRating.score} from {parentRating.count}+ parents
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-teal" aria-hidden="true" /> DBS-checked team
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Users className="size-4 text-magenta" aria-hidden="true" /> From £10.50 a session
            </li>
          </ul>
        </div>

        {/* Polaroid-style photos pinned to the stage */}
        <div data-hero-photos className="relative mx-auto aspect-[5/4] w-full max-w-[28rem] lg:mr-[3vw] xl:max-w-[30rem]">
          {[
            { p: photos.musicGuitar, alt: "Children dancing with arms outstretched while a teacher plays guitar", cls: "left-0 top-[6%] w-[62%]" },
            { p: photos.runningGame, alt: "A smiling teacher and children running in a drama warm-up game", cls: "right-0 top-0 w-[52%]" },
            { p: photos.storyCircle, alt: "A teacher leading a story circle with children sitting on the studio floor", cls: "left-[22%] bottom-0 w-[58%]" },
          ].map(({ p, alt, cls }, i) => (
            // Wrapper holds the resting tilt; GSAP animates the figure inside it
            <div key={i} className={`absolute ${cls}`} style={{ transform: `rotate(${[-6, 5, -2][i]}deg)` }}>
              <figure data-hero-photo className="relative rounded-sm bg-paper p-2 pb-8 shadow-stage sm:p-3 sm:pb-10">
                <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-4deg] bg-spotlight/80" />
                <Picture picture={p} alt={alt} sizes="(min-width: 1024px) 22rem, 60vw" priority imgClassName="aspect-[4/3] w-full object-cover" />
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
