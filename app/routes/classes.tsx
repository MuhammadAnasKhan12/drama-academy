import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Kids drama classes in Canterbury",
    description: "Wednesday Drama Club in Canterbury for ages 4–11, 4–5pm at Ash Village Hall. £10.50 a session — book online.",
    path: "/classes",
  });

export default function ClassesPage() {
  return (
    <PageHero eyebrow={"Weekly classes"} title={"Drama Classes"} intro="This page is coming in the next build step." />
  );
}
