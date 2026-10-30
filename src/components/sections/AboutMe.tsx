import { lazy, Suspense } from "react";

import DecryptedText from "@/bits/DecryptedText";
import { SkillsWidget } from "@/components/SkillsWidget";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * AboutMe — merged About + Skills section (Step 4).
 *
 * Desktop: two-column grid (text left, SkillsWidget right sticky).
 * Mobile/tablet: stacked (text above, skills below).
 *
 * Text animations (React Bits, src/bits/):
 *  P1 — Shuffle (GSAP ScrollTrigger, fires once on scroll-into-view)
 *  P2 — DecryptedText (animateOn="view", fires once on scroll-into-view)
 *  Both handle prefers-reduced-motion and provide accessible text to SR.
 */

// Lazy: Shuffle pulls in GSAP ScrollTrigger + SplitText (~25 kB gzip) that nothing else
// needs on first paint; AboutMe sits below the pinned hero, so the chunk loads in the background.
const Shuffle = lazy(() => import("@/bits/Shuffle"));

const LEAD_CLASS =
  "text-xl font-semibold leading-snug tracking-tight text-[var(--color-text)] sm:text-2xl sm:leading-snug lg:text-3xl";

const LEAD_TEXT =
  "I build full-stack products end-to-end from the PostgreSQL schema to a Three.js configurator people actually enjoy using. Clean architecture and a sharp interface aren\u2019t separate skills to me; the stack and the experience get designed together, which is exactly what this site is built to prove.";

const SECOND_TEXT =
  "I recently wrapped a six-month React contract at Spot Parking, I\u2019m currently a Data Labeller at Tesla, and I\u2019m actively looking for a full-stack role where I can do this full-time.";

export function AboutMe() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="about-me" className="section-band">
      <div className="content-shell">
        {/* Section heading — same look as existing (section-title + header-surface) */}
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3 tracking-wide">
            About <span className="keyword-link">Me</span>
          </span>
        </h2>

        {/*
          Two-column layout on desktop (lg+), stacked on mobile.
          items-start so neither column stretches the other.
        */}
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24">

          {/* LEFT — About text */}
          <div className="text-left">

            {/*
              P1 — Shuffle animation (GSAP SplitText + ScrollTrigger).
              Accessibility: sr-only copy carries the real text; the animated element is aria-hidden.
              Layout shift: element is visibility:hidden (preserves space) until
              onEnter fires; SplitText wraps chars while still hidden; setReady(true)
              makes element visible as animation starts.
              prefers-reduced-motion: Shuffle bails early and calls setReady(true)
              immediately, so final text renders without animation.
            */}
            <div className="mb-8">
              {reducedMotion ? (
                <p className={LEAD_CLASS}>{LEAD_TEXT}</p>
              ) : (
                <>
                {/* `aria-label` on a plain <p> is ignored by screen readers (a <p> has no
                    accessible name), so the real text lives in this sr-only copy and the animated
                    one below is hidden from assistive tech. */}
                <p className="sr-only">{LEAD_TEXT}</p>
                {/* Fallback is an invisible copy of the paragraph: reserves the exact height (no
                    layout shift when the chunk arrives) and never flashes unanimated text. */}
                <Suspense
                  fallback={
                    <p aria-hidden="true" className={`${LEAD_CLASS} invisible`}>
                      {LEAD_TEXT}
                    </p>
                  }
                >
                  <Shuffle
                    tag="p"
                    text={LEAD_TEXT}
                    ariaHidden="true"
                    className={LEAD_CLASS}
                    textAlign="left"
                    shuffleDirection="right"
                    animationMode="sequence"
                    stagger={0.012}
                    duration={0.18}
                    shuffleTimes={1}
                    triggerOnce={true}
                    triggerOnHover={false}
                    respectReducedMotion={true}
                    threshold={0.15}
                    rootMargin="0px"
                  />
                </Suspense>
                </>
              )}
            </div>

            {/*
              P2 — DecryptedText animation.
              animateOn="view" triggers via IntersectionObserver on scroll-into-view.
              sr-only span inside DecryptedText provides accessible text to SR.
              Layout shift: each glyph rendered in a fixed-width container via
              scaleX squeeze; final char always occupies its natural width.
              prefers-reduced-motion: DecryptedText checks window.matchMedia and
              reveals immediately without animation.
            */}
            <p className="mb-6 text-base leading-7 text-[var(--color-muted)] sm:text-lg sm:leading-8">
              <DecryptedText
                text={SECOND_TEXT}
                animateOn="view"
                speed={15}
                maxIterations={4}
                sequential={true}
                revealDirection="start"
                parentClassName="inline"
              />
            </p>

            {/* P3 — mono joke line, no animation (keep as-is per spec) */}
            <p className="font-mono text-sm leading-6 text-[var(--color-dev)] sm:text-base">
              <span aria-hidden="true" className="text-[color-mix(in_srgb,var(--color-dev)_55%,transparent)]">
                {"// "}
              </span>
              Oh, and careful what you say around my receipts-bot... he keeps receipts... 😉
            </p>

            {/* Currently strip — mono status line below the paragraphs */}
            <div className="viewport-animate mt-8 border-l-2 border-[color-mix(in_srgb,var(--color-link)_45%,transparent)] pl-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-soft)] mb-1">
                // currently
              </p>
              <ul className="space-y-1 font-mono text-sm text-[var(--color-muted)] sm:text-base">
                <li>
                  <span className="text-[var(--color-link)]">@</span> Data Labeller · Tesla
                </li>
                <li>
                  <span className="text-[var(--color-dev)]">✓</span> Building full-stack products for fun (check <a href="/projects" className="text-[var(--color-link)]">my projects</a> below!)
                </li>
                <li>
                  <span className="text-[var(--color-accent)]">→</span> Open to full-stack roles
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT — SkillsWidget, sticky on desktop so it stays in view while left scrolls */}
          <div className="lg:sticky lg:top-28">
            {/* Sub-heading for the skills panel */}
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[var(--color-soft)]">
              // skills &amp; technologies
            </p>
            <SkillsWidget />
          </div>

        </div>
      </div>
    </section>
  );
}
