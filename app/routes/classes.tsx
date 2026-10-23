import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Kids drama classes in Canterbury",
    description: "Weekly drama classes in Canterbury for ages 4–16: Mini Stars, Juniors and Seniors. Book a free trial class today.",
    path: "/classes",
  });

export default function ClassesPage() {
  return (
    <PageHero eyebrow={"Weekly classes"} title={"Drama Classes"} intro="This page is coming in the next build step." />
  );
}
