import { Mail, Phone, ShoppingBasket } from "lucide-react";
import { money } from "~/lib/booking/catalogue";
import type { PriceLine } from "~/lib/booking/pricing";
import { site } from "~/lib/site";

/** Running basket shown beside the form (below it on phones). */
export function BookingSummary({ lines, total }: { lines: PriceLine[]; total: number }) {
  return (
    <aside aria-labelledby="summary-title" className="space-y-5">
      <div className="rounded-card bg-stage p-6 text-cream shadow-lift">
        <h2 id="summary-title" className="flex items-center gap-2 font-display text-h4">
          <ShoppingBasket className="size-5 text-spotlight" aria-hidden="true" /> Your booking
        </h2>
        {lines.length ? (
          <ul className="mt-4 divide-y divide-white/10 text-sm">
            {lines.map((l) => (
              <li key={l.childId + l.item.id} className="flex justify-between gap-4 py-2.5">
                <span>
                  <span className="block font-bold">{l.item.title}</span>
                  <span className="text-mist">{l.childName} · {l.item.when}</span>
                </span>
                <span className="font-bold">{money(l.pence)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-mist">Nothing chosen yet — pick a class or club to get started.</p>
        )}
        <p className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-4" aria-live="polite">
          <span className="font-bold">Total</span>
          <span className="font-display text-h3 text-spotlight">{money(total)}</span>
        </p>
      </div>

      <div className="rounded-card bg-paper p-5 text-sm shadow-card ring-1 ring-line">
        <p className="font-bold">Questions before you book?</p>
        <a href={site.contact.phoneHref} className="mt-2 flex items-center gap-2 hover:underline">
          <Phone className="size-4 text-teal-deep" aria-hidden="true" /> Call or text {site.contact.phone}
        </a>
        <a href={`mailto:${site.contact.email}`} className="mt-1.5 flex items-center gap-2 break-all hover:underline">
          <Mail className="size-4 shrink-0 text-teal-deep" aria-hidden="true" /> {site.contact.email}
        </a>
      </div>
    </aside>
  );
}
