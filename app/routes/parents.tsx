import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Parents’ Hub",
    description: "Term dates, FAQs, what to wear, drop-off and pick-up, safeguarding and policies for Drama Kids Canterbury families.",
    path: "/parents",
  });

export default function ParentsPage() {
  return (
    <PageHero eyebrow={"Everything in one place"} title={"Parents’ Hub"} intro="This page is coming in the next build step." />
  );
}
