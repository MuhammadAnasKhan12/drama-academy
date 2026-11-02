import { ClipboardList, Lock, LockOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { CapacityBar, Card, LoadingRows, PageHeader, btnSecondary } from "~/components/admin/ui";
import { placesTaken } from "~/lib/admin/selectors";
import { money } from "~/lib/booking/catalogue";
import { useNow } from "~/lib/useNow";
import { useAdminLoading, useAdminStore } from "~/stores/admin";

const kindLabel = { club: "Holiday club", term: "Weekly class", workshop: "Workshop" } as const;

/** Every club, term and workshop with places taken, and a switch to close online booking. */
export default function AdminClubs() {
  const { bookings, items, closed, toggleOpen } = useAdminStore();
  const loading = useAdminLoading();
  const [showPast, setShowPast] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const today = useNow().toISOString().slice(0, 10);

  const list = useMemo(() => items.filter((i) => showPast || i.endDate >= today), [items, showPast, today]);

  const toggle = async (id: string, title: string, isClosed: boolean) => {
    if (!isClosed && !window.confirm(`Close online booking for “${title}”? Parents won’t be able to book it until you reopen it.`)) return;
    setBusy(id);
    try {
      await toggleOpen(id);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clubs & places"
        intro="How full each club and term is. Prices, dates and capacity are set in the website’s data files."
        actions={
          <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-paper px-4 text-sm font-bold ring-1 ring-line">
            <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="size-4 accent-[var(--color-ink)]" />
            Show finished
          </label>
        }
      />

      {loading ? (
        <Card><LoadingRows rows={6} /></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((i) => {
            const taken = placesTaken(i.id, bookings);
            const isClosed = closed.includes(i.id);
            const past = i.endDate < today;
            const full = taken >= i.capacity;
            return (
              <Card key={i.id} className={`p-5 ${past ? "opacity-70" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">{kindLabel[i.kind]}</p>
                    <h2 className="mt-0.5 font-display text-xl leading-tight">{i.title}</h2>
                    <p className="mt-1 text-sm text-ink-soft">
                      {i.when} · {i.venue} · {money(i.pricePence)} per child
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${
                      past
                        ? "bg-ink/5 text-ink-soft ring-ink/15"
                        : isClosed
                          ? "bg-magenta/10 text-magenta-deep ring-magenta/30"
                          : full
                            ? "bg-spotlight/25 text-ink ring-spotlight-deep/40"
                            : "bg-teal/15 text-teal-deep ring-teal/40"
                    }`}
                  >
                    {past ? "Finished" : isClosed ? "Booking closed" : full ? "Full" : "Open"}
                  </span>
                </div>

                <div className="mt-4">
                  <CapacityBar taken={taken} capacity={i.capacity} />
                  <p className="mt-1 text-xs text-ink-soft">{Math.max(0, i.capacity - taken)} places left</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/admin/registers?item=${encodeURIComponent(i.id)}`} className={btnSecondary}>
                    <ClipboardList className="size-4" aria-hidden="true" /> Register
                  </Link>
                  {!past && (
                    <button type="button" className={btnSecondary} disabled={busy === i.id} onClick={() => toggle(i.id, i.title, isClosed)}>
                      {isClosed ? <LockOpen className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
                      {isClosed ? "Reopen booking" : "Close booking"}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
