import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Drama holiday camps in Canterbury",
    description: "Fun-packed drama holiday camps in Canterbury every half-term, Easter and summer, ending in a showcase for families.",
    path: "/holiday-camps",
  });

export default function HolidayCampsPage() {
  return (
    <PageHero eyebrow={"Half-term, Easter & summer"} title={"Holiday Camps"} intro="This page is coming in the next build step." />
  );
}
