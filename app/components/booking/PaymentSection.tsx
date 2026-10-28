import { Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { site } from "~/lib/site";
import { getStripe, stripeAppearance, stripeFonts, stripeKey } from "~/lib/stripe";
import { useBookingStore } from "~/stores/booking";

/** Stripe needs a positive amount to render; the real total is set as soon as it's known. */
const MIN_PENCE = 100;

/**
 * Wraps the booking flow in Stripe Elements ("deferred intent" mode), so the Payment Element
 * can render without a backend. A PaymentIntent is only needed when payments go live.
 */
export function StripeProvider({ children }: { children: ReactNode }) {
  // Without a key, stripe={null} keeps the context available (useElements() returns null)
  return (
    <Elements
      stripe={getStripe()}
      options={{
        mode: "payment",
        amount: MIN_PENCE,
        currency: "gbp",
        appearance: stripeAppearance,
        fonts: stripeFonts,
        paymentMethodCreation: "manual",
        // Card payments only — no wallets or other methods
        allowedPaymentMethodTypes: ["card"],
      }}
    >
      {children}
    </Elements>
  );
}

const methods = ["Visa", "Mastercard", "Amex"];

/** The "Payment" panel on the Review & pay step. */
export function PaymentSection({ total, error }: { total: number; error?: string }) {
  return (
    <section aria-labelledby="payment-title" className="rounded-card bg-paper p-5 shadow-card ring-1 ring-line sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="payment-title" className="flex items-center gap-2 font-display text-h4">
          <CreditCard className="size-5 text-teal-deep" aria-hidden="true" /> Payment
        </h3>
        <p className="flex items-center gap-1.5 text-sm font-bold text-ink-soft">
          <Lock className="size-4" aria-hidden="true" /> Secure checkout by Stripe
        </p>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Accepted cards">
        {methods.map((m) => (
          <li key={m} className="rounded-md border border-line bg-cream px-2 py-0.5 text-xs font-bold text-ink-soft">
            {m}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        {stripeKey ? (
          <LivePaymentElement total={total} />
        ) : (
          <>
            <PaymentPreview />
            <PreviewNote />
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-chip bg-magenta/10 p-3 text-sm font-bold text-magenta-deep">
          {error}
        </p>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs text-ink-soft">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal-deep" aria-hidden="true" />
        Card details are entered in Stripe’s secure form and are never seen or stored by {site.name}.
      </p>
    </section>
  );
}

function LivePaymentElement({ total }: { total: number }) {
  const elements = useElements();
  const parent = useBookingStore((s) => s.parent);

  // Keep the amount Stripe holds in sync with the basket
  useEffect(() => {
    elements?.update({ amount: Math.max(total, MIN_PENCE) });
  }, [elements, total]);

  return (
    <PaymentElement
      options={{
        layout: { type: "tabs" },
        wallets: { applePay: "never", googlePay: "never", link: "never" },
        business: { name: site.name },
        defaultValues: {
          billingDetails: {
            name: `${parent.firstName} ${parent.lastName}`.trim(),
            email: parent.email,
            phone: parent.phone,
            address: { postal_code: parent.postcode, country: "GB" },
          },
        },
      }}
    />
  );
}

/**
 * Shown until a Stripe publishable key is added: a non-interactive picture of the payment form,
 * so the page can be reviewed. Nothing here accepts input.
 */
function PaymentPreview() {
  const box = "mt-1.5 rounded-[10px] border-2 border-line bg-cream/60 px-3.5 py-3 text-ink-soft/70";
  return (
    <div aria-hidden="true" className="select-none">
      <div>
        <div>
          <p className="text-sm font-bold">Card number</p>
          <p className={box}>1234 1234 1234 1234</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-bold">Expiry date</p>
            <p className={box}>MM / YY</p>
          </div>
          <div>
            <p className="text-sm font-bold">Security code</p>
            <p className={box}>CVC</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-bold">Country</p>
            <p className={box}>United Kingdom</p>
          </div>
          <div>
            <p className="text-sm font-bold">Postcode</p>
            <p className={box}>CT2 8QA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewNote() {
  return (
    <p className="mt-3 rounded-chip bg-spotlight/20 p-3 text-sm text-ink">
      <strong>Preview:</strong> add a Stripe publishable test key (<code>VITE_STRIPE_PUBLISHABLE_KEY</code>) to show the real Stripe card form here.
    </p>
  );
}
