import type Lenis from "lenis";
import { create } from "zustand";

type UiState = {
  menuOpen: boolean;
  navHidden: boolean;
  /** Lenis instance, so any component can scrollTo / stop / start smooth scrolling */
  lenis: Lenis | null;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  setNavHidden: (hidden: boolean) => void;
  setLenis: (lenis: Lenis | null) => void;
};

export const useUiStore = create<UiState>()((set) => ({
  menuOpen: false,
  navHidden: false,
  lenis: null,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  setNavHidden: (navHidden) => set({ navHidden }),
  setLenis: (lenis) => set({ lenis }),
}));
