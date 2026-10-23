import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const INTRO_KEY = "dk-intro";

type IntroState = {
  /** Has the curtain intro been shown this browser session? (persisted) */
  seen: boolean;
  /** Is the intro finished (or skipped / not needed) for this page load? Hero reveals wait on this. */
  done: boolean;
  markSeen: () => void;
  setDone: (done: boolean) => void;
};

export const useIntroStore = create<IntroState>()(
  persist(
    (set) => ({
      seen: false,
      done: false,
      markSeen: () => set({ seen: true }),
      setDone: (done) => set({ done }),
    }),
    {
      name: INTRO_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ seen: s.seen }),
      // Pages are pre-rendered at build time, so we rehydrate on the client after mount.
      skipHydration: true,
    },
  ),
);
