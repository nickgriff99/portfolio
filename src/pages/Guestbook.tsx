import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { NAV_ITEMS } from "../data/navItems";
import { scrollToId } from "../lib/scrollToId";

type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

const API_BASE = import.meta.env.VITE_GUESTBOOK_API_URL as string | undefined;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function loadRecaptchaScript(siteKey: string) {
  if (document.querySelector(`script[src*="recaptcha/api.js"]`)) return;
  const script = document.createElement("script");
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  document.head.appendChild(script);
}

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitLockRef = useRef(false);
  const handleNavigate = (href: `#${string}`) => scrollToId(href.slice(1));

  useEffect(() => {
    if (RECAPTCHA_SITE_KEY) loadRecaptchaScript(RECAPTCHA_SITE_KEY);
  }, []);

  useEffect(() => {
    if (!API_BASE) return;
    fetch(`${API_BASE}/api/entries`)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load entries: ${response.status}`);
        return response.json();
      })
      .then((data: GuestbookEntry[]) => setEntries(data))
      .catch(() => setLoadError("Couldn't load the guestbook right now. Try again later."));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(event.currentTarget);

    try {
      if (!API_BASE) {
        throw new Error("Guestbook API is not configured.");
      }
      if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) {
        throw new Error("reCAPTCHA is not ready.");
      }

      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "guestbook_submit",
      });

      const response = await fetch(`${API_BASE}/api/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          message: formData.get("message"),
          bot_field: formData.get("bot_field"),
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      const created: GuestbookEntry = await response.json();
      setEntries((prev) => [created, ...prev]);
      event.currentTarget.reset();
    } catch {
      setSubmitError("Message failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  return (
    <>
      <NavBar items={NAV_ITEMS} activeSection="" hidden={false} compact={false} onNavigate={handleNavigate} />
      <div className="section-band page-offset">
        <div className="content-shell mx-auto max-w-5xl">
          <Link to="/" className="back-link">
            ← Back to home
          </Link>

          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[var(--color-soft)]">
            // guestbook
          </p>
          <h1 className="section-title text-left">Sign the Guestbook</h1>

          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-prose space-y-6">
            {submitError ? (
              <p
                role="alert"
                className="rounded-md border border-[var(--color-highlight)]/50 bg-[var(--color-highlight)]/10 px-3 py-2 text-sm text-[var(--color-highlight)]"
              >
                {submitError}
              </p>
            ) : null}

            <div className="hidden">
              <label>
                Don&apos;t fill this out if you&apos;re human:
                <input name="bot_field" />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="mb-2 block font-mono text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Name *
              </label>
              <input
                className="form-field"
                type="text"
                id="name"
                name="name"
                required
                minLength={2}
                maxLength={50}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="mb-2 block font-mono text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Message *
              </label>
              <textarea
                className="form-field min-h-[6rem] resize-y"
                id="message"
                name="message"
                rows={4}
                required
                minLength={10}
                maxLength={1000}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className={`focus-ring rounded-[8px] border-2 border-[color-mix(in_srgb,var(--color-accent)_80%,transparent)] bg-[var(--color-accent)] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide text-[#0a0a0a] shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)] transition-[filter] duration-300 hover:brightness-110 ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
              disabled={isSubmitting}
            >
              <span className={isSubmitting ? "hidden" : "inline"}>Sign Guestbook</span>
              <span className={isSubmitting ? "inline" : "hidden"}>Sending...</span>
            </button>
          </form>

          <div className="mt-12 space-y-6">
            {loadError ? <p className="text-sm text-[var(--color-highlight)]">{loadError}</p> : null}
            {entries.length === 0 && !loadError ? (
              <p className="text-sm text-[var(--color-muted)]">No entries yet, be the first to sign.</p>
            ) : null}
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[8px] border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] p-4"
              >
                <p className="text-base leading-7 text-[var(--color-text)]">{entry.message}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-wide text-[var(--color-soft)]">
                  {entry.name} · {new Date(entry.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
