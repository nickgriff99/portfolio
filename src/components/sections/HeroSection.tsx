import { useRef } from "react";

import VariableProximity from "@/bits/VariableProximity";
import ShinyText from "@/bits/ShinyText";
import Particles from "@/bits/Particles";

type HeroSectionProps = {
  onNavigate: (href: string) => void;
};

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const heroContainerRef = useRef<HTMLElement | null>(null);

  return (
    <section
      id="home"
      ref={heroContainerRef}
      className="section-band section-hero relative min-h-screen overflow-visible pt-24"
    >
      <div className="pointer-events-none absolute -inset-[max(5rem,12vw)] z-0">
        <Particles
          interactionRef={heroContainerRef}
          interactionProximityPx={900}
          particleColors={["#ffffff"]}
          particleCount={600}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles
          disableRotation
          pixelRatio={4}
        />
      </div>
      <div className="content-shell relative z-20 flex min-h-[72vh] flex-col items-center justify-center text-center">
        <h1 className="viewport-animate mb-5 text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-7xl">
          Hello, I&apos;m{" "}
          <ShinyText
            text="Nicholas Griffiths"
            speed={2.7}
            delay={0}
            color="#2e8b57"
            shineColor="#46ce81"
            spread={70}
            direction="left"
            yoyo={false}
            pauseOnHover
            disabled={false}
        />
        </h1>
        <h2 className="viewport-animate mb-6 text-2xl font-semibold text-[var(--color-muted)] sm:text-3xl">
          Full Stack <span className="keyword-link">Web Developer</span>
        </h2>
        <p className="viewport-animate mb-10 max-w-3xl text-lg leading-8 text-[var(--color-soft)]">
          I create exceptional digital experiences through <span className="keyword-highlight">clean code</span> and{" "}
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
          <button onClick={() => onNavigate("#contact")} className="btn-secondary">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  );
}
