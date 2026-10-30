import { lazy, Suspense } from "react";

const ProjectsShowcase = lazy(() =>
  import("../ProjectsShowcase").then((module) => ({ default: module.ProjectsShowcase })),
);

function ShowcaseFallback() {
  return (
    <div
      className="min-h-[40rem] w-full rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_80%,transparent)]"
      aria-hidden="true"
    />
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="section-band" aria-labelledby="projects-heading">
      <div className="content-shell">
        <h2 id="projects-heading" className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3">
            Featured <span className="keyword-accent">Projects</span>
          </span>
        </h2>
        <Suspense fallback={<ShowcaseFallback />}>
          <ProjectsShowcase />
        </Suspense>
      </div>
    </section>
  );
}
