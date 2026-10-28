import { Menu, X } from "lucide-react";
import { useRef } from "react";
import { Link, NavLink } from "react-router";
import { MagneticButton } from "~/components/anim/MagneticButton";
import { ButtonLink } from "~/components/ui/Button";
import { Logo } from "~/components/ui/Logo";
import { ScrollTrigger, useGSAP } from "~/lib/gsap";
import { nav } from "~/lib/site";
import { useUiStore } from "~/stores/ui";
import { MobileMenu } from "./MobileMenu";

/** Sticky navbar: hides when scrolling down, comes back when scrolling up. */
export function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { navHidden, setNavHidden, menuOpen, toggleMenu } = useUiStore();

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > 140 && !useUiStore.getState().menuOpen;
        if (hide !== useUiStore.getState().navHidden) setNavHidden(hide);
      },
    });
  });

  return (
    <>
      <a href="#main" className="sr-only-focusable rounded-full bg-spotlight px-4 py-2 font-bold text-ink">
        Skip to content
      </a>
      <header
        ref={ref}
        className={`fixed inset-x-0 top-0 transition-transform duration-500 ease-[var(--ease-out-soft)] ${
          navHidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${menuOpen ? "z-[70]" : "z-50"}`}
      >
        <div className="border-b border-white/10 bg-stage/85 backdrop-blur-md">
          <nav aria-label="Main" className="container-site flex h-[var(--spacing-nav)] items-center justify-between gap-4">
            <Link to="/" className="relative z-[61] block w-[4.5rem] shrink-0 sm:w-20" aria-label="Drama Kids Canterbury — home">
              <Logo showPlace={false} />
            </Link>

            <ul className="hidden items-center gap-1 xl:flex">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative rounded-full px-3.5 py-2 font-bold text-[0.95rem] transition-colors hover:text-spotlight ${
                        isActive ? "text-spotlight" : "text-cream"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <MagneticButton strength={0.25}>
                  <ButtonLink to="/book" variant="primary">
                    Book now
                  </ButtonLink>
                </MagneticButton>
              </div>
              <button
                ref={toggleRef}
                type="button"
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="relative z-[61] grid size-11 place-items-center rounded-full bg-stage-2 text-cream ring-1 ring-white/15 transition hover:bg-stage-3 xl:hidden"
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>
      <MobileMenu returnFocusTo={toggleRef} />
    </>
  );
}
