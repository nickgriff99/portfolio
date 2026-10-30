import { useEffect, useRef } from "react";

import { useConsent } from "../hooks/useConsent";

export function CookieConsentBanner() {
  const { consent, setConsent } = useConsent();
  const declineRef = useRef<HTMLButtonElement>(null);
  const prevConsentRef = useRef(consent);

  useEffect(() => {
    const prev = prevConsentRef.current;
    prevConsentRef.current = consent;
    // Footer's "Cookie settings" can now bring this dialog back mid-session
    // (no reload) by resetting consent to undefined. `aria-live` on a node
    // that was just re-inserted into the DOM isn't reliably announced by
    // every AT, and focus otherwise silently stays on the Footer button, so
    // move focus into the dialog on reopen. Skip it on the very first mount
    // (prev === consent, nothing has transitioned yet) so first-time
    // visitors don't get their page load hijacked by an autofocus steal.
    if (consent === undefined && prev !== undefined) {
      declineRef.current?.focus();
    }
  }, [consent]);

  if (consent !== undefined) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-2"
    >
      <div className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-2 rounded-lg border border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] bg-[var(--color-bg)] px-3 py-1.5 shadow-lg shadow-black/20">
        <p className="text-xs text-[var(--color-soft)]">
          Analytics cookies — opt-in only.
        </p>
        <div className="flex shrink-0 gap-1.5">
          <button
            ref={declineRef}
            type="button"
            onClick={() => setConsent("declined")}
            className="focus-ring rounded-md border border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] px-2.5 py-0.5 text-xs text-[var(--color-soft)] transition-colors hover:text-[var(--color-text)]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="focus-ring rounded-md bg-[var(--color-accent)] px-2.5 py-0.5 text-xs font-medium text-[#0a0a0a] transition-all hover:brightness-110"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
