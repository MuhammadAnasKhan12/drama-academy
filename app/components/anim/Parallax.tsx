import { useRef, type ReactNode } from "react";
import { gsap, mq, useGSAP } from "~/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Positive moves slower than scroll (drifts down), negative faster. ~ -1..1 */
  speed?: number;
};

/** Gentle scroll parallax. Halved on mobile, off for reduced motion. */
export function Parallax({ children, className, speed = 0.3 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const make = (amount: number) =>
        gsap.fromTo(
          ref.current,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      mm.add(mq.desktop, () => make(speed * 30));
      mm.add(mq.mobile, () => make(speed * 12));
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
