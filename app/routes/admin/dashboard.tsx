import { ArrowUpRight, CalendarRange, PoundSterling, Ticket, TriangleAlert, Users } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import { CapacityBar, Card, LoadingRows, PageHeader, StatCard, StatusBadge } from "~/components/admin/ui";
import { fullName, hasNeeds, placesTaken, rosterFor, shortDate } from "~/lib/admin/selectors";
import { money } from "~/lib/booking/catalogue";
import { useNow } from "~/lib/useNow";
import { useAdminLoading, useAdminStore } from "~/stores/admin";

export default function AdminDashboard() {
  const { bookings, items } = useAdminStore();
  const loading = useAdminLoading();
  const now = useNow();
  const today = now.toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const paid = bookings.filter((b) => b.status === "paid");
    const children = new Set(paid.flatMap((b) => b.children.map((c) => `${c.firstName}|${c.lastName}|${c.dob}`)));
    const needs = paid.flatMap((b) => b.children).filter((c) => hasNeeds(c.needs)).length;
    return {
      revenue: paid.reduce((s, b) => s + b.totalPence, 0),
      paidCount: paid.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      children: children.size,
      needs,
    };
  }, [bookings]);

  const upcoming = useMemo(() => items.filter((i) => i.endDate >= today).slice(0, 6), [items, today]);

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" intro={`Overview for ${now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`} />

      <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Money taken" value={money(stats.revenue)} note={`${stats.paidCount} paid bookings`} icon={<PoundSterling className="size-5" />} />
        <StatCard label="Children booked" value={stats.children} note="Across all clubs and terms" icon={<Users className="size-5" />} />
        <StatCard
          label="Payments pending"
          value={stats.pending}
          note={stats.pending ? "Waiting for the bank to confirm" : "All payments settled"}
          icon={<Ticket className="size-5" />}
        />
        <StatCard
          label="Allergies & needs"
          value={stats.needs}
          note={<Link to="/admin/registers" className="font-bold text-blue-deep hover:underline">See on registers</Link>}
          icon={<TriangleAlert className="size-5" />}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <CalendarRange className="size-5 text-teal-deep" aria-hidden="true" /> Coming up
            </h2>
            <Link to="/admin/clubs" className="text-sm font-bold text-blue-deep hover:underline">All clubs</Link>
          </div>
          {loading ? (
            <LoadingRows rows={5} />
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.map((i) => {
                const taken = placesTaken(i.id, bookings);
                const needs = rosterFor(i.id, bookings, i.startDate).filter((r) => hasNeeds(r.child.needs)).length;
                return (
                  <li key={i.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={`/admin/registers?item=${encodeURIComponent(i.id)}`} className="font-bold hover:underline">
                          {i.title}
                        </Link>
                        <p className="text-sm text-ink-soft">
                          {i.when} · {i.venue}
                          {needs > 0 && <span className="ml-2 font-bold text-magenta-deep">· {needs} with needs</span>}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <CapacityBar taken={taken} capacity={i.capacity} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <Ticket className="size-5 text-magenta-deep" aria-hidden="true" /> Latest bookings
            </h2>
            <Link to="/admin/bookings" className="text-sm font-bold text-blue-deep hover:underline">All bookings</Link>
          </div>
          {loading ? (
            <LoadingRows rows={6} />
          ) : (
            <ul className="divide-y divide-line">
              {bookings.slice(0, 7).map((b) => (
                <li key={b.id}>
                  <Link to={`/admin/bookings?ref=${b.reference}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-cream">
                    <span className="min-w-0">
                      <span className="block truncate font-bold">{fullName(b.parent)}</span>
                      <span className="block truncate text-sm text-ink-soft">
                        {b.children.map((c) => c.firstName).join(" & ")} · {shortDate(b.createdAt)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={b.status} />
                      <span className="hidden w-16 text-right font-bold tabular-nums sm:block">{money(b.totalPence)}</span>
                      <ArrowUpRight className="size-4 text-ink-soft" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
