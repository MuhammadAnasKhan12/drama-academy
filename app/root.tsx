import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { CurtainIntro } from "./components/anim/CurtainIntro";
import { CurtainTransition } from "./components/anim/CurtainTransition";
import { SmoothScroll } from "./components/anim/SmoothScroll";
import { Footer } from "./components/layout/Footer";
import { MobileCtaBar } from "./components/layout/MobileCtaBar";
import { Navbar } from "./components/layout/Navbar";
import { NotFound } from "./components/NotFound";
import { INTRO_KEY } from "./stores/intro";
import { useHydrateStores } from "./stores/hydrate";

/** Build time, so date-based content renders identically at pre-render and hydration (see useNow). */
export async function loader() {
  return { builtAt: new Date().toISOString() };
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

/**
 * Runs before first paint: decides whether the curtain intro plays (home page only,
 * once per session, never with reduced motion). Without JS it never runs → no intro.
 */
const introScript = `try{var m=matchMedia('(prefers-reduced-motion: reduce)').matches,s=JSON.parse(sessionStorage.getItem('${INTRO_KEY}')||'{}');if(!m&&!(s.state&&s.state.seen)&&location.pathname==='/')document.documentElement.classList.add('intro-pending')}catch(e){}`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the intro script may add a class to <html> before React loads
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0e0b1f" />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  useHydrateStores();
  return (
    <SmoothScroll>
      <CurtainIntro />
      <CurtainTransition />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
    </SmoothScroll>
  );
}

export default function App() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Shell>
        <NotFound />
      </Shell>
    );
  }
  const details = import.meta.env.DEV && error instanceof Error ? error.message : "Something went wrong backstage.";
  return (
    <main className="container-site grid min-h-screen place-items-center py-24 text-center">
      <div>
        <h1 className="text-h1">Oops — a missed cue!</h1>
        <p className="mt-4 text-lead text-ink-soft">{details}</p>
        <a href="/" className="mt-8 inline-block font-bold underline">Back to the home page</a>
      </div>
    </main>
  );
}
