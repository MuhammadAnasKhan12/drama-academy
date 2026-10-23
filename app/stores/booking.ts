import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type BookingType = "trial" | "camp" | "general";

export type BookingDraft = {
  type: BookingType;
  childName: string;
  childAge: string;
  interest: string; // class id or camp id
  parentName: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
};

export type BookingErrors = Partial<Record<keyof BookingDraft, string>>;
export type SubmitStatus = "idle" | "submitting" | "success" | "error";

const emptyDraft: BookingDraft = {
  type: "trial",
  childName: "",
  childAge: "",
  interest: "",
  parentName: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

type BookingState = {
  draft: BookingDraft;
  errors: BookingErrors;
  status: SubmitStatus;
  setField: <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => void;
  /** Called by "Book a free trial" buttons on class / camp cards so the form arrives pre-filled */
  prefill: (type: BookingType, interest?: string) => void;
  validate: () => boolean;
  setStatus: (status: SubmitStatus) => void;
  reset: () => void;
};

export function validateDraft(d: BookingDraft): BookingErrors {
  const e: BookingErrors = {};
  if (!d.childName.trim()) e.childName = "Please tell us your child's first name.";
  const age = Number(d.childAge);
  if (!d.childAge) e.childAge = "Please choose your child's age.";
  else if (Number.isNaN(age) || age < 3 || age > 18) e.childAge = "Please choose an age between 3 and 18.";
  if (!d.parentName.trim()) e.parentName = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Please enter a valid email address.";
  if (d.phone && !/^[+()\d\s-]{10,16}$/.test(d.phone.trim())) e.phone = "Please check your phone number.";
  if (!d.consent) e.consent = "Please tick to let us contact you about your enquiry.";
  return e;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      draft: emptyDraft,
      errors: {},
      status: "idle",
      setField: (key, value) =>
        set((s) => {
          const errors = { ...s.errors };
          delete errors[key];
          return { draft: { ...s.draft, [key]: value }, errors };
        }),
      prefill: (type, interest = "") => set((s) => ({ draft: { ...s.draft, type, interest }, status: "idle" })),
      validate: () => {
        const errors = validateDraft(get().draft);
        set({ errors });
        return Object.keys(errors).length === 0;
      },
      setStatus: (status) => set({ status }),
      reset: () => set({ draft: emptyDraft, errors: {}, status: "idle" }),
    }),
    {
      name: "dk-booking",
      // Session only: a half-filled form survives page changes but not closing the browser.
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ draft: { ...s.draft, consent: false } }),
      skipHydration: true,
    },
  ),
);
