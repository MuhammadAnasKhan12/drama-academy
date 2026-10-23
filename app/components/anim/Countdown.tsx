import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; mins: number; secs: number };

const diff = (target: Date): Parts => {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    mins: Math.floor(ms / 60_000) % 60,
    secs: Math.floor(ms / 1000) % 60,
  };
};

/**
 * Live countdown. Renders placeholders on the server (pre-render) and starts ticking after
 * hydration, so there's no hydration mismatch. Screen readers get one stable, polite label.
 */
export function Countdown({ target, tone = "dark", className }: { target: Date; tone?: "dark" | "light"; className?: string }) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(diff(target));
    const id = window.setInterval(() => setParts(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const cells: [keyof Parts, string][] = [
    ["days", "Days"],
    ["hours", "Hrs"],
    ["mins", "Mins"],
    ["secs", "Secs"],
  ];
  const label = parts ? `${parts.days} days, ${parts.hours} hours to go` : "Countdown";

  return (
    <div className={`flex gap-2 sm:gap-3 ${className ?? ""}`} role="timer" aria-label={label} aria-live="off">
      {cells.map(([key, text]) => (
        <div
          key={key}
          aria-hidden="true"
          className={`flex min-w-[3.4rem] flex-col items-center rounded-chip px-2 py-2 sm:min-w-[4rem] ${
            tone === "dark" ? "bg-stage-2 text-cream ring-1 ring-white/10" : "bg-paper text-ink shadow-card"
          }`}
        >
          <span className="font-display text-h4 tabular-nums leading-none">
            {parts ? String(parts[key]).padStart(2, "0") : "--"}
          </span>
          <span className={`mt-1 text-[0.7rem] font-bold uppercase tracking-widest ${tone === "dark" ? "text-mist" : "text-ink-soft"}`}>
            {text}
          </span>
        </div>
      ))}
    </div>
  );
}
