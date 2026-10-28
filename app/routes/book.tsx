import { BookingFlow } from "~/components/booking/BookingFlow";
import { StripeProvider } from "~/components/booking/PaymentSection";
import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Book drama classes & holiday clubs",
    description:
      "Book the Wednesday Drama Club (ages 4–11, £10.50 a session) or a drama holiday club in Canterbury (from £25 a day) online in a few minutes.",
    path: "/book",
  });

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book online"
        title="Book a class or holiday club"
        intro="Choose your sessions, tell us about your child and pay securely — it takes about three minutes."
      />
      <section className="on-light bg-cream pt-10 pb-32 md:pt-14 lg:pb-24">
        <div className="container-site">
          <StripeProvider>
            <BookingFlow />
          </StripeProvider>
        </div>
      </section>
    </>
  );
}
