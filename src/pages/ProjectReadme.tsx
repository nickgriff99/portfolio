import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { projectReadmes } from "../data/projectReadmes";
import { projectsData } from "../data/projects";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

export function ProjectReadme() {
  const { slug } = useParams<{ slug: string }>();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useRevealOnScroll();

  // Same pattern as ProjectDetail: route shares a dynamic segment, so React Router
  // won't remount the tree on slug change — move focus to the h1 ourselves.
  useEffect(() => {
    headingRef.current?.focus();
  }, [slug]);

  const project = projectsData.find((p) => p.slug === slug);
  const readme = project ? projectReadmes[project.id] : undefined;

  if (!project || !readme) {
    return (
      <div className="section-band flex min-h-screen items-center justify-center px-5 text-center">
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
    );
  }

  return (
    <div className="section-band min-h-screen px-5 py-16 sm:py-20 md:py-28">
      <div className="viewport-animate mx-auto w-full max-w-4xl">
        <Link
          to={`/projects/${project.slug}`}
          className="focus-ring inline-block text-sm text-[var(--color-link)] underline"
        >
          ← Back to project overview
        </Link>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--color-text)] focus:outline-none md:text-4xl"
        >
          {project.title}
        </h1>

        <p className="mt-4 text-lg leading-7 text-[var(--color-muted)]">{readme.intro}</p>

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
  );
}
