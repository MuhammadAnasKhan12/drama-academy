import type { ReactNode } from "react";
import type { BookingStatus } from "~/lib/admin/types";

/** Small building blocks shared by the admin screens. */

const statusStyles: Record<BookingStatus, string> = {
  paid: "bg-teal/15 text-teal-deep ring-teal/40",
  pending: "bg-spotlight/25 text-ink ring-spotlight-deep/40",
  failed: "bg-magenta/10 text-magenta-deep ring-magenta/30",
  refunded: "bg-blue/10 text-blue-deep ring-blue/30",
  cancelled: "bg-ink/5 text-ink-soft ring-ink/15",
  expired: "bg-ink/5 text-ink-soft ring-ink/15",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ring-1 ${statusStyles[status]}`}>
      {status === "pending" ? "Payment pending" : status === "expired" ? "Not paid (expired)" : status}
    </span>
  );
}

export function PageHeader({ title, intro, actions }: { title: string; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
      <div>
        <h1 className="font-display text-[1.75rem] leading-tight sm:text-[2rem]">{title}</h1>
        {intro && <p className="mt-1 text-ink-soft">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-paper shadow-card ring-1 ring-line ${className ?? ""}`}>{children}</div>;
}

export function StatCard({ label, value, note, icon }: { label: string; value: ReactNode; note?: ReactNode; icon: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-ink-soft">{label}</p>
        <span className="text-ink-soft" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-[2rem] leading-none">{value}</p>
      {note && <p className="mt-2 text-sm text-ink-soft">{note}</p>}
    </Card>
  );
}

/** Places-taken bar: teal → gold → magenta as it fills up */
export function CapacityBar({ taken, capacity }: { taken: number; capacity: number }) {
  const pct = capacity ? Math.min(100, Math.round((taken / capacity) * 100)) : 0;
  const color = pct >= 100 ? "bg-magenta" : pct >= 75 ? "bg-spotlight-deep" : "bg-teal";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line" role="meter" aria-valuemin={0} aria-valuemax={capacity} aria-valuenow={taken} aria-label="Places taken">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-14 text-right text-sm font-bold tabular-nums">
        {taken}/{capacity}
      </span>
    </div>
  );
}

export const adminButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors disabled:opacity-50";
export const btnPrimary = `${adminButton} bg-ink text-cream hover:bg-stage-3`;
export const btnSecondary = `${adminButton} bg-paper text-ink ring-1 ring-line hover:bg-cream-2`;
export const btnDanger = `${adminButton} bg-paper text-magenta-deep ring-1 ring-magenta/30 hover:bg-magenta/10`;

export const inputClass = "min-h-10 rounded-xl border-2 border-line bg-paper px-3 text-sm focus:border-blue-deep focus:outline-none";

export function LoadingRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-cream-2" />
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="p-8 text-center text-ink-soft">{children}</p>;
}
