import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Shows and productions",
    description: "Upcoming children’s theatre shows in Canterbury by Drama Kids — dates, venues and tickets.",
    path: "/shows",
  });

export default function ShowsPage() {
  return (
    <PageHero eyebrow={"On stage"} title={"Shows & Productions"} intro="This page is coming in the next build step." />
  );
}
