import { Link } from "react-router-dom";

import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { SectionRule } from "../components/SectionRule";
import { ContactSection } from "../components/sections/ContactSection";
import { TerminalSession } from "../components/sections/TerminalSession";
import { NAV_ITEMS } from "../data/navItems";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

export function Experience() {
  useRevealOnScroll();

  return (
    <>
      {/* No scroll-spy or hide-on-scroll off the page: NavBar always visible here,
          "Experience" highlighted via its own route match (see NavBar's isActive for
          type:"anchor-or-route"). */}
      <NavBar items={NAV_ITEMS} activeSection="" hidden={false} compact={false} onNavigate={() => {}} />
      <div className="section-band min-h-screen pt-24 sm:pt-28">
        <div className="content-shell">
          <Link to="/" className="focus-ring mb-10 inline-block text-sm text-[var(--color-link)] underline">
            ← Back to home
          </Link>
        </div>

        {/* TerminalSession renders its own "experience"/"education" sections - zero
            props, self-contained (same component Home mounts, mounted a second time here). */}
        <TerminalSession />
      </div>

      <SectionRule label="contact" />
      <ContactSection />
      <Footer />
    </>
  );
}
