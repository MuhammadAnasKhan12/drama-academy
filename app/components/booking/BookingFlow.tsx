import { useElements, useStripe } from "@stripe/react-stripe-js";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { isDemoMode, startCheckout, type BookingPayload } from "~/lib/booking/api";
import { money } from "~/lib/booking/catalogue";
import { priceLines, totalPence } from "~/lib/booking/pricing";
import { stripeKey } from "~/lib/stripe";
import { STEPS, useBookingStore, type Step } from "~/stores/booking";
import { BookingSummary } from "./BookingSummary";
import { StepChildren } from "./StepChildren";
import { StepChoose } from "./StepChoose";
import { StepParent } from "./StepParent";
import { StepReview } from "./StepReview";
import { PaymentProcessing } from "./PaymentProcessing";
import { useCatalogue } from "./useCatalogue";

const stepIntro = [
  "Tick everything you'd like to book. You can book for more than one child.",
  "Tell us about each child and choose what they're coming to.",
  "So we can confirm the booking and reach you on the day.",
  "Check everything looks right, then pay securely.",
];

/** Four-step booking: choose → children → parent details → review & pay. */
export function BookingFlow() {
  const store = useBookingStore();
  const { step, errors, status, submitError, goTo, validate } = store;
  const { catalogue, byId, places } = useCatalogue();
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Drop anything that's no longer bookable (e.g. a club that has started since it was added)
  useEffect(() => {
    const stale = store.selected.filter((id) => !byId.has(id));
    stale.forEach((id) => store.toggleItem(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byId]);

  const lines = useMemo(() => priceLines(store.children, byId), [store.children, byId]);
  const total = totalPence(lines);

  // Move focus to the step heading on step change (keyboard + screen reader friendly)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    top.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, [step]);

  const focusFirstError = () =>
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')?.focus());

  const next = () => {
    if (!validate(step, catalogue)) return focusFirstError();
    goTo((step + 1) as Step);
  };

  const pay = async () => {
    if (!validate(3, catalogue)) return focusFirstError();
    const s = useBookingStore.getState();
    // Live mode needs the Stripe card form (publishable key) — never create a payment we can't confirm
    if (!isDemoMode() && (!stripeKey || !stripe || !elements)) {
      s.setStatus("error", stripeKey ? "The payment form is still loading — please try again." : "Payments aren't set up yet: VITE_STRIPE_PUBLISHABLE_KEY is missing.");
      return;
    }
    // Stripe checks the card details first (only when the real card form is showing)
    if (elements) {
      const { error } = await elements.submit();
      if (error) {
        s.setStatus("error", error.message ?? "Please check your payment details.");
        return;
      }
    }
    const payload: BookingPayload = {
      parent: {
        firstName: s.parent.firstName.trim(),
        lastName: s.parent.lastName.trim(),
        phone: s.parent.phone.trim(),
        email: s.parent.email.trim(),
        address: { street: s.parent.street, street2: s.parent.street2, town: s.parent.town, county: s.parent.county, postcode: s.parent.postcode },
      },
      children: s.children.map((c) => ({
        firstName: c.firstName.trim(),
        lastName: c.lastName.trim(),
        dob: c.dob,
        needs: c.needs.trim(),
        photoConsent: c.photoConsent === "yes",
        items: c.items,
      })),
      expectedTotalPence: total,
      agreedToTerms: true,
    };
    s.setStatus("submitting");
    try {
      const result = await startCheckout(payload);
      const confirmation = {
        reference: result.reference,
        email: payload.parent.email,
        lines: lines.map((l) => ({ child: l.childName, item: `${l.item.title} (${l.item.when})`, price: money(l.pence) })),
        total: money(total),
        demo: result.mode === "demo",
      };

      if (result.mode === "demo") {
        s.complete(confirmation);
        navigate("/book/confirmation");
        return;
      }

      // Kept in session storage in case the bank's security check redirects away and back
      s.stashConfirmation(confirmation);
      const returnUrl = `${window.location.origin}/book/confirmation?ref=${encodeURIComponent(result.reference)}`;
      const { error, paymentIntent } = await stripe!.confirmPayment({
        elements: elements!,
        clientSecret: result.clientSecret,
        confirmParams: { return_url: returnUrl },
        redirect: "if_required",
      });
      if (error) {
        // Card declined, wrong CVC etc. Places for this attempt are released by the server.
        s.setStatus("error", error.message ?? "Your payment didn't go through. Please check your card details and try again.");
        return;
      }
      const outcome = paymentIntent.status === "succeeded" ? "succeeded" : "processing";
      if (outcome === "succeeded") s.clearBasket();
      navigate(`/book/confirmation?ref=${encodeURIComponent(result.reference)}&payment_intent=${paymentIntent.id}&redirect_status=${outcome}`);
    } catch (err) {
      s.setStatus("error", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div ref={top} className="scroll-mt-[calc(var(--spacing-nav)+1rem)]">
        {/* Progress */}
        <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Booking steps">
          {STEPS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} aria-current={current ? "step" : undefined}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => goTo(i as Step)}
                  className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                >
                  <span className={`h-1.5 rounded-full transition-colors ${done || current ? "bg-magenta" : "bg-line"}`} />
                  <span className={`flex items-center gap-1.5 text-xs font-bold sm:text-sm ${current ? "text-ink" : done ? "text-magenta-deep group-hover:underline" : "text-ink-soft"}`}>
                    {done && <Check className="size-3.5" aria-hidden="true" />}
                    <span className="hidden sm:inline">{i + 1}. </span>
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <h2 tabIndex={-1} className="font-display text-h2 outline-none">
          {STEPS[step]}
        </h2>
        <p className="mt-2 mb-8 text-ink-soft">{stepIntro[step]}</p>

        {step === 0 && <StepChoose catalogue={catalogue} places={places} error={errors.items} />}
        {step === 1 && <StepChildren byId={byId} errors={errors} />}
        {step === 2 && <StepParent errors={errors} />}
        {step === 3 && <StepReview lines={lines} total={total} errors={errors} paymentError={status === "error" ? submitError : undefined} />}

        {status === "error" && step !== 3 && (
          <p role="alert" className="mt-6 rounded-chip bg-magenta/10 p-3 font-bold text-magenta-deep">{submitError}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          {step > 0 ? (
            <Button type="button" variant="ghost-dark" onClick={() => goTo((step - 1) as Step)} className="shadow-none">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button type="button" onClick={next} icon={<ArrowRight className="size-4" aria-hidden="true" />}>
              Continue{step === 0 && store.selected.length ? ` · ${store.selected.length} selected` : ""}
            </Button>
          ) : (
            <Button type="button" variant="magenta" size="lg" onClick={pay} disabled={status === "submitting" || total === 0}>
              {status === "submitting" ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Starting payment…
                </>
              ) : (
                <>
                  <Lock className="size-4" aria-hidden="true" /> Pay {money(total)} securely
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-[calc(var(--spacing-nav)+1.5rem)]">
        <BookingSummary lines={lines} total={total} />
      </div>

      {status === "submitting" && <PaymentProcessing total={money(total)} />}

      {/* Phones: keep the total and the next action within thumb reach */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-white/10 bg-stage/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-cream backdrop-blur-md lg:hidden">
        <p className="leading-tight">
          <span className="block text-xs font-bold tracking-wider text-mist uppercase">Total</span>
          <span className="font-display text-h4 text-spotlight">{money(total)}</span>
        </p>
        {step < 3 ? (
          <Button type="button" onClick={next} className="shadow-none" icon={<ArrowRight className="size-4" aria-hidden="true" />}>
            Continue
          </Button>
        ) : (
          <Button type="button" variant="magenta" onClick={pay} disabled={status === "submitting" || total === 0} className="shadow-none">
            <Lock className="size-4" aria-hidden="true" /> {status === "submitting" ? "Starting…" : `Pay ${money(total)}`}
          </Button>
        )}
      </div>
    </div>
  );
}
