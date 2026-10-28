import { CalendarCheck, CircleAlert, Clock, Mail, PartyPopper, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Sparkles } from "~/components/anim/Sparkles";
import { ButtonLink } from "~/components/ui/Button";
import { site } from "~/lib/site";
import { useBookingStore } from "~/stores/booking";

export const meta = () => [{ title: `Your booking | ${site.name}` }, { name: "robots", content: "noindex" }];

/**
 * The page parents land on after paying. Stripe adds `redirect_status` to the URL when it sends
 * someone back (after 3-D Secure or a bank redirect):
 *   succeeded (default) · processing · failed / requires_payment_method
 * In demo mode the booking details come from the booking store.
 */
type Outcome = "succeeded" | "processing" | "failed";

const readOutcome = (status: string | null): Outcome =>
  status === "processing" ? "processing" : status === "failed" || status === "requires_payment_method" ? "failed" : "succeeded";

export default function BookingConfirmation() {
  const confirmation = useBookingStore((s) => s.confirmation);
  const { search } = useLocation();
  // Read the query string after mount: the pre-rendered HTML can't know it
  const [state, setState] = useState<{ outcome: Outcome; ref: string | null } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(search);
    setState({ outcome: readOutcome(params.get("redirect_status")), ref: params.get("ref") });
  }, [search]);

  if (!state) return <section aria-busy="true" className="min-h-[100svh] bg-stage" />;
  const { outcome } = state;
  const reference = confirmation?.reference ?? state.ref;

  return (
    <section className="stage-texture relative overflow-hidden bg-stage pt-[calc(var(--spacing-nav)+3rem)] pb-24">
      {outcome === "succeeded" && <Sparkles />}
      <div className="container-site relative max-w-3xl">
        {outcome === "succeeded" && <Succeeded reference={reference} />}
        {outcome === "processing" && <Processing reference={reference} />}
        {outcome === "failed" && <Failed />}

        {outcome === "succeeded" && confirmation && (
          <div className="mt-8 rounded-card bg-cream p-6 text-ink">
            <h2 className="font-display text-h4">What you booked</h2>
            <ul className="mt-3 divide-y divide-line">
              {confirmation.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-2.5">
                  <span>
                    <span className="block font-bold">{l.item}</span>
                    <span className="text-sm text-ink-soft">{l.child}</span>
                  </span>
                  <span className="font-bold">{l.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t-2 border-ink pt-3 font-bold">
              <span>Total paid</span>
              <span>{confirmation.total}</span>
            </p>
          </div>
        )}

        <p className="mt-8 flex gap-3 text-mist">
          <Mail className="size-5 shrink-0 text-teal" aria-hidden="true" />
          Questions? Email {site.contact.email} or call/text {site.contact.phone}.
        </p>

        {confirmation?.demo && <DemoOutcomes current={outcome} />}
      </div>
    </section>
  );
}

function Succeeded({ reference }: { reference: string | null }) {
  const confirmation = useBookingStore((s) => s.confirmation);
  return (
    <>
      <PartyPopper className="size-12 text-spotlight" aria-hidden="true" />
      <p className="eyebrow mt-5 text-spotlight">{confirmation?.demo ? "Demo booking" : "Payment received"}</p>
      <h1 className="mt-2 text-h1 text-cream">You’re on the cast list!</h1>
      <p className="mt-4 text-lead text-mist">
        {reference ? (
          <>
            Your booking reference is <strong className="text-cream">{reference}</strong>.
          </>
        ) : (
          <>Thank you for booking with {site.name}.</>
        )}
        {confirmation?.email && (
          <>
            {" "}A receipt and confirmation are on their way to <strong className="text-cream">{confirmation.email}</strong>.
          </>
        )}
      </p>
      {confirmation?.demo && (
        <p className="mt-6 rounded-chip bg-spotlight/15 p-4 text-sm text-cream ring-1 ring-spotlight/40">
          This was a demo: Stripe isn’t connected to a backend yet, so no money was taken and nothing was saved.
        </p>
      )}
      <p className="mt-6 flex gap-3 text-mist">
        <CalendarCheck className="size-5 shrink-0 text-teal" aria-hidden="true" />
        We’ll email final details — times, what to bring and venue information — before your child’s first session.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink to="/book">Book something else</ButtonLink>
        <ButtonLink to="/" variant="ghost-light">Back to the home page</ButtonLink>
      </div>
    </>
  );
}

function Processing({ reference }: { reference: string | null }) {
  return (
    <>
      <Clock className="size-12 text-spotlight" aria-hidden="true" />
      <p className="eyebrow mt-5 text-spotlight">Payment processing</p>
      <h1 className="mt-2 text-h1 text-cream">Nearly there…</h1>
      <p className="mt-4 text-lead text-mist">
        Your bank is still confirming the payment. Your places are being held, and we’ll email you as soon as it’s complete — usually within a few
        minutes.{reference && <> Your reference is <strong className="text-cream">{reference}</strong>.</>}
      </p>
      <p className="mt-4 text-mist">There’s no need to pay again. If you don’t hear from us within a day, please get in touch.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink to="/" variant="ghost-light">Back to the home page</ButtonLink>
      </div>
    </>
  );
}

function Failed() {
  return (
    <>
      <CircleAlert className="size-12 text-magenta" aria-hidden="true" />
      <p className="eyebrow mt-5 text-spotlight">Payment not completed</p>
      <h1 className="mt-2 text-h1 text-cream">That payment didn’t go through</h1>
      <p className="mt-4 text-lead text-mist">
        Don’t worry — you haven’t been charged and your booking details are saved. This can happen if the card was declined or the bank check
        wasn’t finished. Please try again or use a different card.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink to="/book" icon={<RotateCcw className="size-4" aria-hidden="true" />}>
          Try again
        </ButtonLink>
        <ButtonLink to="/" variant="ghost-light">Back to the home page</ButtonLink>
      </div>
    </>
  );
}

/** Demo only: lets the client preview every payment outcome screen. */
function DemoOutcomes({ current }: { current: Outcome }) {
  const outcomes: { key: Outcome; label: string }[] = [
    { key: "succeeded", label: "Success" },
    { key: "processing", label: "Processing" },
    { key: "failed", label: "Failed" },
  ];
  return (
    <nav aria-label="Preview payment outcomes" className="mt-10 rounded-chip border border-dashed border-white/25 p-4 text-sm text-mist">
      <p className="font-bold text-cream">Demo: preview the other payment screens</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {outcomes.map((o) => (
          <li key={o.key}>
            <ButtonLink
              to={o.key === "succeeded" ? "/book/confirmation" : `/book/confirmation?redirect_status=${o.key}`}
              variant={o.key === current ? "primary" : "ghost-light"}
              className="min-h-9 px-4 text-sm shadow-none"
              aria-current={o.key === current ? "page" : undefined}
            >
              {o.label}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
