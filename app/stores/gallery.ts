import { create } from "zustand";

export type GalleryFilter = "All" | "Classes" | "Camps" | "Shows";

type GalleryState = {
  filter: GalleryFilter;
  lightbox: number | null; // index into the filtered list
  setFilter: (filter: GalleryFilter) => void;
  open: (index: number) => void;
  close: () => void;
  step: (dir: 1 | -1, total: number) => void;
};

export const useGalleryStore = create<GalleryState>()((set) => ({
  filter: "All",
  lightbox: null,
  setFilter: (filter) => set({ filter, lightbox: null }),
  open: (lightbox) => set({ lightbox }),
  close: () => set({ lightbox: null }),
  step: (dir, total) => set((s) => (s.lightbox === null ? s : { lightbox: (s.lightbox + dir + total) % total })),
}));
