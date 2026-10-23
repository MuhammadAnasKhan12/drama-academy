/**
 * A handful of twinkling stars. Pure CSS animation on transform/opacity — very light.
 * Positions are fixed (not random) so pre-rendered HTML matches the client exactly.
 */
const stars = [
  { top: "12%", left: "8%", size: 14, delay: 0, color: "var(--color-spotlight)" },
  { top: "22%", left: "88%", size: 18, delay: 1.2, color: "var(--color-teal)" },
  { top: "68%", left: "6%", size: 12, delay: 2.1, color: "var(--color-magenta)" },
  { top: "78%", left: "92%", size: 14, delay: 0.6, color: "var(--color-spotlight)" },
  { top: "8%", left: "56%", size: 10, delay: 1.8, color: "var(--color-blue)" },
  { top: "48%", left: "96%", size: 9, delay: 2.6, color: "var(--color-spotlight)" },
  { top: "40%", left: "3%", size: 10, delay: 3.1, color: "var(--color-teal)" },
];

export function Sparkles({ className, count = stars.length }: { className?: string; count?: number }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {stars.slice(0, count).map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          className="absolute motion-safe:animate-[twinkle_3.6s_ease-in-out_infinite]"
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s`, color: s.color }}
        >
          <path fill="currentColor" d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
        </svg>
      ))}
      <style>{`@keyframes twinkle{0%,100%{opacity:.25;transform:scale(.6) rotate(0)}50%{opacity:1;transform:scale(1.1) rotate(45deg)}}`}</style>
    </div>
  );
}
