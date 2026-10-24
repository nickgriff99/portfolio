import { projectFilterCategories, useProjectFilter } from "../../hooks/useProjectFilter";
import { ProjectsShowcase } from "../ProjectsShowcase";
import type { ProjectFilterKey } from "../../hooks/useProjectFilter";

interface FilterBarProps {
  filter: ProjectFilterKey;
  setFilter: (key: ProjectFilterKey) => void;
}

/** Filter pill row for the Projects section's heading block. */
function FilterBar({ filter, setFilter }: FilterBarProps) {
  return (
    <div
      className="viewport-animate mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
      role="region"
      aria-label="Filter projects"
    >
      <p className="text-center text-sm text-[var(--color-muted)] sm:text-left">
        Filter by stack or surface client work.
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
        {projectFilterCategories.map(({ key, label }) => {
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
  );
}

export function ProjectsSection() {
  const { filter, setFilter, filteredProjects } = useProjectFilter();

  return (
    <section id="projects" className="section-band" aria-labelledby="projects-heading">
      <div className="content-shell pb-12">
        <h2 id="projects-heading" className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3 tracking-wide">
            Featured <span className="keyword-accent">Projects</span>
          </span>
        </h2>
        <FilterBar filter={filter} setFilter={setFilter} />

        <ProjectsShowcase filteredProjects={filteredProjects} />
      </div>
    </section>
  );
}
