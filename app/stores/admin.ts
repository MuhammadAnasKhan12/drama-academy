import { create } from "zustand";
import * as api from "~/lib/admin/api";
import { adminItems } from "~/lib/admin/items";
import type { AdminBooking, AdminItem, BookingStatus } from "~/lib/admin/types";

/** Admin data cache: bookings loaded once, updated in place when the admin changes something. */

type AdminState = {
  items: AdminItem[];
  bookings: AdminBooking[];
  loading: boolean;
  error: string;
  loaded: boolean;
  /** Item ids where online booking has been closed by the admin */
  closed: string[];
  /** Short message shown in the corner after an action */
  toast: string;

  load: () => Promise<void>;
  updateStatus: (id: string, status: BookingStatus) => Promise<void>;
  toggleOpen: (itemId: string) => Promise<void>;
  showToast: (msg: string) => void;
};

/** Who is signed in. With Cloudflare Access the backend will supply the real email. */
export const ADMIN_USER = "admin@dramakids.co.uk";

export const useAdminStore = create<AdminState>()((set, get) => ({
  items: adminItems(),
  bookings: [],
  loading: false,
  error: "",
  loaded: false,
  closed: [],
  toast: "",

  load: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true, error: "" });
    try {
      const [bookings, closed] = await Promise.all([api.fetchBookings(), api.fetchClosedItems()]);
      set({ bookings, closed, loaded: true });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Could not load bookings" });
    } finally {
      set({ loading: false });
    }
  },

  updateStatus: async (id, status) => {
    const fromServer = await api.setBookingStatus(id, status);
    const entry = { at: new Date().toISOString(), by: ADMIN_USER, action: `Marked as ${status}` };
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? (fromServer ?? { ...b, status, log: [entry, ...b.log] }) : b)) }));
    get().showToast(`Booking marked as ${status}`);
  },

  toggleOpen: async (itemId) => {
    const open = get().closed.includes(itemId);
    await api.setItemOpen(itemId, open);
    set((s) => ({ closed: open ? s.closed.filter((x) => x !== itemId) : [...s.closed, itemId] }));
    get().showToast(open ? "Online booking reopened" : "Online booking closed");
  },

  showToast: (toast) => {
    set({ toast });
    setTimeout(() => get().toast === toast && set({ toast: "" }), 3000);
  },
}));

/** True until the first load finishes — screens show loading placeholders instead of "empty" */
export const useAdminLoading = () => useAdminStore((s) => s.loading || !s.loaded);

/** Statuses that hold a place (pending = payment in progress) */
export const holdsPlace = (s: BookingStatus) => s === "paid" || s === "pending";
