import { Camera, CameraOff, TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Card, Empty, inputClass, LoadingRows, PageHeader } from "~/components/admin/ui";
import { fullName, hasNeeds, rosterFor } from "~/lib/admin/selectors";
import { useNow } from "~/lib/useNow";
import { useAdminLoading, useAdminStore } from "~/stores/admin";

/**
 * Register for one club or term: who's coming, their needs and photo consent, and who to call.
 */
export default function AdminRegisters() {
  const { bookings, items } = useAdminStore();
  const loading = useAdminLoading();
  const [params, setParams] = useSearchParams();
  const today = useNow().toISOString().slice(0, 10);

  const defaultItem = items.find((i) => i.endDate >= today)?.id ?? items[0]?.id ?? "";
  const itemId = params.get("item") ?? defaultItem;
  const item = items.find((i) => i.id === itemId);
  const roster = useMemo(() => (item ? rosterFor(item.id, bookings, item.startDate) : []), [item, bookings]);

  const withNeeds = roster.filter((r) => hasNeeds(r.child.needs)).length;
  const noPhotos = roster.filter((r) => !r.child.photoConsent).length;
  const pending = roster.filter((r) => r.booking.status === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registers"
        intro="Who’s coming to each club or term — with allergies, photo consent and emergency contacts."
      />

      <label className="block max-w-xl">
        <span className="text-sm font-bold">Club or term</span>
        <select
          value={itemId}
          onChange={(e) => setParams({ item: e.target.value }, { replace: true, preventScrollReset: true })}
          className={`${inputClass} mt-1 w-full`}
        >
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.title} ({i.when}){i.endDate < today ? " — finished" : ""}
            </option>
          ))}
        </select>
      </label>

      {item && (
        <div className="flex flex-wrap gap-2">
            <Chip>{roster.length} of {item.capacity} places</Chip>
            <Chip tone={withNeeds ? "alert" : undefined}>{withNeeds} with allergies or needs</Chip>
            <Chip tone={noPhotos ? "alert" : undefined}>{noPhotos} no photos</Chip>
            {pending > 0 && <Chip>{pending} payment pending</Chip>}
            <Chip>{item.venue}</Chip>
        </div>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingRows rows={8} />
        ) : !roster.length ? (
          <Empty>No children are booked onto this yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="border-b border-line bg-cream-2/60 text-xs tracking-wide text-ink-soft uppercase">
                <tr>
                  <th scope="col" className="w-10 px-4 py-3">#</th>
                  <th scope="col" className="px-4 py-3">Child</th>
                  <th scope="col" className="px-4 py-3">Allergies / needs</th>
                  <th scope="col" className="px-4 py-3">Photos</th>
                  <th scope="col" className="px-4 py-3">Parent & phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {roster.map((r, i) => {
                  const needs = hasNeeds(r.child.needs);
                  return (
                    <tr key={`${r.booking.id}-${r.child.id}`} className={needs ? "bg-magenta/5" : ""}>
                      <td className="px-4 py-3 text-ink-soft tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold">{fullName(r.child)}</span>
                        <span className="block text-xs text-ink-soft">
                          Age {r.age}
                          {r.booking.status === "pending" && <span className="ml-1 font-bold text-ink"> · payment pending</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {needs ? (
                          <span className="inline-flex items-start gap-1.5 font-bold text-magenta-deep">
                            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            {r.child.needs}
                          </span>
                        ) : (
                          <span className="text-ink-soft">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {r.child.photoConsent ? (
                          <span className="inline-flex items-center gap-1 font-bold text-teal-deep">
                            <Camera className="size-4" aria-hidden="true" /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-magenta-deep">
                            <CameraOff className="size-4" aria-hidden="true" /> No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {fullName(r.booking.parent)}
                        <a href={`tel:${r.booking.parent.phone.replace(/\s/g, "")}`} className="block font-bold text-blue-deep hover:underline">
                          {r.booking.parent.phone}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone?: "alert" }) {
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-bold ring-1 ${tone === "alert" ? "bg-magenta/10 text-magenta-deep ring-magenta/30" : "bg-paper text-ink ring-line"}`}>
      {children}
    </span>
  );
}
