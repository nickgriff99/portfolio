import { useConsent } from "../hooks/useConsent";

export function CookieConsentBanner() {
  const { consent, setConsent } = useConsent();

  if (consent !== undefined) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4"
    >
      <div className="flex w-full max-w-xl flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] bg-[var(--color-bg)] p-4 shadow-lg shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-soft)]">
          This site uses Google Analytics to understand visits. No cookies are set
          until you accept.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="rounded-lg border border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] px-4 py-2 text-sm text-[var(--color-soft)] transition-colors hover:text-[var(--color-text)]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[#0a0a0a] transition-all hover:brightness-110"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
