import { useMemo, useState, type ReactNode } from "react";

import { CheckCircle2, Terminal } from "lucide-react";

import { projectsData } from "../data/projects";
import type { Project } from "../types";

type FilterKey = "all" | "frontend" | "backend" | "fullstack" | "client";

const filterCategories: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "fullstack", label: "Full-stack" },
  { key: "client", label: "Client work" },
];

function categoryPillClass(category: Project["category"]) {
  if (category === "frontend") return "bg-[var(--color-accent)] text-[#0a0a0a]";
  if (category === "fullstack") return "bg-[var(--color-link)] text-[#0a0a0a]";
  return "bg-[var(--color-dev)] text-[#f4f4f5]";
}

function projectPrimaryHref(project: Project): string | undefined {
  return project.liveUrl ?? project.githubLink;
}

function projectPrimaryLabel(project: Project): string {
  if (project.liveUrl) return "Open live site";
  if (project.githubLink) return "View source";
  return "";
}

function ProjectCard({ project }: { project: Project }) {
  const primaryHref = projectPrimaryHref(project);
  const primaryLabel = projectPrimaryLabel(project);

  let secondarySlot: ReactNode;
  if (project.liveUrl && project.githubLink) {
    secondarySlot = (
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_55%,transparent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--color-link)_45%,transparent)] hover:text-[var(--color-link)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        View source
      </a>
    );
  } else if (project.liveUrl && !project.githubLink) {
    secondarySlot = (
      <span className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_48%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_8%,transparent)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-muted)]">
        {project.isClientProject ? "Client deliverable — repo private" : "Live product — no repo linked"}
      </span>
    );
  } else {
    secondarySlot = null;
  }

  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] shadow-[6px_6px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)] transition-[box-shadow,transform,border-color] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-link)_70%,transparent)] hover:shadow-[10px_10px_0_0_color-mix(in_srgb,var(--color-link)_55%,transparent)] motion-reduce:transition-none">
      {project.imageSrc ? (
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-bg-soft)]">
          <img
            src={project.imageSrc}
            alt={project.imageAlt}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
            loading="lazy"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--color-bg)_72%,transparent)] via-transparent to-transparent"
            aria-hidden
          />
        </div>
      ) : (
        <div className="relative flex aspect-[16/10] w-full shrink-0 items-center justify-center overflow-hidden bg-[var(--color-bg-soft)]">
          <Terminal className="size-12 text-[var(--color-muted)] opacity-40" aria-hidden />
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-7">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className="font-display text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl"
                  id={`project-heading-${project.id}`}
                >
                  {project.title}
                </h3>
                {project.isClientProject ? (
                  <span className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Client
                  </span>
                ) : null}
              </div>
              {project.role ? (
                <p className="text-xs font-medium text-[var(--color-muted)]">{project.role}</p>
              ) : null}
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${categoryPillClass(project.category)}`}
            >
              {project.category}
            </span>
          </div>

          <p className="mt-3 shrink-0 text-sm font-medium leading-snug text-[var(--color-link)]">{project.tagline}</p>

          {project.metrics && project.metrics.length > 0 ? (
            <ul className="mt-3 flex shrink-0 flex-wrap gap-2" aria-label="Project notes">
              {project.metrics.map((m) => (
                <li key={m}>
                  <span className="inline-block rounded-lg border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_12%,transparent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-soft)]">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <ul
            className="mt-4 flex min-h-0 flex-1 list-none flex-col gap-2.5 text-sm leading-relaxed text-[var(--color-muted)]"
            aria-label="Highlights"
          >
            {project.highlights.map((line) => (
              <li key={line} className="flex gap-2.5">
                <CheckCircle2
                  className="mt-0.5 size-[1.1rem] shrink-0 text-[var(--color-accent)] opacity-90"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="sr-only">{project.description}</p>
        </div>

        <div className="mt-auto flex shrink-0 flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-border)_28%,transparent)] pt-6">
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

          {project.deploymentNote ? (
            <p className="text-xs leading-relaxed text-[var(--color-soft)]">{project.deploymentNote}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {primaryHref ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-[filter] duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:min-w-0"
                aria-describedby={`project-heading-${project.id}`}
              >
                {primaryLabel}
              </a>
            ) : (
              <span className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_48%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_8%,transparent)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-muted)]">
                No link configured
              </span>
            )}
            {secondarySlot}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsShowcase() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projectsData;
    if (filter === "client") return projectsData.filter((p) => p.isClientProject);
    return projectsData.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <div className="viewport-animate w-full">
      <div
        className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
        role="region"
        aria-label="Filter projects"
      >
        <p className="text-center text-sm text-[var(--color-muted)] sm:text-left">
          Filter by stack or surface client work.
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
          {filterCategories.map(({ key, label }) => {
            const selected = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={selected}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
                  selected
                    ? "bg-[var(--color-accent)] text-[#0a0a0a]"
                    : "border border-[color-mix(in_srgb,var(--color-border)_45%,transparent)] text-[var(--color-muted)] hover:border-[color-mix(in_srgb,var(--color-link)_35%,transparent)] hover:text-[var(--color-text)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-6 py-12 text-center text-[var(--color-muted)]">
          No projects match this filter.
        </p>
      ) : (
        <ul className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <li key={project.id} className="flex min-h-0 w-full">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
