import { create } from "zustand";
import * as api from "~/lib/admin/api";
import { adminItems } from "~/lib/admin/items";
import type { AdminBooking, AdminItem, BookingStatus } from "~/lib/admin/types";

/** Admin sign-in and data cache: bookings loaded once, updated in place when the admin changes something. */

type AdminState = {
  /** Signed-in admin's email (null = show the sign-in form) */
  user: string | null;
  /** False until we've asked the server who is signed in */
  authChecked: boolean;
  items: AdminItem[];
  bookings: AdminBooking[];
  loading: boolean;
  error: string;
  loaded: boolean;
  /** Item ids where online booking has been closed by the admin */
  closed: string[];
  /** Short message shown in the corner after an action */
  toast: string;

  checkSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  load: () => Promise<void>;
  updateStatus: (id: string, status: BookingStatus) => Promise<void>;
  toggleOpen: (itemId: string) => Promise<void>;
  showToast: (msg: string) => void;
};

/** Back to the sign-in form, forgetting everything loaded (children's data shouldn't linger) */
const signedOut = { user: null, bookings: [], closed: [], loaded: false, error: "" };

export const useAdminStore = create<AdminState>()((set, get) => {
  /** Runs an admin request; if the session has ended, shows the sign-in form instead */
  const guard = async <T,>(run: () => Promise<T>): Promise<T> => {
    try {
      return await run();
    } catch (e) {
      if (e instanceof api.SignedOutError) set(signedOut);
      throw e;
    }
  };

  return {
    user: null,
    authChecked: false,
    items: adminItems(),
    bookings: [],
    loading: false,
    error: "",
    loaded: false,
    closed: [],
    toast: "",

    checkSession: async () => {
      try {
        set({ user: await api.fetchSession() });
      } catch {
        set({ user: null });
      } finally {
        set({ authChecked: true });
      }
    },

    signIn: async (email, password) => {
      const user = await api.signIn(email, password);
      set({ ...signedOut, user });
    },

    signOut: async () => {
      await api.signOut().catch(() => undefined);
      set(signedOut);
    },

    load: async () => {
      if (get().loading || get().loaded || !get().user) return;
      set({ loading: true, error: "" });
      try {
        const [bookings, closed] = await guard(() => Promise.all([api.fetchBookings(), api.fetchClosedItems()]));
        set({ bookings, closed, loaded: true });
      } catch (e) {
        if (!(e instanceof api.SignedOutError)) set({ error: e instanceof Error ? e.message : "Could not load bookings" });
      } finally {
        set({ loading: false });
      }
    },

    updateStatus: async (id, status) => {
      const fromServer = await guard(() => api.setBookingStatus(id, status));
      const entry = { at: new Date().toISOString(), by: get().user ?? "", action: `Marked as ${status}` };
      set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? (fromServer ?? { ...b, status, log: [entry, ...b.log] }) : b)) }));
      get().showToast(`Booking marked as ${status}`);
    },

    toggleOpen: async (itemId) => {
      const open = get().closed.includes(itemId);
      await guard(() => api.setItemOpen(itemId, open));
      set((s) => ({ closed: open ? s.closed.filter((x) => x !== itemId) : [...s.closed, itemId] }));
      get().showToast(open ? "Online booking reopened" : "Online booking closed");
    },

    showToast: (toast) => {
      set({ toast });
      setTimeout(() => get().toast === toast && set({ toast: "" }), 3000);
    },
  };
});

/** True until the first load finishes — screens show loading placeholders instead of "empty" */
export const useAdminLoading = () => useAdminStore((s) => s.loading || !s.loaded);

/** Statuses that hold a place (pending = payment in progress) */
export const holdsPlace = (s: BookingStatus) => s === "paid" || s === "pending";
