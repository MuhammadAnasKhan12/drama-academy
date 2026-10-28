import { CalendarDays, Check, Clock, MapPin, Sparkles, Users } from "lucide-react";
import type { ReactNode } from "react";
import { toneBg, toneOn } from "~/components/ui/tone";
import { money, type BookableItem, type ItemKind } from "~/lib/booking/catalogue";
import { site } from "~/lib/site";
import { useBookingStore } from "~/stores/booking";

const groups: { kind: ItemKind; title: string; intro: string }[] = [
  { kind: "club", title: "Holiday clubs", intro: "Every holiday except Christmas, at Canterbury Academy. £25 a day — booked as a full course." },
  { kind: "term", title: "Wednesday Drama Club", intro: "Weekly, 4–5pm at Ash Village Hall. Pay only for the sessions left in the term." },
  { kind: "workshop", title: "Themed workshops", intro: "One-off themed sessions throughout the year." },
];

function ItemCard({ item, selected, places, onToggle }: { item: BookableItem; selected: boolean; places: number | undefined; onToggle: () => void }) {
  const soldOut = places === 0;
  const few = places !== undefined && places > 0 && places <= 5;
  return (
    <label
      className={`group relative flex cursor-pointer flex-col rounded-card border-2 bg-paper p-5 transition-[border-color,box-shadow,transform] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-deep ${
        soldOut ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5"
      } ${selected ? "border-ink shadow-pop" : "border-line shadow-card"}`}
    >
      <input type="checkbox" className="sr-only" checked={selected} disabled={soldOut} onChange={onToggle} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${toneBg[item.tone]} ${toneOn[item.tone]}`}>{item.subtitle}</span>
          <h4 className="mt-2 font-display text-h4 leading-tight">{item.title}</h4>
        </div>
        <span
          aria-hidden="true"
          className={`grid size-7 shrink-0 place-items-center rounded-lg border-2 transition-colors ${selected ? "border-ink bg-ink text-cream" : "border-line"}`}
        >
          {selected && <Check className="size-4" strokeWidth={3} />}
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-ink-soft">
        <li className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0" aria-hidden="true" />{item.when}</li>
        <li className="flex items-center gap-2"><Clock className="size-4 shrink-0" aria-hidden="true" />{item.time}</li>
        <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0" aria-hidden="true" />{site.venues[item.venue].name}</li>
        <li className="flex items-center gap-2"><Users className="size-4 shrink-0" aria-hidden="true" />Ages {item.ageMin}–{item.ageMax}</li>
      </ul>
      <div className="mt-4 flex items-end justify-between gap-3 border-t-2 border-dashed border-line pt-3">
        <p>
          <span className="font-display text-h4">{money(item.pricePence)}</span>
          <span className="text-sm text-ink-soft"> per child{item.priceNote && ` · ${item.priceNote}`}</span>
        </p>
        <p className={`text-sm font-bold ${soldOut ? "text-magenta-deep" : few ? "text-magenta-deep" : "text-teal-deep"}`}>
          {places === undefined ? "Checking…" : soldOut ? "Fully booked" : few ? `Only ${places} left` : "Places available"}
        </p>
      </div>
    </label>
  );
}

export function StepChoose({ catalogue, places, error }: { catalogue: BookableItem[]; places: Record<string, number> | null; error?: string }) {
  const { selected, toggleItem } = useBookingStore();

  return (
    <div className="space-y-10">
      {error && <p className="rounded-chip bg-magenta/10 p-3 font-bold text-magenta-deep" role="alert">{error}</p>}
      {groups.map((g) => {
        const items = catalogue.filter((i) => i.kind === g.kind);
        return (
          <fieldset key={g.kind}>
            <legend className="font-display text-h3">{g.title}</legend>
            <p className="mt-1 text-ink-soft">{g.intro}</p>
            {items.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    selected={selected.includes(item.id)}
                    places={places?.[item.id]}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            ) : (
              <Empty>
                {g.kind === "workshop"
                  ? "New workshop dates are coming soon — they'll appear here as soon as they're announced."
                  : "No dates are open for booking right now. Please check back soon."}
              </Empty>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 flex items-center gap-3 rounded-card border-2 border-dashed border-line bg-paper/60 p-5 text-ink-soft">
      <Sparkles className="size-5 shrink-0 text-magenta" aria-hidden="true" />
      {children}
    </p>
  );
}
