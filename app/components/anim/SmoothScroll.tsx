import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { gsap, mq, ScrollTrigger } from "~/lib/gsap";
import { useUiStore } from "~/stores/ui";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays perfectly in sync.
 * Disabled entirely for prefers-reduced-motion. Also handles ScrollTrigger.refresh after
 * fonts/images load and scroll-to-top on route change.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const setLenis = useUiStore((s) => s.setLenis);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const media = window.matchMedia(mq.reduced);
    let lenis: Lenis | null = null;
    const raf = (time: number) => lenis?.raf(time * 1000);

    const start = () => {
      if (media.matches || lenis) return;
      lenis = new Lenis({ lerp: 0.11, autoRaf: false, anchors: { offset: -88 } });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    };
    const stop = () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };
    const onChange = () => (media.matches ? stop() : start());

    start();
    media.addEventListener("change", onChange);

    // Layout shifts after webfonts/images load would leave triggers in the wrong place.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("load", refresh);
      stop();
    };
  }, [setLenis]);

  // New page → start at the top (or the #anchor), then re-measure triggers.
  useEffect(() => {
    const lenis = useUiStore.getState().lenis;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) (lenis ? lenis.scrollTo(el as HTMLElement, { offset: -88 }) : el.scrollIntoView());
    } else {
      lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0);
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return <>{children}</>;
}
