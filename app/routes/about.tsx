import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "About us — kids drama in Canterbury",
    description: "Meet the friendly, DBS-checked team behind Drama Kids Canterbury and discover why drama builds confidence for life.",
    path: "/about",
  });

export default function AboutPage() {
  return (
    <PageHero eyebrow={"Our story"} title={"About Us"} intro="This page is coming in the next build step." />
  );
}
