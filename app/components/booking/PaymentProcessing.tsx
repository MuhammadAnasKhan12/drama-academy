import { Lock } from "lucide-react";
import { useEffect } from "react";
import { useUiStore } from "~/stores/ui";

/** Full-screen "please wait" while the payment is being confirmed. Blocks double-clicks and leaving. */
export function PaymentProcessing({ total }: { total: string }) {
  useEffect(() => {
    const lenis = useUiStore.getState().lenis;
    lenis?.stop();
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => {
      lenis?.start();
      window.removeEventListener("beforeunload", warn);
    };
  }, []);

  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="processing-title" aria-describedby="processing-desc" className="fixed inset-0 z-[95] grid place-items-center bg-stage/85 p-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-card bg-paper p-8 text-center shadow-stage">
        {/* Spotlight-style spinner */}
        <div aria-hidden="true" className="relative mx-auto size-20">
          <span className="absolute inset-0 rounded-full border-[6px] border-line" />
          <span className="absolute inset-0 animate-spin rounded-full border-[6px] border-transparent border-t-magenta border-r-spotlight" />
          <Lock className="absolute inset-0 m-auto size-7 text-ink" />
        </div>
        <h2 id="processing-title" className="mt-6 font-display text-h3">
          Processing {total}…
        </h2>
        <p id="processing-desc" className="mt-2 text-ink-soft" aria-live="polite">
          Please don’t close or refresh this page. This usually takes a few seconds.
        </p>
      </div>
    </div>
  );
}
