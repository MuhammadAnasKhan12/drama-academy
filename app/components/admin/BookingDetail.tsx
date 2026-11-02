import { Ban, Camera, CameraOff, ExternalLink, Mail, Phone, RotateCcw, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dateTime, fullName, hasNeeds, shortDate } from "~/lib/admin/selectors";
import type { AdminBooking, AdminItem, BookingStatus } from "~/lib/admin/types";
import { ageOn, money } from "~/lib/booking/catalogue";
import { useAdminStore } from "~/stores/admin";
import { btnDanger, btnSecondary, StatusBadge } from "./ui";

/** Slide-over panel with everything about one booking, plus admin actions. */
export function BookingDetail({ booking, items, onClose }: { booking: AdminBooking; items: AdminItem[]; onClose: () => void }) {
  const { updateStatus } = useAdminStore();
  const [busy, setBusy] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const byId = new Map(items.map((i) => [i.id, i]));
  const p = booking.parent;

  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const act = async (label: string, fn: () => Promise<void>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(label);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };
  const mark = (status: BookingStatus, text: string) => act(status, () => updateStatus(booking.id, status), text);

  return (
    <div className="fixed inset-0 z-40 print:hidden" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button type="button" aria-label="Close booking" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div ref={panel} tabIndex={-1} className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-cream shadow-stage outline-none">
        <header className="flex items-start justify-between gap-4 border-b border-line bg-paper px-6 py-5">
          <div>
            <p className="text-sm font-bold text-ink-soft">Booking {booking.reference}</p>
            <h2 id="booking-title" className="font-display text-2xl">{fullName(p)}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <StatusBadge status={booking.status} /> {dateTime(booking.createdAt)}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-xl hover:bg-cream-2">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6" data-lenis-prevent>
          {/* Parent */}
          <section aria-labelledby="parent-h">
            <h3 id="parent-h" className="text-sm font-bold tracking-wide text-ink-soft uppercase">Parent / carer</h3>
            <div className="mt-2 rounded-xl bg-paper p-4 ring-1 ring-line">
              <p className="font-bold">{fullName(p)}</p>
              <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-bold text-blue-deep hover:underline">
                  <Phone className="size-4" aria-hidden="true" /> {p.phone}
                </a>
                <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1.5 font-bold text-blue-deep hover:underline">
                  <Mail className="size-4" aria-hidden="true" /> {p.email}
                </a>
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                {[p.address.street, p.address.street2, p.address.town, p.address.county, p.address.postcode].filter(Boolean).join(", ")}
              </p>
            </div>
          </section>

          {/* Children */}
          <section aria-labelledby="children-h">
            <h3 id="children-h" className="text-sm font-bold tracking-wide text-ink-soft uppercase">Children</h3>
            <div className="mt-2 space-y-3">
              {booking.children.map((c) => (
                <div key={c.id} className="rounded-xl bg-paper p-4 ring-1 ring-line">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">
                      {fullName(c)} <span className="font-normal text-ink-soft">· age {ageOn(c.dob, new Date().toISOString().slice(0, 10))} · born {shortDate(c.dob)}</span>
                    </p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${c.photoConsent ? "bg-teal/15 text-teal-deep" : "bg-magenta/10 text-magenta-deep"}`}>
                      {c.photoConsent ? <Camera className="size-3.5" aria-hidden="true" /> : <CameraOff className="size-3.5" aria-hidden="true" />}
                      {c.photoConsent ? "Photos OK" : "No photos"}
                    </span>
                  </div>
                  <p className={`mt-2 flex items-start gap-1.5 text-sm ${hasNeeds(c.needs) ? "font-bold text-magenta-deep" : "text-ink-soft"}`}>
                    {hasNeeds(c.needs) && <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
                    Allergies / needs: {c.needs}
                  </p>
                  <ul className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
                    {c.items.map((id) => {
                      const item = byId.get(id);
                      return (
                        <li key={id} className="flex justify-between gap-3">
                          <span>
                            <span className="font-bold">{item?.title ?? id}</span>
                            {item && <span className="text-ink-soft"> · {item.when}</span>}
                          </span>
                          {item && <span className="font-bold tabular-nums">{money(item.pricePence)}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section aria-labelledby="payment-h">
            <h3 id="payment-h" className="text-sm font-bold tracking-wide text-ink-soft uppercase">Payment</h3>
            <div className="mt-2 flex items-center justify-between gap-4 rounded-xl bg-paper p-4 ring-1 ring-line">
              <div>
                <p className="font-display text-2xl">{money(booking.totalPence)}</p>
                <p className="text-sm text-ink-soft">{booking.stripePaymentId ?? "No payment taken"}</p>
              </div>
              {booking.stripePaymentId && (
                <a
                  href={`https://dashboard.stripe.com/payments/${booking.stripePaymentId}`}
                  target="_blank"
                  rel="noreferrer"
                  className={btnSecondary}
                >
                  View in Stripe <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              )}
            </div>
            {booking.status === "paid" && (
              <p className="mt-2 text-xs text-ink-soft">Refunds are made in Stripe. Mark the booking as refunded here afterwards so the place is freed.</p>
            )}
          </section>

          {/* History */}
          {booking.log.length > 0 && (
            <section aria-labelledby="log-h">
              <h3 id="log-h" className="text-sm font-bold tracking-wide text-ink-soft uppercase">History</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {booking.log.map((l, i) => (
                  <li key={i} className="text-ink-soft">
                    <span className="font-bold text-ink">{l.action}</span> · {dateTime(l.at)} · {l.by}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-line bg-paper px-6 py-4">
          {booking.status === "paid" && (
            <button type="button" className={btnSecondary} disabled={!!busy} onClick={() => mark("refunded", "Have you already refunded this payment in Stripe? This frees the places.")}>
              <RotateCcw className="size-4" aria-hidden="true" /> Mark refunded
            </button>
          )}
          {(booking.status === "paid" || booking.status === "pending") && (
            <button type="button" className={btnDanger} disabled={!!busy} onClick={() => mark("cancelled", "Cancel this booking? The places will be released.")}>
              <Ban className="size-4" aria-hidden="true" /> Cancel booking
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
