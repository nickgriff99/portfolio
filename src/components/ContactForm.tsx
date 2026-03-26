import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

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
        <p className="rounded-md border border-[var(--color-highlight)]/50 bg-[var(--color-highlight)]/10 px-3 py-2 text-sm text-[var(--color-highlight)]">
          {submitError}
        </p>
      ) : null}

      <div className="form-group">
        <label htmlFor="name" className="mb-2 block font-medium text-[var(--color-text)]">
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
        <label htmlFor="email" className="mb-2 block font-medium text-[var(--color-text)]">
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
        <label htmlFor="subject" className="mb-2 block font-medium text-[var(--color-text)]">
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
        <label htmlFor="message" className="mb-2 block font-medium text-[var(--color-text)]">
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
          type="submit"
          className={`focus-ring rounded-xl border border-transparent bg-[var(--color-accent)] px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
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
