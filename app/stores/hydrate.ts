import { useEffect } from "react";
import { useBookingStore } from "./booking";
import { useIntroStore } from "./intro";

/** Rehydrate persisted stores once on the client (pages are pre-rendered without storage). */
export function useHydrateStores() {
  useEffect(() => {
    useIntroStore.persist.rehydrate();
    useBookingStore.persist.rehydrate();
  }, []);
}
