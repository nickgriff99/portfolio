import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { SectionRule } from "../components/SectionRule";
import { ContactSection } from "../components/sections/ContactSection";
import { architectureDiagrams } from "../data/architectureDiagrams";
import { NAV_ITEMS } from "../data/navItems";
import { projectReadmes } from "../data/projectReadmes";
import { projectsData } from "../data/projects";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { scrollToId } from "../lib/scrollToId";

// ContactSection now renders on every page (id="contact" always in the DOM), so
// useHomeAnchor's DOM-presence check always takes NavBar's onNavigate branch instead
// of routing - it needs a real scroll, not the no-op it used to get away with.
function handleNavigate(href: `#${string}`) {
  scrollToId(href.slice(1));
}

export function ProjectReadme() {
  const { slug } = useParams<{ slug: string }>();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useRevealOnScroll();

  // Same pattern as ProjectDetail: route shares a dynamic segment, so React Router
  // won't remount the tree on slug change - move focus to the h1 ourselves.
  useEffect(() => {
    headingRef.current?.focus();
  }, [slug]);

  const project = projectsData.find((p) => p.slug === slug);
  const readme = project ? projectReadmes[project.id] : undefined;
  const diagram = project ? architectureDiagrams[project.id] : undefined;

  if (!project || !readme) {
    return (
      <>
        <NavBar items={NAV_ITEMS} activeSection="" hidden={false} compact={false} onNavigate={handleNavigate} />
        <div className="section-band page-offset flex items-center justify-center px-5 text-center">
          <div>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mb-4 text-2xl font-bold text-[var(--color-text)] focus:outline-none"
            >
              Project not found
            </h1>
            <Link to="/#projects" className="focus-ring underline text-[var(--color-link)]">
              ← Back to projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar items={NAV_ITEMS} activeSection="" hidden={false} compact={false} onNavigate={handleNavigate} />
      <div className="section-band page-offset px-5 pb-16 sm:pb-20 md:pb-28">
        <div className="viewport-animate mx-auto w-full max-w-4xl">
        <Link
          to={`/projects/${project.slug}`}
          className="back-link"
        >
          ← Back to project overview
        </Link>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)] focus:outline-none md:text-4xl"
        >
          {project.title}
        </h1>

        <p className="mt-4 text-lg leading-7 text-[var(--color-muted)]">{readme.intro}</p>

        {diagram && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold text-[var(--color-text)] md:text-2xl">
              Architecture at a glance
            </h2>
            <div className="mt-3">
              <ArchitectureDiagram diagram={diagram} title={`${project.title} architecture diagram`} />
            </div>
          </section>
        )}

        {readme.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="font-display text-xl font-bold text-[var(--color-text)] md:text-2xl">
              {section.heading}
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {section.body.map((paragraph, index) => (
                <p
                  key={`${section.heading}-${index}`}
                  className="text-base leading-7 text-[var(--color-muted)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
      </div>

      <SectionRule label="contact" />
      <ContactSection />
      <Footer />
    </>
  );
}
