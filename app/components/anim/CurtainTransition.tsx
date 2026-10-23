import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";
import { gsap, prefersReducedMotion } from "~/lib/gsap";

const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

/**
 * Quick curtain wipe between pages (~0.6s). On a route change the curtain is dropped over the
 * new page before it paints, then lifts to reveal it — so navigation itself is never delayed.
 */
export function CurtainTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  useIsoLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    const tl = gsap.timeline();
    tl.set(el, { autoAlpha: 1, yPercent: 0 })
      .set(el.children, { yPercent: 0 })
      .to(el.children, { yPercent: -100, duration: 0.55, stagger: { each: 0.07, from: "end" }, ease: "power3.inOut" })
      .set(el, { autoAlpha: 0 });
    return () => {
      tl.progress(1).kill();
    };
  }, [pathname]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-spotlight" />
      <div className="velvet absolute inset-0" />
    </div>
  );
}
