import type { ChildDraft } from "~/stores/booking";
import type { BookableItem } from "./catalogue";

export type PriceLine = { childId: string; childName: string; item: BookableItem; pence: number };

/** One line per child per booking. Prices are per child; no discounts are applied. */
export function priceLines(children: ChildDraft[], byId: Map<string, BookableItem>): PriceLine[] {
  return children.flatMap((c, i) =>
    c.items
      .map((id) => byId.get(id))
      .filter((item): item is BookableItem => !!item)
      .map((item) => ({
        childId: c.id,
        childName: c.firstName.trim() || `Child ${i + 1}`,
        item,
        pence: item.pricePence,
      })),
  );
}

export const totalPence = (lines: PriceLine[]) => lines.reduce((sum, l) => sum + l.pence, 0);
