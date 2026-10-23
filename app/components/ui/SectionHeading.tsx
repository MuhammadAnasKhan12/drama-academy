import type { ReactNode } from "react";
import { Reveal } from "~/components/anim/Reveal";
import { SplitHeading } from "~/components/anim/SplitHeading";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
};

/** Eyebrow + masked split-line heading + optional intro paragraph. Used at the top of every section. */
export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", className, as = "h2" }: Props) {
  const centred = align === "center";
  return (
    <header className={`${centred ? "mx-auto text-center" : ""} max-w-3xl ${className ?? ""}`}>
      <p className={`eyebrow mb-3 ${tone === "dark" ? "text-spotlight" : "text-magenta-deep"}`}>{eyebrow}</p>
      <SplitHeading as={as} className={`text-h2 ${tone === "dark" ? "text-cream" : "text-ink"}`}>
        {title}
      </SplitHeading>
      {intro && (
        <Reveal>
          <p className={`mt-5 text-lead ${centred ? "mx-auto" : ""} max-w-2xl ${tone === "dark" ? "text-mist" : "text-ink-soft"}`}>{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
