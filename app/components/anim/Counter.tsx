import { useRef } from "react";
import { gsap, mq, useGSAP } from "~/lib/gsap";

type Props = { value: number; suffix?: string; decimals?: number; className?: string };

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Counts up from 0 when scrolled into view. Renders the final number in HTML for no-JS / SEO. */
export function Counter({ value, suffix = "", decimals = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const state = { n: 0 };
        el.textContent = format(0, decimals) + suffix;
        gsap.to(state, {
          n: value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = format(state.n, decimals) + suffix;
          },
        });
        return () => {
          el.textContent = format(value, decimals) + suffix;
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {format(value, decimals)}
      {suffix}
    </span>
  );
}
