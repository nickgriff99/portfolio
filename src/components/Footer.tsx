import { Link } from "react-router-dom";
import { useConsent } from "../hooks/useConsent";

export function Footer() {
  const { setConsent } = useConsent();

  return (
    <footer className="w-full border-t border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] px-0 py-10 md:py-12">
      <div className="content-shell text-center text-sm text-[var(--color-soft)]">
        <div className="mb-4 flex items-center justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/nicholas-griffiths-1a1883220/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="focus-ring rounded-md p-1 text-[var(--color-soft)] transition-colors hover:text-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
              />
            </svg>
          </a>
          <a
            href="https://github.com/nickgriff99"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="focus-ring rounded-md p-1 text-[var(--color-soft)] transition-colors hover:text-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.045.137 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
        <p>© 2026 Nicholas Griffiths. All rights reserved.</p>
        <Link
          to="/guestbook"
          className="focus-ring mt-2 inline-block rounded-md px-2 py-1 underline-offset-2 hover:text-[var(--color-text)] hover:underline"
        >
          Sign the guestbook
        </Link>
        <button
          type="button"
          onClick={() => setConsent(undefined)}
          className="focus-ring mt-2 block rounded-md px-2 py-1 underline-offset-2 hover:text-[var(--color-text)] hover:underline"
        >
          Cookie settings
        </button>
      </div>
    </footer>
  );
}
