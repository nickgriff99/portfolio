import { useMemo } from "react";

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

      <main className="w-full">
        <HeroSection onNavigate={handleNavClick} />
        <AboutMe />
        <SkillsAndTechnologies />
        <Experience />
        <Education />
        <ProjectsSection />
        <ContactSection />
      </main>

      <Footer />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl text-white shadow-lg shadow-black/20 transition-all duration-300 hover:brightness-110 ${
          showBackToTop ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        ↑
      </button>
    </>
  );
}
