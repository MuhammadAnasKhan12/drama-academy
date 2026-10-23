import { NotFound } from "~/components/NotFound";

export const meta = () => [{ title: "Page not found | Drama Kids Canterbury" }, { name: "robots", content: "noindex" }];

export default function NotFoundRoute() {
  return <NotFound />;
}
