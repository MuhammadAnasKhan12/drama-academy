import { useRef } from "react";
import { gsap, mq, useGSAP } from "~/lib/gsap";

/**
 * Warm theatre spotlight. Desktop: follows the cursor across its parent.
 * Mobile: sweeps gently on its own. Reduced motion: holds still, centre stage.
 * Purely decorative — sits behind text so it never affects readability.
 */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = ref.current!;
      const parent = el.parentElement!;
      const mm = gsap.matchMedia();

      mm.add(`${mq.desktop} and ${mq.finePointer}`, () => {
        const pos = { x: 50, y: 38 };
        const apply = () => {
          el.style.setProperty("--x", `${pos.x}%`);
          el.style.setProperty("--y", `${pos.y}%`);
        };
        const xTo = gsap.quickTo(pos, "x", { duration: 0.9, ease: "power3.out", onUpdate: apply });
        const yTo = gsap.quickTo(pos, "y", { duration: 0.9, ease: "power3.out", onUpdate: apply });
        const move = contextSafe!((e: PointerEvent) => {
          const r = parent.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width) * 100);
          yTo(((e.clientY - r.top) / r.height) * 100);
        });
        const leave = contextSafe!(() => {
          xTo(50);
          yTo(38);
        });
        parent.addEventListener("pointermove", move);
        parent.addEventListener("pointerleave", leave);
        return () => {
          parent.removeEventListener("pointermove", move);
          parent.removeEventListener("pointerleave", leave);
        };
      });

      mm.add(`${mq.motion} and (not ((min-width: 768px) and (hover: hover) and (pointer: fine)))`, () => {
        const pos = { x: 30 };
        gsap.to(pos, {
          x: 70,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          onUpdate: () => el.style.setProperty("--x", `${pos.x}%`),
        });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 [--x:50%] [--y:38%] ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(circle min(34rem, 70vw) at var(--x) var(--y), rgb(255 214 120 / 0.30), rgb(255 200 61 / 0.10) 40%, transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
