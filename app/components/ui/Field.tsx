import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

/** Accessible form fields: label, hint and error wired up with aria-describedby / aria-invalid. */

const control =
  "mt-1.5 block w-full rounded-chip border-2 bg-paper px-3.5 py-2.5 text-ink transition-colors placeholder:text-ink-soft/60 " +
  "focus:border-blue-deep focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-magenta";

type Base = { id: string; label: ReactNode; hint?: ReactNode; error?: string; optional?: boolean; className?: string };

function Wrap({ id, label, hint, error, optional, className, children }: Base & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="font-bold">
        {label} {optional && <span className="font-normal text-ink-soft">(optional)</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="text-sm text-ink-soft">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-bold text-magenta-deep">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, hint?: ReactNode, error?: string) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

export function TextField({ id, label, hint, error, optional, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={id}
        name={id}
        required={!optional}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} ${error ? "border-magenta" : "border-line"}`}
        {...rest}
      />
    </Wrap>
  );
}

export function TextArea({ id, label, hint, error, optional, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        id={id}
        name={id}
        rows={3}
        required={!optional}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} resize-y ${error ? "border-magenta" : "border-line"}`}
        {...rest}
      />
    </Wrap>
  );
}

/** Radio buttons in a fieldset, styled as pills */
export function RadioPills<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: ReactNode;
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="font-bold">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 font-bold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-deep ${
              value === o.value ? "border-ink bg-ink text-cream" : error ? "border-magenta bg-paper" : "border-line bg-paper hover:border-ink"
            }`}
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-bold text-magenta-deep">
          {error}
        </p>
      )}
    </fieldset>
  );
}
