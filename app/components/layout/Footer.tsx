import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "~/components/ui/Logo";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "~/components/ui/SocialIcons";
import { nav, site } from "~/lib/site";

const legal = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Safeguarding", to: "/safeguarding" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Cookies", to: "/cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="stage-texture relative bg-stage pt-16 pb-28 text-mist md:pb-10">
      <div className="container-site grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="inline-block w-36" aria-label="Drama Kids Canterbury — home">
            <Logo />
          </Link>
          <p className="mt-12 max-w-xs">
            Kids drama classes, performances and holiday clubs in Canterbury, Kent — for ages {site.ages.min}–{site.ages.max}.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-stage-2 px-3 py-1.5 text-sm font-bold text-cream ring-1 ring-white/10">
            <ShieldCheck className="size-4 text-teal" /> All staff enhanced DBS-checked
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 font-display text-h4 text-cream">Explore</h2>
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-spotlight">{n.label}</Link>
              </li>
            ))}
            <li><Link to="/book" className="hover:text-spotlight">Book now</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-display text-h4 text-cream">Legal</h2>
          <ul className="space-y-2">
            {legal.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-spotlight">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-h4 text-cream">Say hello</h2>
          <address className="space-y-3 not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-teal" />
              <span>
                <strong className="text-cream">Weekly class:</strong> {site.venues.ashVillageHall.name}, {site.venues.ashVillageHall.town}
                <br />
                <strong className="text-cream">Holiday clubs:</strong> {site.venues.canterburyAcademy.name}, {site.venues.canterburyAcademy.street}, {site.venues.canterburyAcademy.postcode}
              </span>
            </p>
            <a href={site.contact.phoneHref} className="flex items-center gap-3 hover:text-spotlight">
              <Phone className="size-4 text-teal" /> {site.contact.phone}
            </a>
            <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 break-all hover:text-spotlight">
              <Mail className="size-4 shrink-0 text-teal" /> {site.contact.email}
            </a>
          </address>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.contact.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
              { href: site.contact.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: site.contact.facebook, label: "Facebook", Icon: FacebookIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid size-11 place-items-center rounded-full bg-stage-2 text-cream ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-magenta"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-site mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm sm:flex-row sm:justify-between">
        <p>© {year} {site.name}. All rights reserved.</p>
        <p>Made with jazz hands in Canterbury ✨</p>
      </div>
    </footer>
  );
}
