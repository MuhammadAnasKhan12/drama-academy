import { CalendarRange, ClipboardList, ExternalLink, LayoutDashboard, LogOut, Menu, ShieldCheck, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { SignIn } from "~/components/admin/SignIn";
import { Logo } from "~/components/ui/Logo";
import { isSampleData } from "~/lib/admin/api";
import { site } from "~/lib/site";
import { useAdminStore } from "~/stores/admin";

export const meta = () => [{ title: `Admin | ${site.name}` }, { name: "robots", content: "noindex, nofollow" }];

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/bookings", label: "Bookings", icon: Ticket },
  { to: "/admin/registers", label: "Registers", icon: ClipboardList },
  { to: "/admin/clubs", label: "Clubs & places", icon: CalendarRange },
];

/**
 * Admin shell: sidebar on desktop, slide-in menu on phones.
 * Shows the sign-in form until an admin signs in; the API also refuses admin requests without a session.
 */
export default function AdminLayout() {
  const { user, authChecked, checkSession, signOut, load } = useAdminStore();
  const toast = useAdminStore((s) => s.toast);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    checkSession();
  }, [checkSession]);
  useEffect(() => {
    if (user) load();
  }, [user, load]);
  useEffect(() => setMenuOpen(false), [pathname]);

  if (!authChecked) {
    return (
      <div className="grid min-h-screen place-items-center bg-stage" aria-busy="true">
        <p className="font-bold text-mist">Loading…</p>
      </div>
    );
  }
  if (!user) return <SignIn />;

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1 px-3">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-xl px-3 font-bold transition-colors ${
              isActive ? "bg-spotlight text-ink" : "text-mist hover:bg-white/10 hover:text-cream"
            }`
          }
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-3 pb-4">
        <Link to="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 font-bold text-mist hover:bg-white/10 hover:text-cream">
          <ExternalLink className="size-5" aria-hidden="true" /> View website
        </Link>
        <p className="flex items-center gap-3 px-3 py-2 text-sm text-mist">
          <ShieldCheck className="size-5 shrink-0 text-teal" aria-hidden="true" />
          <span className="min-w-0 truncate" title={user}>{user}</span>
        </p>
        <button type="button" onClick={signOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 font-bold text-mist hover:bg-white/10 hover:text-cream">
          <LogOut className="size-5" aria-hidden="true" /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream text-ink lg:grid lg:grid-cols-[16rem_1fr] print:block print:bg-paper">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-stage lg:flex print:hidden">
        <Link to="/admin" className="flex items-center gap-3 px-6 py-6" aria-label="Admin dashboard">
          <span className="w-14"><Logo showPlace={false} /></span>
          <span className="font-display text-cream">Admin</span>
        </Link>
        {nav}
      </aside>

      {/* Mobile top bar + slide-in menu */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-stage px-4 lg:hidden print:hidden">
        <Link to="/admin" className="flex items-center gap-2" aria-label="Admin dashboard">
          <span className="w-12"><Logo showPlace={false} /></span>
          <span className="font-display text-cream">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={menuOpen}
          className="grid size-11 place-items-center rounded-xl text-cream hover:bg-white/10"
        >
          <Menu className="size-6" />
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-stage pt-4">
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close admin menu" className="mr-3 mb-2 grid size-11 place-items-center self-end rounded-xl text-cream hover:bg-white/10">
              <X className="size-6" />
            </button>
            {nav}
          </div>
        </div>
      )}

      <div className="min-w-0">
        {isSampleData() && (
          <p className="bg-spotlight px-4 py-2 text-center text-sm font-bold text-ink print:hidden">
            Sample data — the booking backend isn’t connected yet. Names and details below are made up.
          </p>
        )}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:p-0">
          <Outlet />
        </main>
      </div>

      {toast && (
        <p role="status" className="fixed right-4 bottom-4 z-50 rounded-xl bg-ink px-4 py-3 font-bold text-cream shadow-lift print:hidden">
          {toast}
        </p>
      )}
    </div>
  );
}
