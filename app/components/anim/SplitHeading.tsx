import { useRef, type ReactNode } from "react";
import { ease, gsap, mq, SplitText, useGSAP } from "~/lib/gsap";

type Props = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** "scroll" plays when scrolled into view; "ready" plays as soon as `ready` turns true (hero). */
  trigger?: "scroll" | "ready";
  ready?: boolean;
  delay?: number;
};

/**
 * Masked line-by-line reveal using GSAP SplitText. Lines slide up from behind a mask.
 * autoSplit re-splits on resize / font load so lines are always correct.
 */
export function SplitHeading({ children, as: Tag = "h2", className, trigger = "scroll", ready = true, delay = 0 }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();

      mm.add(mq.motion, () => {
        if (trigger === "ready" && !ready) {
          gsap.set(el, { autoAlpha: 0 });
          return;
        }
        gsap.set(el, { autoAlpha: 1 });
        const split = SplitText.create(el, {
          type: "lines,words",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          aria: "auto",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              rotate: 2,
              duration: 0.9,
              stagger: 0.09,
              delay,
              ease: ease.out,
              scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined,
            }),
        });
        return () => split.revert();
      });

      mm.add(mq.reduced, () => {
        if (trigger === "ready" && !ready) return gsap.set(el, { autoAlpha: 0 });
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay });
      });
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
