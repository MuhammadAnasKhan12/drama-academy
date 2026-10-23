import { useEffect, useRef } from "react";
import logo from "~/assets/brand/logo.png";
import { ease, gsap, useGSAP } from "~/lib/gsap";
import { useIntroStore } from "~/stores/intro";
import { useUiStore } from "~/stores/ui";

/**
 * The one big theatrical moment: velvet curtains part, a spotlight fades up, then the hero
 * headline reveals (hero listens to `done` in the intro store).
 *
 * Whether it plays is decided by a tiny inline script in <head> (see root.tsx) which adds
 * `intro-pending` to <html> before first paint — only if it hasn't played this session and
 * the visitor hasn't asked for reduced motion. That avoids any flash of the page first.
 * Max ~2s, skippable with a click, tap or any key.
 */
export function CurtainIntro() {
  const root = useRef<HTMLDivElement>(null);
  const setDone = useIntroStore((s) => s.setDone);
  const markSeen = useIntroStore((s) => s.markSeen);

  // No intro this load → let the hero animate straight away.
  useEffect(() => {
    if (!document.documentElement.classList.contains("intro-pending")) setDone(true);
  }, [setDone]);

  useGSAP(
    (_ctx, contextSafe) => {
      const html = document.documentElement;
      if (!html.classList.contains("intro-pending")) return;

      const el = root.current!;
      const lenis = useUiStore.getState().lenis;
      lenis?.stop();
      html.style.overflow = "hidden";

      const finish = () => {
        html.classList.remove("intro-pending");
        html.style.overflow = "";
        useUiStore.getState().lenis?.start();
        markSeen();
        setDone(true);
      };

      const left = el.querySelectorAll<HTMLElement>("[data-curtain=left] > *");
      const right = el.querySelectorAll<HTMLElement>("[data-curtain=right] > *");

      const tl = gsap.timeline({ onComplete: finish });
      tl.set(el, { autoAlpha: 1 })
        .from("[data-intro-logo]", { autoAlpha: 0, scale: 0.6, rotate: -8, duration: 0.45, ease: ease.playful })
        .to("[data-intro-logo]", { autoAlpha: 0, scale: 1.15, duration: 0.3, ease: "power2.in" }, 0.6)
        // Curtains part: inner folds lead, outer folds follow, with a little fabric sway
        .to(left, { xPercent: -105, skewX: 6, duration: 1.0, stagger: { each: 0.06, from: "end" }, ease: ease.inOut }, 0.7)
        .to(right, { xPercent: 105, skewX: -6, duration: 1.0, stagger: { each: 0.06, from: "start" }, ease: ease.inOut }, 0.7)
        .to("[data-intro-valance]", { yPercent: -100, duration: 0.6, ease: "power2.in" }, 1.25)
        .fromTo("[data-intro-beam]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, 0.9)
        .to("[data-intro-beam]", { autoAlpha: 0, duration: 0.4 }, 1.55)
        // Let the hero headline start while the curtains are still clearing
        .add(() => setDone(true), 1.3)
        .to(el, { autoAlpha: 0, duration: 0.25 }, 1.75);

      const skip = contextSafe!(() => tl.progress(1));
      window.addEventListener("keydown", skip, { once: true });
      el.addEventListener("pointerdown", skip, { once: true });
      return () => {
        window.removeEventListener("keydown", skip);
        tl.progress(1);
      };
    },
    { scope: root },
  );

  const folds = [0, 1, 2];

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="intro-root fixed inset-0 z-[90] hidden cursor-pointer overflow-hidden bg-stage"
    >
      {/* Curtains: three folds per side so they part in a staggered, fabric-like way */}
      <div data-curtain="left" className="absolute inset-y-0 left-0 w-1/2">
        {folds.map((i) => (
          <div key={i} className="velvet absolute inset-y-0 origin-top-left" style={{ left: `${i * 33.3}%`, width: "40%", zIndex: 3 - i }} />
        ))}
      </div>
      <div data-curtain="right" className="absolute inset-y-0 right-0 w-1/2">
        {folds.map((i) => (
          <div key={i} className="velvet absolute inset-y-0 origin-top-right" style={{ right: `${i * 33.3}%`, width: "40%", zIndex: 3 - i }} />
        ))}
      </div>
      {/* Pelmet across the top, with gold fringe */}
      <div data-intro-valance className="velvet absolute inset-x-0 top-0 z-10 h-[11vh] border-b-4 border-spotlight-deep shadow-stage" />
      {/* Spotlight beam */}
      <div
        data-intro-beam
        className="absolute inset-0 z-[5] opacity-0"
        style={{ background: "radial-gradient(ellipse 40% 55% at 50% 45%, rgb(255 214 120 / 0.6), transparent 70%)" }}
      />
      <div className="absolute inset-0 z-20 grid place-items-center">
        <img data-intro-logo src={logo} alt="" width={459} height={331} className="w-[min(60vw,22rem)] drop-shadow-[0_0_40px_rgb(255_200_61_/_0.45)]" />
      </div>
      <p className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-sm font-bold text-mist">Tap to skip</p>
    </div>
  );
}
