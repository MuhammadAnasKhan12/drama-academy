import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Reveal } from "~/components/anim/Reveal";
import { Accordion } from "~/components/ui/Accordion";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { faqs } from "~/data/faqs";

export const homeFaqs = faqs.filter((f) => f.home);

export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="on-light section-y relative bg-cream-2">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading
            eyebrow="Questions?"
            title={<span id="faq-title">Everything parents ask us</span>}
            intro="Can’t see your question? Drop us a message — we’re always happy to chat."
          />
          <Link to="/parents" className="group mt-6 inline-flex items-center gap-2 font-bold text-magenta-deep hover:underline">
            Visit the Parents’ Hub <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <Reveal>
          <Accordion items={homeFaqs} />
        </Reveal>
      </div>
    </section>
  );
}
