import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";

type Variant = "primary" | "secondary" | "ghost-light" | "ghost-dark" | "teal" | "magenta";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-display tracking-wide whitespace-nowrap " +
  "transition-[transform,box-shadow,background-color,color] duration-200 ease-[var(--ease-back)] " +
  "hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-spotlight text-ink shadow-pop hover:shadow-[7px_7px_0_0_var(--color-ink)]",
  secondary: "bg-ink text-cream shadow-[5px_5px_0_0_var(--color-magenta)] hover:shadow-[7px_7px_0_0_var(--color-magenta)]",
  teal: "bg-teal text-ink shadow-pop hover:shadow-[7px_7px_0_0_var(--color-ink)]",
  magenta: "bg-magenta text-paper shadow-pop hover:shadow-[7px_7px_0_0_var(--color-ink)]",
  "ghost-light": "text-cream ring-2 ring-cream/70 hover:bg-cream hover:text-ink",
  "ghost-dark": "text-ink ring-2 ring-ink hover:bg-ink hover:text-cream",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2 text-[0.95rem]",
  lg: "min-h-12 px-6 py-2.5 text-base sm:text-[1.05rem]",
};

type Common = { variant?: Variant; size?: Size; icon?: ReactNode; className?: string; children: ReactNode };

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`;

/** Internal link styled as a button */
export function ButtonLink({ variant, size, icon, className, children, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {icon && <span className="transition-transform duration-200 group-hover/btn:translate-x-1">{icon}</span>}
    </Link>
  );
}

/** External link (WhatsApp, tickets) styled as a button */
export function ButtonAnchor({ variant, size, icon, className, children, ...rest }: Common & ComponentProps<"a">) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {icon && <span className="transition-transform duration-200 group-hover/btn:translate-x-1">{icon}</span>}
    </a>
  );
}

export function Button({ variant, size, icon, className, children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {icon}
    </button>
  );
}
