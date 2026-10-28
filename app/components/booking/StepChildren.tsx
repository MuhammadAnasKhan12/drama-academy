import { Check, Plus, Trash2 } from "lucide-react";
import { RadioPills, TextArea, TextField } from "~/components/ui/Field";
import { ageOn, money, type BookableItem } from "~/lib/booking/catalogue";
import { useBookingStore, type Errors } from "~/stores/booking";

const todayIso = () => new Date().toISOString().slice(0, 10);

export function StepChildren({ byId, errors }: { byId: Map<string, BookableItem>; errors: Errors }) {
  const { children, selected, addChild, removeChild, updateChild, toggleChildItem } = useBookingStore();

  return (
    <div className="space-y-6">
      {errors.unbooked && <p className="rounded-chip bg-magenta/10 p-3 font-bold text-magenta-deep" role="alert">{errors.unbooked}</p>}

      {children.map((c, i) => {
        const k = `child.${c.id}`;
        const age = c.dob ? ageOn(c.dob, todayIso()) : null;
        return (
          <section key={c.id} aria-labelledby={`${k}-title`} className="rounded-card bg-paper p-5 shadow-card ring-1 ring-line sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 id={`${k}-title`} className="font-display text-h4">
                {c.firstName.trim() ? c.firstName : `Child ${i + 1}`}
                {age !== null && age >= 0 && <span className="ml-2 text-base font-normal text-ink-soft">age {age}</span>}
              </h3>
              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChild(c.id)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-magenta-deep hover:bg-magenta/10"
                >
                  <Trash2 className="size-4" aria-hidden="true" /> Remove<span className="sr-only"> {c.firstName || `child ${i + 1}`}</span>
                </button>
              )}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <TextField id={`${k}.firstName`} label="First name" autoComplete="off" value={c.firstName} error={errors[`${k}.firstName`]} onChange={(e) => updateChild(c.id, "firstName", e.target.value)} />
              <TextField id={`${k}.lastName`} label="Last name" autoComplete="off" value={c.lastName} error={errors[`${k}.lastName`]} onChange={(e) => updateChild(c.id, "lastName", e.target.value)} />
              <TextField
                id={`${k}.dob`}
                type="date"
                label="Date of birth"
                max={todayIso()}
                value={c.dob}
                error={errors[`${k}.dob`]}
                onChange={(e) => updateChild(c.id, "dob", e.target.value)}
              />
              <RadioPills
                name={`${k}.photoConsent`}
                legend="Happy for photos of your child on our social media?"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
                value={c.photoConsent}
                error={errors[`${k}.photoConsent`]}
                onChange={(v) => updateChild(c.id, "photoConsent", v)}
              />
              <TextArea
                id={`${k}.needs`}
                className="sm:col-span-2"
                label="Any allergies or specific needs?"
                hint="Medical conditions, allergies, SEND or anything that helps us support your child. Write “None” if not."
                value={c.needs}
                error={errors[`${k}.needs`]}
                onChange={(e) => updateChild(c.id, "needs", e.target.value)}
              />
            </div>

            {selected.length > 0 && (
              <fieldset className="mt-6">
                <legend className="font-bold">What is {c.firstName.trim() || "this child"} booked onto?</legend>
                <div className="mt-2 space-y-2">
                  {selected.map((id) => {
                    const item = byId.get(id);
                    if (!item) return null;
                    const on = c.items.includes(id);
                    const err = errors[`${k}.item.${id}`];
                    return (
                      <div key={id}>
                        <label
                          className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-chip border-2 px-3 py-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-deep ${
                            err ? "border-magenta" : on ? "border-ink" : "border-line"
                          }`}
                        >
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleChildItem(c.id, id)} aria-describedby={err ? `${k}.item.${id}-error` : undefined} />
                          <span aria-hidden="true" className={`grid size-6 shrink-0 place-items-center rounded-md border-2 ${on ? "border-ink bg-ink text-cream" : "border-line"}`}>
                            {on && <Check className="size-3.5" strokeWidth={3} />}
                          </span>
                          <span className="flex-1">
                            <span className="font-bold">{item.title}</span>
                            <span className="block text-sm text-ink-soft">{item.when}</span>
                          </span>
                          <span className="font-bold">{money(item.pricePence)}</span>
                        </label>
                        {err && <p id={`${k}.item.${id}-error`} className="mt-1 text-sm font-bold text-magenta-deep">{err}</p>}
                      </div>
                    );
                  })}
                </div>
                {errors[`${k}.items`] && <p className="mt-1.5 text-sm font-bold text-magenta-deep">{errors[`${k}.items`]}</p>}
              </fieldset>
            )}
          </section>
        );
      })}

      <button
        type="button"
        onClick={addChild}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-card border-2 border-dashed border-ink/40 font-bold transition-colors hover:border-ink hover:bg-paper"
      >
        <Plus className="size-5" aria-hidden="true" /> Add another child
      </button>
    </div>
  );
}
