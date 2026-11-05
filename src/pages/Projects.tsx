import { Link } from "react-router-dom";

import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { ProjectsShowcase } from "../components/ProjectsShowcase";
import { SectionRule } from "../components/SectionRule";
import { ContactSection } from "../components/sections/ContactSection";
import { NAV_ITEMS } from "../data/navItems";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { scrollToId } from "../lib/scrollToId";

export function Projects() {
  useRevealOnScroll();
  // ContactSection now renders on every page (id="contact" always in the DOM), so
  // useHomeAnchor's DOM-presence check always takes this branch instead of routing -
  // it needs a real scroll, not the no-op it used to get away with.
  const handleNavigate = (href: `#${string}`) => scrollToId(href.slice(1));

  return (
    <>
      {/* No scroll-spy or hide-on-scroll off the page: NavBar always visible here,
          "Projects" highlighted via its own route match (see NavBar's isActive for
          type:"anchor-or-route"). */}
      <NavBar items={NAV_ITEMS} activeSection="" hidden={false} compact={false} onNavigate={handleNavigate} />
      <div className="section-band page-offset">
        <div className="content-shell">
          <Link to="/" className="back-link">
            ← Back to home
          </Link>

          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[var(--color-soft)]">
            // projects
          </p>
          <h1 className="section-title text-left">All Projects</h1>

          <div className="mt-10">
            <ProjectsShowcase />
          </div>
        </div>
      </div>

      <SectionRule label="contact" />
      <ContactSection />
      <Footer />
    </>
  );
}
