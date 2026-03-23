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
            onClick={() => setSelectedFilter(category.key)}
            className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
              selectedFilter === category.key
                ? "bg-brand-primary text-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-brand-primary hover:text-white"
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
            className="overflow-hidden rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-all duration-300"
          >
            <div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-700 text-xl font-bold text-white">
              {project.title}
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-zinc-800">{project.title}</h3>
                {project.featured ? (
                  <span className="rounded-full bg-brand-primary px-2 py-1 text-xs font-bold text-white">
                    Featured
                  </span>
                ) : null}
              </div>

              <p className="leading-7 text-zinc-500">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-md border-2 border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary transition-all duration-300 hover:bg-brand-primary hover:text-white"
              >
                GitHub
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
