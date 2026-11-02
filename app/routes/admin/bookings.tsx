import { ChevronRight, Download, Search } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { BookingDetail } from "~/components/admin/BookingDetail";
import { btnSecondary, Card, Empty, inputClass, LoadingRows, PageHeader, StatusBadge } from "~/components/admin/ui";
import { downloadCsv, fullName, shortDate } from "~/lib/admin/selectors";
import type { BookingStatus } from "~/lib/admin/types";
import { money } from "~/lib/booking/catalogue";
import { useAdminLoading, useAdminStore } from "~/stores/admin";

const statuses: (BookingStatus | "all")[] = ["all", "paid", "pending", "failed", "refunded", "cancelled", "expired"];

/** All bookings, filterable. Filters live in the URL so a filtered list can be bookmarked or shared. */
export default function AdminBookings() {
  const { bookings, items } = useAdminStore();
  const loading = useAdminLoading();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const status = (params.get("status") ?? "all") as BookingStatus | "all";
  const item = params.get("item") ?? "";
  const ref = params.get("ref");

  const setParam = (key: string, value: string) =>
    setParams(
      (p) => {
        value ? p.set(key, value) : p.delete(key);
        return p;
      },
      { replace: true, preventScrollReset: true },
    );

  const itemTitle = useMemo(() => new Map(items.map((i) => [i.id, i.title])), [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return bookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (item && !b.children.some((c) => c.items.includes(item))) return false;
      if (!needle) return true;
      const hay = [b.reference, b.parent.firstName, b.parent.lastName, b.parent.email, b.parent.phone, ...b.children.flatMap((c) => [c.firstName, c.lastName])]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [bookings, q, status, item]);

  const open = bookings.find((b) => b.reference === ref);
  const close = useCallback(() => setParam("ref", ""), []); // eslint-disable-line react-hooks/exhaustive-deps

  const exportCsv = () =>
    downloadCsv(`bookings-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["Reference", "Booked", "Status", "Parent", "Email", "Phone", "Children", "Bookings", "Total (£)"],
      ...filtered.map((b) => [
        b.reference,
        shortDate(b.createdAt),
        b.status,
        fullName(b.parent),
        b.parent.email,
        b.parent.phone,
        b.children.map(fullName).join("; "),
        Array.from(new Set(b.children.flatMap((c) => c.items))).map((id) => itemTitle.get(id) ?? id).join("; "),
        (b.totalPence / 100).toFixed(2),
      ]),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        intro={loading ? "Loading…" : `${filtered.length} of ${bookings.length} bookings`}
        actions={
          <button type="button" className={btnSecondary} onClick={exportCsv} disabled={!filtered.length}>
            <Download className="size-4" aria-hidden="true" /> Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search bookings</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search name, email, phone or reference"
            className={`${inputClass} w-full pl-9`}
          />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select value={status} onChange={(e) => setParam("status", e.target.value === "all" ? "" : e.target.value)} className={`${inputClass} w-full capitalize`}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Club or term</span>
          <select value={item} onChange={(e) => setParam("item", e.target.value)} className={`${inputClass} w-full sm:max-w-72`}>
            <option value="">All clubs & terms</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingRows rows={8} />
        ) : !filtered.length ? (
          <Empty>No bookings match these filters.</Empty>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-line bg-cream-2/60 text-xs tracking-wide text-ink-soft uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3">Parent</th>
                  <th scope="col" className="px-4 py-3">Children</th>
                  <th scope="col" className="px-4 py-3">Booked onto</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Total</th>
                  <th scope="col"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((b) => {
                  const its = Array.from(new Set(b.children.flatMap((c) => c.items)));
                  return (
                    <tr key={b.id} className="cursor-pointer hover:bg-cream" onClick={() => setParam("ref", b.reference)}>
                      <td className="px-4 py-3">
                        <button type="button" className="text-left font-bold hover:underline" onClick={(e) => (e.stopPropagation(), setParam("ref", b.reference))}>
                          {fullName(b.parent)}
                        </button>
                        <span className="block text-xs text-ink-soft">{b.reference}</span>
                      </td>
                      <td className="px-4 py-3">{b.children.map((c) => c.firstName).join(", ")}</td>
                      <td className="max-w-72 px-4 py-3">
                        <span className="line-clamp-2">{its.map((id) => itemTitle.get(id) ?? id).join(", ")}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{shortDate(b.createdAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">{money(b.totalPence)}</td>
                      <td className="pr-3"><ChevronRight className="size-4 text-ink-soft" aria-hidden="true" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Phone list */}
            <ul className="divide-y divide-line md:hidden">
              {filtered.map((b) => (
                <li key={b.id}>
                  <button type="button" onClick={() => setParam("ref", b.reference)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-cream">
                    <span className="min-w-0">
                      <span className="block truncate font-bold">{fullName(b.parent)}</span>
                      <span className="block truncate text-sm text-ink-soft">
                        {b.children.map((c) => c.firstName).join(", ")} · {shortDate(b.createdAt)}
                      </span>
                      <span className="mt-1 block"><StatusBadge status={b.status} /></span>
                    </span>
                    <span className="shrink-0 font-bold tabular-nums">{money(b.totalPence)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {open && <BookingDetail booking={open} items={items} onClose={close} />}
    </div>
  );
}
