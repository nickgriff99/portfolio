import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

import { projectsData } from "../data/projects";
import { projectDetails } from "../data/projectDetails";
import { useHoverCapablePointer } from "../hooks/useHoverCapablePointer";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Project } from "../types";

function categoryPillClass(category: Project["category"]) {
  if (category === "frontend") return "bg-[var(--color-accent)] text-[#0a0a0a]";
  if (category === "fullstack") return "bg-[var(--color-link)] text-[#0a0a0a]";
  return "bg-[var(--color-dev)] text-[#f4f4f5]";
}

function isDiscontinued(project: Project): boolean {
  return (
    project.metrics?.some((metric) => /discontinued/i.test(metric)) === true ||
    /discontinued/i.test(project.deploymentNote ?? "")
  );
}

const TILE_CHROME =
  "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[8px] border-2 bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] shadow-[6px_6px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)]";

function ProjectImage({
  project,
  compact,
  reducedMotion,
}: {
  project: Project;
  compact?: boolean;
  reducedMotion?: boolean;
}) {
  const motionDuration = reducedMotion ? "duration-0" : "duration-300";
  const frame = compact
    ? "relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-bg-soft)]"
    : "relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-bg-soft)] sm:aspect-[16/9]";

  if (!project.imageSrc) {
    return (
      <div className={`${frame} flex items-center justify-center`}>
        <Terminal
          className={`aspect-square h-auto w-1/5 min-w-12 shrink-0 text-[var(--color-muted)] opacity-40 transition-[transform,filter] ${motionDuration} group-hover:scale-105 group-hover:blur-[2px]`}
          strokeWidth={1.25}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--color-bg)_55%,transparent)] opacity-0 transition-opacity ${motionDuration} group-hover:opacity-100`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-0 flex scale-95 items-center justify-center opacity-0 transition-[opacity,transform] ${motionDuration} group-hover:scale-100 group-hover:opacity-100`}
          aria-hidden
        >
          <span className="font-mono text-xl font-bold uppercase tracking-wide text-[var(--color-link)] sm:text-2xl">
            See more →
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={frame}>
      <img
        src={project.imageSrc}
        alt={compact ? "" : project.imageAlt}
        className={`h-full w-full object-cover object-center transition-[transform,filter] ${motionDuration} group-hover:scale-105 group-hover:blur-[2px]`}
        loading="lazy"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--color-bg)_72%,transparent)] via-transparent to-transparent"
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--color-bg)_55%,transparent)] opacity-0 transition-opacity ${motionDuration} group-hover:opacity-100`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 flex scale-95 items-center justify-center opacity-0 transition-[opacity,transform] ${motionDuration} group-hover:scale-100 group-hover:opacity-100`}
        aria-hidden
      >
        <span className="font-mono text-xl font-bold uppercase tracking-wide text-[var(--color-link)] sm:text-2xl">
          See more →
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isHoverCapable = useHoverCapablePointer();
  const reducedMotion = usePrefersReducedMotion();
  const detail = projectDetails[project.id];
  const durationClass = reducedMotion ? "duration-0" : "duration-300";

  const hoverClasses = isHoverCapable
    ? `group ${durationClass} hover:border-[color-mix(in_srgb,var(--color-link)_70%,transparent)] hover:shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-link)_45%,transparent)]`
    : "";

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`${TILE_CHROME} ${hoverClasses} border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] text-left transition-[border-color,box-shadow] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]`}
    >
      <ProjectImage project={project} compact reducedMotion={reducedMotion} />
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-[var(--color-text)]">
            {project.title}
          </span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryPillClass(project.category)}`}
          >
            {project.category}
          </span>
        </div>

        {isDiscontinued(project) ? (
          <span className="w-fit rounded-lg border border-[color-mix(in_srgb,var(--color-highlight)_50%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-highlight)]">
            Discontinued
          </span>
        ) : null}

        {detail ? (
          <p className="text-sm leading-snug text-[var(--color-muted)]">{detail.cardSnippet}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="inline-block rounded-full border border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_10%,transparent)] px-3 py-1 text-xs text-[var(--color-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="mt-auto text-sm font-semibold text-[var(--color-link)]">Learn more →</p>
      </div>
    </Link>
  );
}

export function ProjectsShowcase() {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
      {projectsData.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
