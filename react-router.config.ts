import type { Config } from "@react-router/dev/config";

export default {
  // Static site: every page is pre-rendered to HTML at build time (great for SEO),
  // then React takes over in the browser. No server needed — deploy build/client anywhere.
  ssr: false,
  prerender: true,
} satisfies Config;
