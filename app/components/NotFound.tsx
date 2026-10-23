import { Drama } from "lucide-react";
import { Sparkles } from "~/components/anim/Sparkles";
import { Spotlight } from "~/components/anim/Spotlight";
import { ButtonLink } from "~/components/ui/Button";

export function NotFound() {
  return (
    <section className="stage-texture relative grid min-h-[100svh] place-items-center overflow-hidden bg-stage pt-[var(--spacing-nav)] text-center">
      <Spotlight />
      <Sparkles />
      <div className="container-site relative">
        <Drama className="mx-auto size-14 text-spotlight" aria-hidden="true" />
        <p className="eyebrow mt-6 text-spotlight">Error 404</p>
        <h1 className="mt-3 text-h1 text-cream">This scene is missing from the script!</h1>
        <p className="mx-auto mt-5 max-w-xl text-lead text-mist">
          We've searched the wings, the dressing rooms and under the stage, but this page has wandered off. Let's get you back to the show.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink to="/" size="lg">Back to centre stage</ButtonLink>
          <ButtonLink to="/classes" size="lg" variant="ghost-light">See our classes</ButtonLink>
        </div>
      </div>
    </section>
  );
}
