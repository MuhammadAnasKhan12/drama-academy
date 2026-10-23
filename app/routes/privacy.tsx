import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Privacy Policy",
    description: "How Drama Kids Canterbury collects, uses and protects your personal data under UK GDPR.",
    path: "/privacy",
  });

export default function PrivacyPage() {
  return (
    <PageHero eyebrow={"Legal"} title={"Privacy Policy"} intro="This page is coming in the next build step." />
  );
}
