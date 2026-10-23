import { useRef } from "react";
import { MagneticButton } from "~/components/anim/MagneticButton";
import { Sparkles } from "~/components/anim/Sparkles";
import { SplitHeading } from "~/components/anim/SplitHeading";
import { ButtonAnchor, ButtonLink } from "~/components/ui/Button";
import { WhatsAppIcon } from "~/components/ui/SocialIcons";
import { gsap, mq, useGSAP } from "~/lib/gsap";
import { site } from "~/lib/site";

/** Curtain-framed finale. The drapes draw back as the section scrolls into view. */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const st = { trigger: ref.current, start: "top 85%", end: "center center", scrub: 0.6 };
        gsap.fromTo("[data-cta-drape=left]", { xPercent: 45 }, { xPercent: 0, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-cta-drape=right]", { xPercent: -45 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-stage py-24 text-center md:py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_40%,rgb(255_200_61_/_0.22),transparent_70%)]" />
      <div aria-hidden="true" className="velvet absolute inset-x-0 top-0 z-10 h-8 border-b-4 border-spotlight-deep md:h-12" />
      <div aria-hidden="true" data-cta-drape="left" className="velvet absolute inset-y-0 left-0 z-[5] w-[20vw] max-w-60 rounded-br-[100%_25%] shadow-stage" />
      <div aria-hidden="true" data-cta-drape="right" className="velvet absolute inset-y-0 right-0 z-[5] w-[20vw] max-w-60 rounded-bl-[100%_25%] shadow-stage" />
      <Sparkles className="z-[1]" />

      <div className="container-site relative z-[6] mx-auto max-w-3xl px-[18vw] sm:px-[14vw] md:px-gutter">
        <p className="eyebrow text-spotlight">Your free trial awaits</p>
        <SplitHeading className="mt-3 text-h1 text-cream">
          <span id="cta-title">Ready for the spotlight?</span>
        </SplitHeading>
        <p className="mx-auto mt-6 max-w-xl text-lead text-mist">
          Come along to a free trial class — no commitment, no payment details. Just bring comfy clothes and a big imagination.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <MagneticButton strength={0.5}>
            <ButtonLink to="/book" size="lg" className="shadow-glow">
              Book a Free Trial
            </ButtonLink>
          </MagneticButton>
          <ButtonAnchor href={site.contact.whatsapp} target="_blank" rel="noreferrer" size="lg" variant="ghost-light" icon={<WhatsAppIcon className="size-5" />}>
            WhatsApp us
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}
