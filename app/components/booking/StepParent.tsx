import { TextField } from "~/components/ui/Field";
import { useBookingStore, type Errors } from "~/stores/booking";

export function StepParent({ errors }: { errors: Errors }) {
  const { parent, setParent } = useBookingStore();
  const f = (key: keyof typeof parent) => ({
    id: `parent.${key}`,
    value: parent[key],
    error: errors[`parent.${key}`],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setParent(key, e.target.value),
  });

  return (
    <div className="space-y-8">
      <section aria-labelledby="parent-title" className="rounded-card bg-paper p-5 shadow-card ring-1 ring-line sm:p-7">
        <h3 id="parent-title" className="font-display text-h4">Parent or carer</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField label="First name" autoComplete="given-name" {...f("firstName")} />
          <TextField label="Last name" autoComplete="family-name" {...f("lastName")} />
          <TextField label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" {...f("phone")} />
          <TextField label="Email" type="email" autoComplete="email" hint="Your booking confirmation goes here." {...f("email")} />
        </div>
      </section>

      <section aria-labelledby="address-title" className="rounded-card bg-paper p-5 shadow-card ring-1 ring-line sm:p-7">
        <h3 id="address-title" className="font-display text-h4">Home address</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField label="Street address" autoComplete="address-line1" className="sm:col-span-2" {...f("street")} />
          <TextField label="Address line 2" autoComplete="address-line2" optional className="sm:col-span-2" {...f("street2")} />
          <TextField label="Town or city" autoComplete="address-level2" {...f("town")} />
          <TextField label="County" autoComplete="address-level1" optional {...f("county")} />
          <TextField label="Postcode" autoComplete="postal-code" className="sm:max-w-48" {...f("postcode")} onBlur={(e) => setParent("postcode", e.target.value.toUpperCase().trim())} />
        </div>
      </section>
    </div>
  );
}
