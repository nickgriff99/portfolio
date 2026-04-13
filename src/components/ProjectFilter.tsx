import { useMemo, useState } from "react";

import { projectsData } from "../data/projects";
import type { LayoutMode } from "../types";

type FilterKey = "all" | "frontend" | "backend";

const filterCategories: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All Projects" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
];

type ProjectFilterProps = {
  layoutMode?: LayoutMode;
};

function projectHref(project: (typeof projectsData)[number]) {
  return project.liveUrl ?? project.githubLink ?? "#";
}

export function ProjectFilter({ layoutMode = "multi" }: ProjectFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "all") {
      return projectsData;
    }

    return projectsData.filter((project) => project.category === selectedFilter);
  }, [selectedFilter]);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap justify-center gap-4">
        {filterCategories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setSelectedFilter(category.key)}
            className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
              selectedFilter === category.key
                ? "bg-[var(--color-accent)] text-[#0a0a0a]"
                : "border border-[color-mix(in_srgb,var(--color-border)_45%,transparent)] text-[var(--color-muted)] hover:border-[var(--color-link)] hover:text-[var(--color-text)]"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-8 ${layoutMode === "single" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="header-surface overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-border)_38%,transparent)] shadow-[0_12px_30px_color-mix(in_srgb,var(--color-bg)_52%,transparent)]"
          >
            <div className="relative h-[200px] overflow-hidden bg-[var(--color-bg-soft)]">
              <img
                src={project.imageSrc}
                alt=""
                className="h-full w-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[color-mix(in_srgb,var(--color-bg)_55%,transparent)] to-transparent p-4">
                <h3 className="text-center font-display text-xl font-bold text-[var(--color-text)]">{project.title}</h3>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <p className="text-sm text-[var(--color-muted)]">{project.tagline}</p>

              <p className="leading-relaxed text-[var(--color-muted)]">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_10%,transparent)] px-3 py-1 text-sm text-[var(--color-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={projectHref(project)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md border-2 border-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-[#0a0a0a]"
              >
                {project.liveUrl ? "Open site" : "View source"}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
