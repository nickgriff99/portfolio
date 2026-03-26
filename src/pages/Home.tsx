import { useMemo } from "react";

import Grainient from "@/bits/Grainient";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
// import { ThemeToggle } from "../components/ThemeToggle";
import { AboutMe } from "../components/sections/AboutMe";
import { ContactSection } from "../components/sections/ContactSection";
import { Education } from "../components/sections/Education";
import { Experience } from "../components/sections/Experience";
import { HeroSection } from "../components/sections/HeroSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { SkillsAndTechnologies } from "../components/sections/SkillsAndTechnologies";
import { usePortfolioScroll } from "../hooks/usePortfolioScroll";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
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
            color1="#000000"
            color2="#353131"
            color3="#25313c"
            timeSpeed={0.2}
            colorBalance={0.27}
            warpStrength={3.45}
            warpFrequency={6.4}
            warpSpeed={2}
            warpAmplitude={17}
            blendAngle={50}
            blendSoftness={0.6}
            rotationAmount={500}
            noiseScale={0.35}
            grainAmount={0}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1.25}
            saturation={1.4}
            centerX={-0.2}
            centerY={-0.15}
            zoom={0.9}
          />
        </div>

        <main className="relative z-10 w-full">
          <HeroSection onNavigate={handleNavClick} />
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
        {/* <ThemeToggle /> */}
        <button
          type="button"
          aria-label="Return to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl text-white shadow-lg shadow-black/20 transition-all duration-300 hover:brightness-110 ${
            showBackToTop ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
          }`}
        >
          ↑
        </button>
      </div>
    </>
  );
}
