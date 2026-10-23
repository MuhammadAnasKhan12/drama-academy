import { useRef, type ReactNode } from "react";
import { gsap, mq, useGSAP } from "~/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  label: string;
};

/**
 * Infinite auto-scrolling row you can also drag (mouse or touch).
 * Pauses on hover / keyboard focus. Reduced motion → a plain swipeable row.
 */
export function Marquee({ children, className, duration = 40, reverse = false, label }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const el = track.current!;
        const wrap = root.current!;
        wrap.dataset.anim = "on";
        const tween = gsap.fromTo(
          el,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
        );
        let startX = 0;
        let startProgress = 0;
        let dragging = false;
        let hover = false;

        const down = contextSafe!((e: PointerEvent) => {
          dragging = true;
          startX = e.clientX;
          startProgress = tween.progress();
          tween.pause();
          wrap.setPointerCapture(e.pointerId);
          wrap.style.cursor = "grabbing";
        });
        const move = contextSafe!((e: PointerEvent) => {
          if (!dragging) return;
          const half = el.scrollWidth / 2;
          const delta = (e.clientX - startX) / half;
          tween.progress(gsap.utils.wrap(0, 1, startProgress + (reverse ? delta : -delta)));
        });
        const up = () => {
          dragging = false;
          wrap.style.cursor = "";
          if (!hover) tween.play();
        };
        const enter = () => {
          hover = true;
          tween.pause();
        };
        const leave = () => {
          hover = false;
          if (!dragging) tween.play();
        };

        wrap.addEventListener("pointerdown", down);
        wrap.addEventListener("pointermove", move);
        wrap.addEventListener("pointerup", up);
        wrap.addEventListener("pointercancel", up);
        wrap.addEventListener("mouseenter", enter);
        wrap.addEventListener("mouseleave", leave);
        wrap.addEventListener("focusin", enter);
        wrap.addEventListener("focusout", leave);
        return () => {
          wrap.dataset.anim = "off";
          wrap.removeEventListener("pointerdown", down);
          wrap.removeEventListener("pointermove", move);
          wrap.removeEventListener("pointerup", up);
          wrap.removeEventListener("pointercancel", up);
          wrap.removeEventListener("mouseenter", enter);
          wrap.removeEventListener("mouseleave", leave);
          wrap.removeEventListener("focusin", enter);
          wrap.removeEventListener("focusout", leave);
        };
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      role="region"
      aria-label={label}
      data-anim="off"
      className={`group/marquee overflow-x-auto overflow-y-hidden data-[anim=on]:cursor-grab data-[anim=on]:touch-pan-y data-[anim=on]:overflow-x-hidden data-[anim=on]:select-none ${className ?? ""}`}
    >
      <div ref={track} className="flex w-max gap-[inherit]">
        <div className="flex shrink-0 gap-[inherit] pr-[var(--marquee-gap,1.5rem)]">{children}</div>
        {/* Visual duplicate for a seamless loop — hidden from screen readers */}
        <div aria-hidden="true" inert className="hidden shrink-0 group-data-[anim=on]/marquee:flex gap-[inherit] pr-[var(--marquee-gap,1.5rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
