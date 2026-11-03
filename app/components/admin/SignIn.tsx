import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Logo } from "~/components/ui/Logo";
import { useAdminStore } from "~/stores/admin";
import { btnPrimary, inputClass } from "./ui";

/** Admin sign-in form, shown instead of the admin screens until someone signs in. */
export function SignIn() {
  const signIn = useAdminStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in. Please try again.");
      setPassword("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-stage px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-6 w-24">
          <Logo showPlace={false} />
        </div>
        <form onSubmit={submit} className="rounded-2xl bg-paper p-6 shadow-lift sm:p-8" aria-describedby={error ? "signin-error" : undefined}>
          <h1 className="flex items-center gap-2 font-display text-[1.6rem] leading-tight text-ink">
            <LockKeyhole className="size-6 text-teal-deep" aria-hidden="true" /> Admin sign in
          </h1>
          <p className="mt-1 text-sm text-ink-soft">For Drama Kids Canterbury staff only.</p>

          <label htmlFor="admin-email" className="mt-6 block text-sm font-bold text-ink">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} mt-1.5 w-full`}
          />

          <label htmlFor="admin-password" className="mt-4 block text-sm font-bold text-ink">Password</label>
          <div className="relative mt-1.5">
            <input
              id="admin-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} w-full pr-11`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-soft hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {error && (
            <p id="signin-error" role="alert" className="mt-4 rounded-xl bg-magenta/10 px-3 py-2 text-sm font-bold text-magenta-deep">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className={`${btnPrimary} mt-6 w-full`}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
