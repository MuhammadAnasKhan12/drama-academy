import logo from "~/assets/brand/logo.png";

/**
 * Drama Kids logo. "CANTERBURY" is live text (it's solid black in the original artwork),
 * tilted to match the logo, so it stays readable on dark and light backgrounds.
 */
export function Logo({ className, tone = "light", showPlace = true }: { className?: string; tone?: "light" | "dark"; showPlace?: boolean }) {
  return (
    <span className={`relative block w-full [container-type:inline-size] ${className ?? ""}`}>
      <img src={logo} alt="Drama Kids Canterbury" width={459} height={331} className="h-auto w-full" />
      {showPlace && (
        <span
          aria-hidden="true"
          className={`absolute right-[6%] bottom-[-14%] origin-right -rotate-[17deg] font-display text-[6.5cqw] leading-none tracking-[0.2em] whitespace-nowrap ${
            tone === "light" ? "text-cream" : "text-ink"
          }`}
        >
          CANTERBURY
        </span>
      )}
    </span>
  );
}
