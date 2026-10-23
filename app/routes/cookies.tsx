import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Cookie Policy",
    description: "How Drama Kids Canterbury uses cookies and similar technologies.",
    path: "/cookies",
  });

export default function CookiesPage() {
  return (
    <PageHero eyebrow={"Legal"} title={"Cookie Policy"} intro="This page is coming in the next build step." />
  );
}
