import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

export function ThankYou() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useRevealOnScroll();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [navigate]);

  return (
    <div className="section-band flex min-h-screen items-center justify-center px-5">
      <div className="viewport-animate w-full max-w-xl p-8 text-center sm:p-12">
        <div className="viewport-animate mb-4 text-6xl">✅</div>
        <h1 className="viewport-animate mb-4 text-3xl font-bold text-[var(--color-text)] md:text-4xl">
          Thank You!
        </h1>
        <p className="viewport-animate mb-8 text-lg leading-7 text-[var(--color-muted)]">
          Your message has been sent successfully. I&apos;ll review it and get back
          to you within 24 hours at the email address you provided.
        </p>

        <div className="viewport-animate mb-8 rounded-lg bg-[color-mix(in_srgb,var(--color-border)_12%,transparent)] p-6">
          <p className="m-0 text-sm text-[var(--color-muted)]">
            <strong>Email:</strong> nichg999@gmail.com
            <br />
            <strong>Response time:</strong> Usually within 24 hours
          </p>
        </div>

        <div className="viewport-animate flex flex-wrap justify-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate("/")}
            className="focus-ring rounded-xl border border-transparent bg-[var(--color-accent)] px-6 py-3 text-xl font-medium text-[#0a0a0a] shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            ← Back to Portfolio
          </button>
        </div>

        <p className="viewport-animate mt-4 text-sm text-[var(--color-soft)]">
          Redirecting to portfolio in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
