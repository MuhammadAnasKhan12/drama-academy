/**
 * GSAP is set up once, here. Import gsap & plugins from this file — never from "gsap" directly —
 * so plugins are always registered and defaults are consistent across the site.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Named eases: calm for parents' info, bouncy for kid-facing moments. */
export const ease = {
  out: "power3.out",
  inOut: "power3.inOut",
  playful: "back.out(1.6)",
  bouncy: "elastic.out(1, 0.65)",
  none: "none",
} as const;

/** Media queries for gsap.matchMedia(). Desktop gets the full show; mobile and reduced-motion get less. */
export const mq = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(mq.reduced).matches;

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
