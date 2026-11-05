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
      <div className="section-band page-offset">
        <div className="content-shell">
          <Link to="/" className="back-link">
            ← Back to home
          </Link>

          {/* Same terminal as Home; `embedded` drops its own section padding so
              this page matches Projects/About (content-shell under the nav). */}
          <TerminalSession embedded />
        </div>
      </div>

      <SectionRule label="contact" />
      <ContactSection />
      <Footer />
    </>
  );
}
