import { useMemo } from "react";

import { Card, CardSwap } from "./CardSwap";
import { projectsData } from "../data/projects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { LayoutMode, Project } from "../types";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type ProjectCarouselProps = {
  layoutMode?: LayoutMode;
};

export function ProjectCarousel({ layoutMode = "multi" }: ProjectCarouselProps) {
  const projects = useMemo(() => shuffleArray(projectsData), []);
  const prefersReducedMotion = usePrefersReducedMotion();

  const renderCardContent = (project: Project) => (
    <>
      <div className="relative flex h-[96px] items-center justify-between border-b border-white/15 bg-gradient-to-r from-[color-mix(in_srgb,var(--color-link)_58%,transparent)] to-[color-mix(in_srgb,var(--color-highlight)_52%,transparent)] px-6">
        <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">{project.title}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white ${
            project.category === "frontend" ? "bg-[var(--color-accent)]" : "bg-[var(--color-highlight)]"
          }`}
        >
          {project.category}
        </span>
      </div>

      <div className="flex h-[334px] flex-col p-6">
        <p className="mb-6 text-sm leading-7 text-[var(--color-muted)]">{project.description}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-[var(--color-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.githubLink}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex w-fit items-center rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
        >
          View Code
        </a>
      </div>
    </>
  );

  return (
    <div className="viewport-animate">
      {prefersReducedMotion ? (
        <div
          className={`grid gap-5 ${layoutMode === "single" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
        >
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-white/20 bg-[var(--color-surface)] shadow-[0_12px_30px_color-mix(in_srgb,var(--color-bg)_52%,transparent)]"
            >
              {renderCardContent(project)}
            </article>
          ))}
        </div>
      ) : (
        <CardSwap
          layoutMode={layoutMode}
          width="min(94vw, 640px)"
          height={430}
          cardDistance={100}
          verticalDistance={50}
          delay={4500}
          pauseOnHover
          skewAmount={0}
          easing="elastic"
        >
          {projects.map((project, index) => (
            <Card
              key={project.id}
              aria-label={`${project.title} project card ${index + 1}`}
              customClass="overflow-hidden border-white/20 bg-[var(--color-surface)] shadow-[0_18px_42px_color-mix(in_srgb,var(--color-bg)_66%,transparent)]"
            >
              {renderCardContent(project)}
            </Card>
          ))}
        </CardSwap>
      )}
    </div>
  );
}
