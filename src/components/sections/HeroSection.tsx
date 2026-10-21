import { useRef } from "react";

import VariableProximity from "@/bits/VariableProximity";
import ShinyText from "@/bits/ShinyText";
import Particles from "@/bits/Particles";
import { cn } from "@/lib/utils";
import TextType from "@/bits/TextType";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type HeroSectionProps = {
  onNavigate: (href: string) => void;
  /** When true, apply CSS hero gradients (Grainient/Particles did not initialize). */
  useHeroCssFallback: boolean;
  onParticlesUnavailable: () => void;
};

export function HeroSection({ onNavigate, useHeroCssFallback, onParticlesUnavailable }: HeroSectionProps) {
  const heroContainerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="home"
      ref={heroContainerRef}
      className={cn(
        "section-hero relative min-h-screen overflow-hidden",
        useHeroCssFallback && "section-hero--css-fallback",
      )}
    >
      {/* Full-bleed 2-col grid: touches true viewport edges, only capped by the site's ultrawide max-width.
          DOM order stays photo-first/text-second at every breakpoint (neither column carries
          interactive content, so this doesn't disturb tab order or reading order) — only the
          *visual* order flips to text-left/photo-right at md+ via `order` utilities below. */}
      <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 md:grid-cols-2">
        {/* Photo column (LCP element). md:order-2 pushes it to the right on desktop. */}
        <div className="relative min-h-[60vh] w-full overflow-hidden md:order-2 md:min-h-screen">
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
        </div>

        {/* Text column. md:order-1 pulls it to the left on desktop. */}
        <div className="relative isolate flex min-h-[40vh] w-full flex-col justify-center overflow-hidden px-6 py-16 sm:px-8 md:order-1 md:min-h-screen md:px-12 md:py-0 lg:px-16">
          <div className="pointer-events-none absolute inset-0 z-0">
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
          </div>

          <div className="relative z-10 flex flex-col items-start text-left">
            <span className="viewport-animate mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0a0a0a]">
              <span
                aria-hidden="true"
                className={cn("h-2 w-2 rounded-full bg-[#0a0a0a]", !prefersReducedMotion && "animate-pulse")}
              />
              Available for Hire
            </span>

            <h1 className="viewport-animate mb-5 flex flex-col text-5xl font-extrabold leading-[0.95] text-[var(--color-text)] sm:text-7xl md:text-8xl lg:text-9xl">
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

            <h2 className="viewport-animate mb-6 text-3xl font-semibold text-[var(--color-link)] sm:text-4xl tracking-wider">
              <TextType
                as="span"
                text={["Web Development", "User Experience", "Software Engineering"]}
                typingSpeed={75}
                pauseDuration={2600}
                showCursor
                cursorCharacter="█"
                deletingSpeed={40}
                variableSpeed={{ min: 60, max: 120 }}
                cursorBlinkDuration={0.5}
              />
            </h2>

            <p className="viewport-animate mb-10 max-w-xl text-lg leading-8 text-[var(--color-soft)]">
              I create exceptional digital experiences through <span className="keyword-highlight">clean code</span>{" "}
              and{" "}
              <VariableProximity
                label="innovative design"
                containerRef={heroContainerRef}
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                radius={200}
                falloff="gaussian"
                className="inline align-baseline text-inherit"
              />
              .
            </p>

            <div className="viewport-animate flex flex-col gap-4 sm:flex-row">
              <button onClick={() => onNavigate("#projects")} className="btn-primary">
                View My Work
              </button>
              <button onClick={() => onNavigate("#about-me")} className="btn-secondary">
                About Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
