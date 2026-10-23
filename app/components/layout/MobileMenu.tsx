import { Mail, Phone } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { NavLink, useLocation } from "react-router";
import { Sparkles } from "~/components/anim/Sparkles";
import { ButtonLink } from "~/components/ui/Button";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "~/components/ui/SocialIcons";
import { ease, gsap, prefersReducedMotion, useGSAP } from "~/lib/gsap";
import { nav, site } from "~/lib/site";
import { useUiStore } from "~/stores/ui";

/**
 * Full-screen menu that opens as a spotlight circle growing from the menu button.
 * Escape closes it, focus is kept inside while open and returned to the button on close.
 */
export function MobileMenu({ returnFocusTo }: { returnFocusTo: RefObject<HTMLButtonElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { menuOpen, setMenuOpen } = useUiStore();
  const { pathname } = useLocation();

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(ref.current, { visibility: "visible" })
        .fromTo(
          ref.current,
          { clipPath: "circle(0% at calc(100% - 2.6rem) 2.2rem)" },
          { clipPath: "circle(150% at calc(100% - 2.6rem) 2.2rem)", duration: 0.7, ease: ease.inOut },
        )
        .from("[data-menu-item]", { y: 40, autoAlpha: 0, rotate: 3, stagger: 0.05, duration: 0.6, ease: ease.playful }, 0.25);
    },
    { scope: ref },
  );

  useEffect(() => {
    const t = tl.current;
    const lenis = useUiStore.getState().lenis;
    if (!t) return;
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      prefersReducedMotion() ? t.progress(1) : t.timeScale(1).play();
      ref.current?.querySelector<HTMLElement>("a")?.focus();
    } else if (t.progress() > 0) {
      lenis?.start();
      document.documentElement.style.overflow = "";
      prefersReducedMotion() ? t.progress(0) : t.timeScale(1.8).reverse();
      returnFocusTo.current?.focus();
    }
  }, [menuOpen, returnFocusTo]);

  // Close on navigation
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "Tab" && ref.current) {
        const focusables = [
          returnFocusTo.current,
          ...ref.current.querySelectorAll<HTMLElement>("a, button"),
        ].filter(Boolean) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen, returnFocusTo]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!menuOpen}
      inert={!menuOpen}
      className="stage-texture invisible fixed inset-0 z-[60] overflow-y-auto bg-stage xl:hidden"
      data-lenis-prevent
    >
      <Sparkles count={5} />
      <div className="container-site relative flex min-h-full flex-col pt-[calc(var(--spacing-nav)+2rem)] pb-10">
        <ul className="flex flex-col gap-1">
          {[{ label: "Home", to: "/" }, ...nav, { label: "Contact", to: "/book" }].map((item) => (
            <li key={item.to} data-menu-item>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block py-1.5 font-display text-h3 transition-colors hover:text-spotlight ${isActive ? "text-spotlight" : "text-cream"}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div data-menu-item className="mt-8">
          <ButtonLink to="/book" size="lg" className="w-full sm:w-auto">
            Book a Free Trial
          </ButtonLink>
        </div>
        <div data-menu-item className="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-10 text-mist">
          <a href={site.contact.phoneHref} className="inline-flex items-center gap-2 hover:text-cream">
            <Phone className="size-4" /> {site.contact.phone}
          </a>
          <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 hover:text-cream">
            <Mail className="size-4" /> Email us
          </a>
          <div className="flex gap-3">
            <a href={site.contact.whatsapp} aria-label="WhatsApp" className="hover:text-cream"><WhatsAppIcon className="size-6" /></a>
            <a href={site.contact.instagram} aria-label="Instagram" className="hover:text-cream"><InstagramIcon className="size-6" /></a>
            <a href={site.contact.facebook} aria-label="Facebook" className="hover:text-cream"><FacebookIcon className="size-6" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
