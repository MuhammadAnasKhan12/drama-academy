import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Book a free trial class",
    description: "Book a free trial drama class in Canterbury, or get in touch with any questions.",
    path: "/book",
  });

export default function BookPage() {
  return (
    <PageHero eyebrow={"Contact us"} title={"Book a Free Trial"} intro="This page is coming in the next build step." />
  );
}
