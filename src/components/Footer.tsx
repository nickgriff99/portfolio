import { useConsent } from "../hooks/useConsent";

export function Footer() {
  const { setConsent } = useConsent();

  return (
    <footer className="section-band border-t border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] py-10">
      <div className="content-shell text-center text-sm text-[var(--color-soft)]">
        <p>© 2026 Nicholas Griffiths. All rights reserved.</p>
        <button
          type="button"
          onClick={() => setConsent(undefined)}
          className="focus-ring mt-2 rounded-md px-2 py-1 underline-offset-2 hover:text-[var(--color-text)] hover:underline"
        >
          Cookie settings
        </button>
      </div>
    </footer>
  );
}
