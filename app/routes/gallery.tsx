import { PageHero } from "~/components/ui/PageHero";
import { seo } from "~/lib/seo";

export const meta = () =>
  seo({
    title: "Photo gallery",
    description: "Photos from Drama Kids Canterbury classes, camps and shows.",
    path: "/gallery",
  });

export default function GalleryPage() {
  return (
    <PageHero eyebrow={"Behind the scenes"} title={"Gallery"} intro="This page is coming in the next build step." />
  );
}
