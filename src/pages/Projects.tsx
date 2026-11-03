import { Link } from "react-router-dom";

import { NavBar } from "../components/NavBar";
import { ProjectsShowcase } from "../components/ProjectsShowcase";
import { NAV_ITEMS } from "../data/navItems";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

export function Projects() {
  useRevealOnScroll();

  return (
    <>
      {/* No scroll-spy or hide-on-scroll off the page: NavBar always visible here,
          "Projects" highlighted via its own route match (see NavBar's isActive for type:"route"). */}
      <NavBar items={NAV_ITEMS} activeSection="" hidden={false} onNavigate={() => {}} />
      <div className="section-band min-h-screen pt-24 sm:pt-28">
        <div className="content-shell">
          <Link to="/" className="focus-ring mb-10 inline-block text-sm text-[var(--color-link)] underline">
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
    </>
  );
}
