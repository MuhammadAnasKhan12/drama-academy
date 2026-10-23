import { Phone } from "lucide-react";
import { useLocation } from "react-router";
import { ButtonLink } from "~/components/ui/Button";
import { WhatsAppIcon } from "~/components/ui/SocialIcons";
import { site } from "~/lib/site";
import { useUiStore } from "~/stores/ui";

/** Thumb-friendly booking bar pinned to the bottom of the screen on phones. */
export function MobileCtaBar() {
  const menuOpen = useUiStore((s) => s.menuOpen);
  const { pathname } = useLocation();
  if (pathname === "/book") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-stage/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        menuOpen ? "translate-y-full" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <ButtonLink to="/book" className="flex-1 shadow-none" variant="primary">
          Book a Free Trial
        </ButtonLink>
        <a href={site.contact.whatsapp} aria-label="Message us on WhatsApp" className="grid size-11 place-items-center rounded-full bg-[#25D366] text-stage">
          <WhatsAppIcon className="size-6" />
        </a>
        <a href={site.contact.phoneHref} aria-label={`Call us on ${site.contact.phone}`} className="grid size-11 place-items-center rounded-full bg-stage-3 text-cream">
          <Phone className="size-5" />
        </a>
      </div>
    </div>
  );
}
