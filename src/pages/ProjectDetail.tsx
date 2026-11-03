import { CheckCircle2, ExternalLink, Github, Terminal } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { projectDetails } from "../data/projectDetails";
import { projectsData } from "../data/projects";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import type { Project } from "../types";

function categoryPillClass(category: Project["category"]) {
  if (category === "frontend") return "bg-[var(--color-accent)] text-[#0a0a0a]";
  if (category === "fullstack") return "bg-[var(--color-link)] text-[#0a0a0a]";
  return "bg-[var(--color-dev)] text-[#f4f4f5]";
}

function HeroImage({ project }: { project: Project }) {
  if (!project.imageSrc) {
    return (
      <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[var(--color-bg-soft)]">
        <Terminal
          className="aspect-square h-auto w-1/5 min-w-12 shrink-0 text-[var(--color-muted)] opacity-40"
          strokeWidth={1.25}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[var(--color-bg-soft)]">
      <img
        src={project.imageSrc}
        alt={project.imageAlt ?? ""}
        className="h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useRevealOnScroll();

  // Route is the same pattern (/projects/:slug -> /projects/:slug) on prev/next, so
  // React Router doesn't remount the tree the way a hard navigation does; move focus
  // to the h1 ourselves so keyboard/SR users get a clear "landed on new page" signal.
  useEffect(() => {
    headingRef.current?.focus();
  }, [slug]);

  const index = projectsData.findIndex((p) => p.slug === slug);
  const project = index >= 0 ? projectsData[index] : undefined;

  if (!project) {
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

  const detail = projectDetails[project.id];
  const prevProject = projectsData[(index - 1 + projectsData.length) % projectsData.length];
  const nextProject = projectsData[(index + 1) % projectsData.length];

  return (
    <div className="section-band min-h-screen px-5 py-16 sm:py-20 md:py-28">
      <div className="viewport-animate mx-auto w-full max-w-4xl">
        <HeroImage project={project} />

        <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)] focus:outline-none md:text-4xl"
          >
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryPillClass(project.category)}`}
            >
              {project.category}
            </span>
            {project.isClientProject ? (
              <span className="rounded-full border border-[color-mix(in_srgb,var(--color-link)_55%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-link)]">
                Client
              </span>
            ) : null}
          </div>
        </div>

        {project.role ? (
          <p className="mt-2 text-sm font-medium text-[var(--color-muted)]">{project.role}</p>
        ) : null}

        <p className="mt-4 text-lg leading-7 text-[var(--color-muted)]">{project.description}</p>

        {detail ? (
          <section aria-labelledby="feature-breakdown-heading" className="mt-8">
            <h2 id="feature-breakdown-heading" className="sr-only">
              Feature breakdown
            </h2>
            <ul className="flex flex-col gap-3">
              {detail.featureBreakdown.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-sm leading-6 text-[var(--color-text)]">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="tech-stack-heading" className="mt-8">
          <h2 id="tech-stack-heading" className="sr-only">
            Tech stack
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="inline-block rounded-full border border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_10%,transparent)] px-3 py-1 text-xs text-[var(--color-muted)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-4">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-2 rounded-xl border border-transparent bg-[var(--color-accent)] px-6 py-3 text-base font-medium text-[#0a0a0a] shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Live site
            </a>
          ) : null}
          {project.githubLink ? (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] px-6 py-3 text-base font-medium text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Github className="h-4 w-4" aria-hidden />
              Repository
            </a>
          ) : null}
          {!project.liveUrl && !project.githubLink && project.deploymentNote ? (
            <p className="text-sm text-[var(--color-soft)]">{project.deploymentNote}</p>
          ) : null}
        </div>
        {(project.liveUrl || project.githubLink) && project.deploymentNote ? (
          <p className="mt-3 text-sm text-[var(--color-soft)]">{project.deploymentNote}</p>
        ) : null}

        <nav
          aria-label="Other projects"
          className="mt-16 flex items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] pt-6"
        >
          <Link
            to={`/projects/${prevProject.slug}`}
            aria-label={`View previous project: ${prevProject.title}`}
            className="focus-ring flex flex-col text-left text-sm text-[var(--color-muted)] hover:text-[var(--color-link)]"
          >
            <span className="text-xs uppercase tracking-wide">← Previous</span>
            <span className="font-semibold text-[var(--color-text)]">{prevProject.title}</span>
          </Link>
          <Link
            to={`/projects/${nextProject.slug}`}
            aria-label={`View next project: ${nextProject.title}`}
            className="focus-ring flex flex-col text-right text-sm text-[var(--color-muted)] hover:text-[var(--color-link)]"
          >
            <span className="text-xs uppercase tracking-wide">Next →</span>
            <span className="font-semibold text-[var(--color-text)]">{nextProject.title}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
