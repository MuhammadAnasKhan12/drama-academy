import { Plus } from "lucide-react";
import { useId, useState } from "react";

type Item = { q: string; a: string };

/** Accessible accordion: real buttons, aria-expanded / aria-controls, one panel open at a time. */
export function Accordion({ items, defaultOpen = 0 }: { items: Item[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const id = useId();

  return (
    <div className="divide-y-2 divide-line overflow-hidden rounded-card bg-paper shadow-card ring-1 ring-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-h4 transition-colors hover:bg-cream sm:px-8"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-300 ease-[var(--ease-back)] ${
                    isOpen ? "rotate-45 bg-magenta text-paper" : "bg-cream-2"
                  }`}
                >
                  <Plus className="size-5" />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              hidden={!isOpen}
              className="px-6 pb-6 text-ink-soft sm:px-8 motion-safe:animate-[faq-in_0.35s_var(--ease-out-soft)]"
            >
              <p className="max-w-3xl">{item.a}</p>
            </div>
          </div>
        );
      })}
      <style>{`@keyframes faq-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
