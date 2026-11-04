import { lazy, Suspense, useRef } from "react";

import VariableProximity from "@/bits/VariableProximity";
import ShinyText from "@/bits/ShinyText";
import { cn } from "@/lib/utils";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

// Lazy: pulls in `ogl` (WebGL), purely decorative starfield behind the hero's real
// LCP element (the portrait `<img>` below, loading="eager"/fetchPriority="high").
// Hero already paints its own CSS gradients underneath (`.hero-photo-overlay`,
// global.css), so a `null` fallback during the brief chunk-load window is invisible.
const Particles = lazy(() => import("@/bits/Particles"));
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMagneticHover } from "@/hooks/useMagneticHover";

type HeroSectionProps = {
  onNavigate: (href: string) => void;
  /** When true, apply CSS hero gradients (Grainient/Particles did not initialize). */
  useHeroCssFallback: boolean;
  onParticlesUnavailable: () => void;
};

export function HeroSection({ onNavigate, useHeroCssFallback, onParticlesUnavailable }: HeroSectionProps) {
  const heroContainerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const projectsCtaRef = useMagneticHover<HTMLButtonElement>();
  const resumeCtaRef = useMagneticHover<HTMLAnchorElement>();

  return (
    <section
      id="home"
      ref={heroContainerRef}
      className={cn(
        "section-hero sticky min-h-[100dvh] overflow-hidden",
        useHeroCssFallback && "section-hero--css-fallback",
      )}
    >
      {/* Particles span the full hero section (both columns), mounted as a sibling behind the
          grid so transparent areas of the photo cutout show the starfield too, not just the
          text column. z-0 here, grid wrapper below is z-10. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Boundary outside Suspense: a rejected `lazy()` chunk-fetch promise throws
            during render and would otherwise unmount the whole app (no boundary above
            this in the tree) - silent fallback since this effect is purely decorative. */}
        <RouteErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Particles
              onUnavailable={onParticlesUnavailable}
              interactionRef={heroContainerRef}
              interactionProximityPx={900}
              particleColors={["#ffffff"]}
              particleCount={800}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover
              alphaParticles
              disableRotation
              pixelRatio={4}
            />
          </Suspense>
        </RouteErrorBoundary>
      </div>

      {/* Full-bleed 2-col grid: touches true viewport edges, no max-width cap (brutalist
          full-bleed, matches `.content-shell`'s cap removal in global.css).
          Text column is first in DOM and first in visual order at every breakpoint: text-top on
          mobile, text-left on desktop. No `order` utilities needed - DOM order matches visual
          order at all sizes. */}
      <div className="hero-cover-fade relative z-10 mx-auto grid w-full grid-cols-1 md:grid-cols-2">
        {/* Text column. First in DOM → text-top on mobile, text-left on desktop (md:col 1). */}
        <div className="relative isolate flex min-h-[40vh] w-full flex-col justify-center px-6 pb-16 pt-24 sm:px-8 md:min-h-[100dvh] md:px-12 md:pb-0 md:pt-24 lg:pb-0 lg:pt-20 lg:px-16">
          {/* hero-text-parallax: parallax WRAPPER - transform applied here, never on
              .hero-animate children (animation-fill-mode:both owns their transform).
              CSS drives the drift via --hero-progress (Home.tsx scroll listener). */}
          <div className="hero-text-parallax relative z-10 flex flex-col items-start text-left">
            <span className="hero-animate hero-animate-1 mb-4 inline-flex items-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0a0a0a]">
              <span
                aria-hidden="true"
                className={cn("h-2 w-2 rounded-full bg-[#0a0a0a]", !prefersReducedMotion && "animate-pulse")}
              />
              Available for Hire
            </span>

            <h1 className="hero-animate hero-animate-2 mb-3 flex flex-col text-[length:min(16vw,14vh,5.5rem)] font-extrabold leading-[0.9] tracking-tighter text-[var(--color-text)] sm:text-[length:min(11vw,14vh,6.5rem)] md:text-[length:min(7.5vw,16vh,7rem)]">
              <span>Nicholas</span>
              <ShinyText
                text="Griffiths"
                speed={4}
                delay={0}
                color="#a3e635"
                shineColor="#e4ffb0"
                spread={70}
                direction="left"
                yoyo={false}
                pauseOnHover
                disabled={false}
              />
            </h1>

            <h2 className="hero-animate hero-animate-3 mb-2 text-3xl font-semibold tracking-tight text-[var(--color-link)] sm:text-4xl">
              Full-Stack Engineer
            </h2>

            <p className="hero-animate hero-animate-3 mb-7 text-sm font-medium uppercase tracking-wide text-[var(--color-soft)]">
              Provo, UT · Remote (Mountain Time)
            </p>

            <p className="hero-animate hero-animate-4 mb-8 max-w-xl text-lg leading-7 text-[var(--color-soft)]">
              I design the{" "}
              <span className="keyword-highlight">Postgres schema and the APIs it powers</span>, then bring that same rigor to a{" "}
              <VariableProximity
                label="Three.js configurator"
                containerRef={heroContainerRef}
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 800"
                radius={200}
                falloff="gaussian"
                className="inline align-baseline text-inherit"
              />{" "}
              people actually enjoy using.
            </p>

            <div className="hero-animate hero-animate-5 flex flex-col gap-4 sm:flex-row">
              <button
                ref={projectsCtaRef}
                onClick={() => onNavigate("#projects")}
                className="btn-primary"
              >
                View My Work
              </button>
              <a
                ref={resumeCtaRef}
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Resume
              </a>
            </div>
          </div>
        </div>

        {/* Photo column (LCP element). Second in DOM → photo-bottom on mobile, photo-right on desktop (md:col 2). */}
        <div className="relative min-h-[60vh] w-full overflow-hidden md:min-h-[100dvh]">
          {/* hero-photo-parallax: inner wrapper so overflow-hidden on the column clips the
              drift; transform applied here (opposite direction to text parallax). */}
          <div className="hero-photo-parallax absolute inset-0">
          {/* Grounding treatment, painted behind the cutout (declared first in DOM, no z-index
              hack needed): a soft ambient glow behind the figure plus a blurred elliptical
              "contact shadow" under the feet, so the transparent cutout reads as standing in the
              scene instead of floating on a flat page. */}
          <div aria-hidden="true" className="hero-photo-overlay pointer-events-none absolute inset-0" />
          <img
            src="/assets/images/hero-portrait-cutout.webp"
            alt="Nicholas Griffiths"
            width={1600}
            height={1600}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-contain object-bottom"
          />
          </div>{/* end hero-photo-parallax */}
        </div>
      </div>
    </section>
  );
}
