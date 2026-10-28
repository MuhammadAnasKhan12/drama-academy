import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ageOn, type BookableItem } from "~/lib/booking/catalogue";

/**
 * Booking basket + form state for /book.
 * Kept in sessionStorage so a half-finished booking survives page changes (not browser restarts).
 */

export const STEPS = ["Choose", "Children", "Your details", "Review & pay"] as const;
export type Step = 0 | 1 | 2 | 3;

export type ChildDraft = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  needs: string;
  photoConsent: "" | "yes" | "no";
  /** Item ids this child is booked onto */
  items: string[];
};

export type ParentDraft = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
};

export type SubmitStatus = "idle" | "submitting" | "error";
/** Keyed like "items", "parent.email", "child.<id>.dob", "child.<id>.item.<itemId>" */
export type Errors = Record<string, string>;

const newChild = (items: string[] = []): ChildDraft => ({
  id: Math.random().toString(36).slice(2, 9),
  firstName: "",
  lastName: "",
  dob: "",
  needs: "",
  photoConsent: "",
  items,
});

const emptyParent: ParentDraft = { firstName: "", lastName: "", phone: "", email: "", street: "", street2: "", town: "", county: "Kent", postcode: "" };

type BookingState = {
  step: Step;
  selected: string[];
  children: ChildDraft[];
  parent: ParentDraft;
  agreeTerms: boolean;
  errors: Errors;
  status: SubmitStatus;
  submitError: string;
  /** Snapshot shown on the confirmation page after "payment" */
  confirmation: { reference: string; email: string; lines: { child: string; item: string; price: string }[]; total: string; demo: boolean } | null;

  toggleItem: (id: string) => void;
  /** Used by "Book" buttons around the site: adds the item and opens the flow at step 1 */
  addItem: (id: string) => void;
  addChild: () => void;
  removeChild: (id: string) => void;
  updateChild: <K extends keyof ChildDraft>(id: string, key: K, value: ChildDraft[K]) => void;
  toggleChildItem: (childId: string, itemId: string) => void;
  setParent: <K extends keyof ParentDraft>(key: K, value: ParentDraft[K]) => void;
  setAgreeTerms: (v: boolean) => void;
  goTo: (step: Step) => void;
  /** Validates one step against the current catalogue; returns true when it's OK to continue */
  validate: (step: Step, catalogue: BookableItem[]) => boolean;
  setStatus: (status: SubmitStatus, submitError?: string) => void;
  complete: (confirmation: NonNullable<BookingState["confirmation"]>) => void;
  reset: () => void;
};

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const UK_PHONE = /^(\+44\s?|0)[\d\s]{9,13}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateStep(s: Pick<BookingState, "selected" | "children" | "parent" | "agreeTerms">, step: Step, catalogue: BookableItem[]): Errors {
  const e: Errors = {};
  const byId = new Map(catalogue.map((i) => [i.id, i]));

  if (step === 0 || step === 3) {
    if (!s.selected.length) e.items = "Please choose at least one class, club or workshop.";
  }

  if (step === 1 || step === 3) {
    s.children.forEach((c) => {
      const k = `child.${c.id}`;
      if (!c.firstName.trim()) e[`${k}.firstName`] = "Please add your child's first name.";
      if (!c.lastName.trim()) e[`${k}.lastName`] = "Please add your child's last name.";
      if (!c.dob) e[`${k}.dob`] = "Please add your child's date of birth.";
      if (!c.needs.trim()) e[`${k}.needs`] = "Please tell us about any allergies or needs — or write “None”.";
      if (!c.photoConsent) e[`${k}.photoConsent`] = "Please choose yes or no.";
      if (!c.items.length) e[`${k}.items`] = "Please choose at least one booking for this child.";
      if (c.dob) {
        for (const id of c.items) {
          const item = byId.get(id);
          if (!item) continue;
          const age = ageOn(c.dob, item.startDate);
          if (age < item.ageMin || age > item.ageMax)
            e[`${k}.item.${id}`] = `${c.firstName || "Your child"} will be ${age} on the first day — this is for ages ${item.ageMin}–${item.ageMax}.`;
        }
      }
    });
    const unbooked = s.selected.filter((id) => !s.children.some((c) => c.items.includes(id)));
    if (unbooked.length) e.unbooked = "Every selected booking needs at least one child — untick it on step 1 if you don't need it.";
  }

  if (step === 2 || step === 3) {
    const p = s.parent;
    if (!p.firstName.trim()) e["parent.firstName"] = "Please add your first name.";
    if (!p.lastName.trim()) e["parent.lastName"] = "Please add your last name.";
    if (!UK_PHONE.test(p.phone.trim())) e["parent.phone"] = "Please enter a UK phone number, e.g. 07700 900123.";
    if (!EMAIL.test(p.email.trim())) e["parent.email"] = "Please enter a valid email address.";
    if (!p.street.trim()) e["parent.street"] = "Please add your street address.";
    if (!p.town.trim()) e["parent.town"] = "Please add your town or city.";
    if (!UK_POSTCODE.test(p.postcode.trim())) e["parent.postcode"] = "Please enter a valid UK postcode.";
  }

  if (step === 3 && !s.agreeTerms) e.agreeTerms = "Please confirm you agree to the terms and privacy policy.";
  return e;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      step: 0,
      selected: [],
      children: [newChild()],
      parent: emptyParent,
      agreeTerms: false,
      errors: {},
      status: "idle",
      submitError: "",
      confirmation: null,

      toggleItem: (id) =>
        set((s) => {
          const on = s.selected.includes(id);
          const selected = on ? s.selected.filter((x) => x !== id) : [...s.selected, id];
          // New items are added to every child; removed items are removed from every child
          const children = s.children.map((c) => ({
            ...c,
            items: on ? c.items.filter((x) => x !== id) : [...c.items, id],
          }));
          const { items: _, ...errors } = s.errors;
          return { selected, children, errors };
        }),
      addItem: (id) => {
        if (!get().selected.includes(id)) get().toggleItem(id);
        set({ step: 0, confirmation: null });
      },
      addChild: () => set((s) => ({ children: [...s.children, newChild(s.selected)] })),
      removeChild: (id) => set((s) => ({ children: s.children.length > 1 ? s.children.filter((c) => c.id !== id) : s.children })),
      updateChild: (id, key, value) =>
        set((s) => {
          const errors = { ...s.errors };
          delete errors[`child.${id}.${String(key)}`];
          return { children: s.children.map((c) => (c.id === id ? { ...c, [key]: value } : c)), errors };
        }),
      toggleChildItem: (childId, itemId) =>
        set((s) => ({
          children: s.children.map((c) =>
            c.id === childId ? { ...c, items: c.items.includes(itemId) ? c.items.filter((x) => x !== itemId) : [...c.items, itemId] } : c,
          ),
        })),
      setParent: (key, value) =>
        set((s) => {
          const errors = { ...s.errors };
          delete errors[`parent.${String(key)}`];
          return { parent: { ...s.parent, [key]: value }, errors };
        }),
      setAgreeTerms: (agreeTerms) =>
        set((s) => {
          const { agreeTerms: _, ...errors } = s.errors;
          return { agreeTerms, errors };
        }),
      goTo: (step) => set({ step, errors: {} }),
      validate: (step, catalogue) => {
        const errors = validateStep(get(), step, catalogue);
        set({ errors });
        return Object.keys(errors).length === 0;
      },
      setStatus: (status, submitError = "") => set({ status, submitError }),
      complete: (confirmation) =>
        set({ confirmation, step: 0, selected: [], children: [newChild()], agreeTerms: false, errors: {}, status: "idle", submitError: "" }),
      reset: () => set({ step: 0, selected: [], children: [newChild()], parent: emptyParent, agreeTerms: false, errors: {}, status: "idle", submitError: "" }),
    }),
    {
      name: "dk-booking",
      version: 2,
      storage: createJSONStorage(() => sessionStorage),
      // Never persist consent ticks or transient status
      partialize: (s) => ({ step: s.step, selected: s.selected, children: s.children, parent: s.parent, confirmation: s.confirmation }),
      // Old (v1) drafts from the free-trial form are simply discarded
      migrate: () => ({}) as never,
      skipHydration: true,
    },
  ),
);
