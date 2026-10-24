import { useMemo, useState } from "react";

import Grainient from "@/bits/Grainient";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { AboutMe } from "../components/sections/AboutMe";
import { ContactSection } from "../components/sections/ContactSection";
import { Education } from "../components/sections/Education";
import { Experience } from "../components/sections/Experience";
import { HeroSection } from "../components/sections/HeroSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { SkillsAndTechnologies } from "../components/sections/SkillsAndTechnologies";
import { usePortfolioScroll } from "../hooks/usePortfolioScroll";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useMagneticHover } from "../hooks/useMagneticHover";
import type { NavItem } from "../types";

export function Home() {
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Experience", href: "#experience" },
      { label: "Education", href: "#education" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
    [],
  );

  const sectionIds = useMemo(
    () => [
      "home",
      "about",
      "skills",
      "experience",
      "education",
      "projects",
      "contact",
    ],
    [],
  );

  const { activeSection, headerHidden, showBackToTop, scrollToSection } =
    usePortfolioScroll(sectionIds);

  useRevealOnScroll();

  const backToTopRef = useMagneticHover<HTMLButtonElement>({ strength: 3 });

  const [grainientUnavailable, setGrainientUnavailable] = useState(false);
  const [particlesUnavailable, setParticlesUnavailable] = useState(false);
  const useHeroCssFallback = grainientUnavailable || particlesUnavailable;

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    scrollToSection(id);
  };

  return (
    <>
      <NavBar
        items={navItems}
        activeSection={activeSection}
        hidden={headerHidden}
        onNavigate={handleNavClick}
      />

      <div className="relative w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 min-h-full w-full"
        >
          <Grainient
            onUnavailable={() => setGrainientUnavailable(true)}
            color1="#000000"
            color2="#0d273B"
            color3="#194360"
            timeSpeed={0.05}
            colorBalance={-0.12}
            warpStrength={0.58}
            warpFrequency={0.48}
            warpSpeed={0}
            warpAmplitude={42}
            blendAngle={144}
            blendSoftness={1.28}
            rotationAmount={300}
            noiseScale={1.25}
            grainAmount={0}
            grainScale={0.2}
            grainAnimated={false}
            contrast={0.8}
            gamma={0.82}
            saturation={0.9}
            centerX={0.5}
            centerY={-0.5}
            zoom={0.6}
          />
        </div>

        <main className="relative z-10 w-full">
          <HeroSection
            onNavigate={handleNavClick}
            useHeroCssFallback={useHeroCssFallback}
            onParticlesUnavailable={() => setParticlesUnavailable(true)}
          />
          <AboutMe />
          <SkillsAndTechnologies />
          <Experience />
          <Education />
          <ProjectsSection />
          <ContactSection />
        </main>

        <div className="relative z-10">
          <Footer />
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <button
          ref={backToTopRef}
          type="button"
          aria-label="Return to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          // `transform` deliberately excluded: `useMagneticHover` owns it (mousemove-tracked
          // x/y) — a CSS transform transition here would fight the GSAP tween frame-by-frame.
          // Only `opacity`/`filter` (visibility fade + hover brightness) need one.
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl text-[#0a0a0a] shadow-lg shadow-black/20 transition-[opacity,filter] duration-300 hover:brightness-110 ${
            showBackToTop ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
          }`}
        >
          ↑
        </button>
      </div>
    </>
  );
}
