import { Pencil } from "lucide-react";
import { Link } from "react-router";
import { isDemoMode } from "~/lib/booking/api";
import { PaymentSection } from "./PaymentSection";
import { money } from "~/lib/booking/catalogue";
import type { PriceLine } from "~/lib/booking/pricing";
import { useBookingStore, type Errors, type Step } from "~/stores/booking";

function Section({ title, step, children }: { title: string; step: Step; children: React.ReactNode }) {
  const goTo = useBookingStore((s) => s.goTo);
  return (
    <section className="rounded-card bg-paper p-5 shadow-card ring-1 ring-line sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-h4">{title}</h3>
        <button type="button" onClick={() => goTo(step)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-blue-deep hover:bg-blue/10">
          <Pencil className="size-4" aria-hidden="true" /> Change<span className="sr-only"> {title.toLowerCase()}</span>
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function StepReview({ lines, total, errors, paymentError }: { lines: PriceLine[]; total: number; errors: Errors; paymentError?: string }) {
  const { children, parent, agreeTerms, setAgreeTerms } = useBookingStore();

  return (
    <div className="space-y-5">
      <Section title="Bookings" step={0}>
        <ul className="divide-y divide-line">
          {lines.map((l) => (
            <li key={l.childId + l.item.id} className="flex justify-between gap-4 py-2.5">
              <span>
                <span className="block font-bold">{l.item.title}</span>
                <span className="text-sm text-ink-soft">
                  {l.childName} · {l.item.when} · {l.item.time}
                </span>
              </span>
              <span className="font-bold">{money(l.pence)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Children" step={1}>
        <ul className="space-y-3 text-sm">
          {children.map((c) => (
            <li key={c.id}>
              <p className="font-bold">
                {c.firstName} {c.lastName}{" "}
                <span className="font-normal text-ink-soft">· born {c.dob && new Date(c.dob).toLocaleDateString("en-GB")}</span>
              </p>
              <p className="text-ink-soft">Needs: {c.needs} · Social media photos: {c.photoConsent === "yes" ? "Yes" : "No"}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Your details" step={2}>
        <p className="text-sm">
          <span className="font-bold">
            {parent.firstName} {parent.lastName}
          </span>
          <br />
          {parent.email} · {parent.phone}
          <br />
          {[parent.street, parent.street2, parent.town, parent.county, parent.postcode].filter(Boolean).join(", ")}
        </p>
      </Section>

      <PaymentSection total={total} error={paymentError} />

      <div className="rounded-card bg-cream-2 p-5 sm:p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            aria-invalid={!!errors.agreeTerms}
            aria-describedby={errors.agreeTerms ? "agree-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--color-ink)]"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" target="_blank" className="font-bold underline">Terms &amp; Conditions</Link> and understand how my details are used in the{" "}
            <Link to="/privacy" target="_blank" className="font-bold underline">Privacy Policy</Link>. I confirm the information above is correct.
          </span>
        </label>
        {errors.agreeTerms && <p id="agree-error" className="mt-2 text-sm font-bold text-magenta-deep">{errors.agreeTerms}</p>}
      </div>

      {isDemoMode() && (
        <p className="text-sm text-ink-soft">
          <strong>Demo mode:</strong> payments aren’t connected yet, so pressing Pay won’t charge anything or save the booking.
        </p>
      )}
    </div>
  );
}
