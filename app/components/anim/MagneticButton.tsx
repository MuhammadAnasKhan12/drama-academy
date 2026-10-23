import { useRef, type ReactNode } from "react";
import { ease, gsap, mq, useGSAP } from "~/lib/gsap";

/** Wrap any button/link: it gently follows the pointer when nearby (desktop, fine pointer only). */
export function MagneticButton({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(`${mq.finePointer} and ${mq.motion}`, () => {
        const el = ref.current!;
        const inner = el.firstElementChild as HTMLElement;
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: ease.bouncy });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: ease.bouncy });
        const ixTo = gsap.quickTo(inner, "x", { duration: 0.6, ease: ease.bouncy });
        const iyTo = gsap.quickTo(inner, "y", { duration: 0.6, ease: ease.bouncy });

        const move = contextSafe!((e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * strength);
          yTo(dy * strength);
          ixTo(dx * strength * 0.4);
          iyTo(dy * strength * 0.4);
        });
        const leave = contextSafe!(() => {
          xTo(0);
          yTo(0);
          ixTo(0);
          iyTo(0);
        });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`inline-block p-4 -m-4 ${className ?? ""}`}>
      {children}
    </div>
  );
}
