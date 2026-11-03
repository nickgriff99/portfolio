import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useMagneticHover } from "@/hooks/useMagneticHover";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const submitBtnRef = useMagneticHover<HTMLButtonElement>();
  // Synchronous lock, not state: two rapid clicks can both fire this handler from the
  // same stale closure before React re-renders/commits `isSubmitting`, so the state
  // guard alone can't reject the second call in time. A ref mutates immediately and is
  // read live (not captured per-render), so it closes the race regardless of commit timing.
  const submitLockRef = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Fire-and-forget: warm the lazy "/thank-you" chunk now so it's ready by the
    // time we navigate, instead of starting the fetch cold after the POST resolves.
    void import("../pages/ThankYou");

    const formData = new FormData(event.currentTarget);

    // Keep local development fast and deterministic.
    if (import.meta.env.DEV) {
      window.setTimeout(() => {
        navigate("/thank-you");
      }, 700);
      return;
    }

    try {
      const encodedFormData = new URLSearchParams();
      formData.forEach((value, key) => {
        if (typeof value === "string") {
          encodedFormData.append(key, value);
        }
      });

      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodedFormData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
      }

      navigate("/thank-you");
    } catch {
      setSubmitError(
        "Message failed to send. Please try again or email nichg999@gmail.com directly.",
      );
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  return (
    <form
      id="contactForm"
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      data-netlify-recaptcha="true"
      action="/thank-you"
      className="space-y-6 w-full"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact" />
      <div className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human:
          <input name="bot-field" />
        </label>
      </div>

      {submitError ? (
        <p
          role="alert"
          className="rounded-md border border-[var(--color-highlight)]/50 bg-[var(--color-highlight)]/10 px-3 py-2 text-sm text-[var(--color-highlight)]"
        >
          {submitError}
        </p>
      ) : null}

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
        <label htmlFor="email" className="mb-2 block font-mono text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
          Email *
        </label>
        <input
          className="form-field"
          type="email"
          id="email"
          name="email"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject" className="mb-2 block font-mono text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
          Subject *
        </label>
        <input
          className="form-field"
          type="text"
          id="subject"
          name="subject"
          required
          minLength={5}
          maxLength={100}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="mb-2 block font-mono text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
          Message *
        </label>
        <textarea
          className="form-field min-h-[8rem] resize-y"
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={1000}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <div data-netlify-recaptcha="true" />
      </div>

      <div className="form-group">
        <button
          ref={submitBtnRef}
          type="submit"
          // `transform` deliberately excluded from `transition-*`: `useMagneticHover` owns
          // it (mousemove-tracked x/y) — a CSS transform transition here would fight the
          // GSAP tween frame-by-frame. Only `filter` (the hover brightness bump) needs one.
          className={`focus-ring rounded-[8px] border-2 border-[color-mix(in_srgb,var(--color-accent)_80%,transparent)] bg-[var(--color-accent)] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide text-[#0a0a0a] shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)] transition-[filter] duration-300 hover:brightness-110 ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
          id="submitBtn"
          disabled={isSubmitting}
        >
          <span className={isSubmitting ? "hidden" : "inline"}>Send Message</span>
          <span className={isSubmitting ? "inline" : "hidden"}>Sending...</span>
        </button>
      </div>

      <p className="mt-4 text-sm text-[var(--color-soft)]">
        Messages are sent securely to nichg999@gmail.com. I&apos;ll respond within
        48 hours.
      </p>
    </form>
  );
}
