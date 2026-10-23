import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Safeguarding Policy",
    description: "How Drama Kids Canterbury keeps children safe, including our Designated Safeguarding Lead.",
    path: "/safeguarding",
  });

export default function SafeguardingPage() {
  return (
    <PageHero eyebrow={"Legal"} title={"Safeguarding Policy"} intro="This page is coming in the next build step." />
  );
}
