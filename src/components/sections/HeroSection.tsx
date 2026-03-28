import { useRef } from "react";

import VariableProximity from "@/bits/VariableProximity";
import ShinyText from "@/bits/ShinyText";
import Particles from "@/bits/Particles";
import { cn } from "@/lib/utils";
import TextType from "@/bits/TextType";

type HeroSectionProps = {
  onNavigate: (href: string) => void;
  /** When true, apply CSS hero gradients (Grainient/Particles did not initialize). */
  useHeroCssFallback: boolean;
  onParticlesUnavailable: () => void;
};

export function HeroSection({ onNavigate, useHeroCssFallback, onParticlesUnavailable }: HeroSectionProps) {
  const heroContainerRef = useRef<HTMLElement | null>(null);

  return (
    <section
      id="home"
      ref={heroContainerRef}
      className={cn(
        "section-band section-hero relative min-h-screen overflow-visible pt-24",
        useHeroCssFallback && "section-hero--css-fallback",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-[max(5rem,12vw)] -bottom-[calc(max(5rem,12vw)+min(28vh,14rem))] z-0">
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
      <div className="content-shell relative z-20 flex min-h-[72vh] flex-col items-center justify-center text-center">
        <h1 className="viewport-animate mb-5 text-4xl font-extrabold text-[var(--color-text)] sm:text-5xl lg:text-7xl">
          Hello, I&apos;m{" "}
          <ShinyText
            text="Nicholas Griffiths"
            speed={4}
            delay={0}
            color="#f59e0b"
            shineColor="#fcd34d"
            spread={70}
            direction="left"
            yoyo={false}
            pauseOnHover
            disabled={false}
        />
        </h1>
        <h2 className="viewport-animate mb-6 text-2xl font-semibold text-[var(--color-link)] sm:text-3xl tracking-wider">
          <TextType
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
          <button onClick={() => onNavigate("#about-me")} className="btn-secondary">
            About Me
          </button>
        </div>
      </div>
    </section>
  );
}
