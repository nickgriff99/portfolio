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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-700 px-5">
      <div className="viewport-animate w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] sm:p-12">
        <div className="viewport-animate mb-4 text-6xl">✅</div>
        <h1 className="viewport-animate mb-4 text-3xl font-bold text-zinc-800 md:text-4xl">
          Thank You!
        </h1>
        <p className="viewport-animate mb-8 text-lg leading-7 text-zinc-500">
          Your message has been sent successfully. I&apos;ll review it and get back
          to you within 24 hours at the email address you provided.
        </p>

        <div className="viewport-animate mb-8 rounded-lg bg-zinc-100 p-6">
          <p className="m-0 text-sm text-zinc-500">
            <strong>Email:</strong> nichg999@gmail.com
            <br />
            <strong>Response time:</strong> Usually within 24 hours
          </p>
        </div>

        <div className="viewport-animate flex flex-wrap justify-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate("/")}
            className="focus-ring rounded-xl border border-brand-primary/30 bg-white/70 px-6 py-3 text-xl font-medium text-brand-primary shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-brand-primary/90 hover:to-brand-dark hover:text-slate-100"
          >
            ← Back to Portfolio
          </button>
        </div>

        <p className="viewport-animate mt-4 text-sm text-zinc-400">
          Redirecting to portfolio in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
