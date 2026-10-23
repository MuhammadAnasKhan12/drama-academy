import { useRef, type ElementType, type ReactNode } from "react";
import { ease, gsap, mq, ScrollTrigger, useGSAP } from "~/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "rise" = calm fade-up (parents' info). "pop" = bouncy scale-in (kid-facing cards). */
  variant?: "rise" | "pop";
  /** Animate each direct child in a staggered batch instead of the wrapper as one block */
  stagger?: boolean;
  delay?: number;
};

/**
 * Scroll-triggered entrance. Initial hidden state is set in JS, so content is
 * always visible if JavaScript fails. Reduced motion → simple opacity fade.
 */
export function Reveal({ children, as: Tag = "div", className, variant = "rise", stagger = false, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : [el];
      const mm = gsap.matchMedia();

      mm.add(mq.motion, () => {
        const from =
          variant === "pop"
            ? { autoAlpha: 0, y: 50, scale: 0.9, rotate: () => gsap.utils.random(-3, 3) }
            : { autoAlpha: 0, y: 36 };
        gsap.set(targets, from);
        ScrollTrigger.batch(targets, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              delay,
              stagger: 0.1,
              duration: variant === "pop" ? 0.9 : 0.8,
              ease: variant === "pop" ? ease.playful : ease.out,
              overwrite: true,
            }),
        });
      });

      mm.add(mq.reduced, () => {
        gsap.set(targets, { autoAlpha: 0 });
        ScrollTrigger.batch(targets, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, duration: 0.4, stagger: 0.05 }),
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
