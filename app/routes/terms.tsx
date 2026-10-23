import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Terms & Conditions",
    description: "Booking, payment and cancellation terms for Drama Kids Canterbury classes and camps.",
    path: "/terms",
  });

export default function TermsPage() {
  return (
    <PageHero eyebrow={"Legal"} title={"Terms & Conditions"} intro="This page is coming in the next build step." />
  );
}
