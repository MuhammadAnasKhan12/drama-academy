import { useEffect, useMemo, useState } from "react";
import { getAvailability } from "~/lib/booking/api";
import { buildCatalogue, type BookableItem } from "~/lib/booking/catalogue";
import { useNow } from "~/lib/useNow";

/** Bookable items for "now", plus places left per item (null while loading). */
export function useCatalogue() {
  const now = useNow();
  const catalogue = useMemo(() => buildCatalogue(now), [now]);
  const [places, setPlaces] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let live = true;
    getAvailability(catalogue)
      .then((p) => live && setPlaces(p))
      .catch(() => live && setPlaces(Object.fromEntries(catalogue.map((i) => [i.id, i.capacity]))));
    return () => {
      live = false;
    };
  }, [catalogue]);

  const byId = useMemo(() => new Map<string, BookableItem>(catalogue.map((i) => [i.id, i])), [catalogue]);
  return { catalogue, byId, places };
}
