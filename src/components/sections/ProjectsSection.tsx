import { ProjectCarousel } from "../ProjectCarousel";

export function ProjectsSection() {
  return (
    <section id="projects" className="section-band" aria-labelledby="projects-heading">
      <div className="content-shell pb-12">
        <div className="relative">
          <h2
            id="projects-heading"
            className="section-title pointer-events-none absolute inset-x-0 top-0 z-10 -mt-16 sm:-mt-12 flex justify-center px-4 lg:-mt-6"
          >
            <span className="header-surface relative block w-max max-w-[min(100%,42rem)] rounded-2xl px-6 py-3 text-center tracking-wide">
              Featured <span className="keyword-accent">Projects</span>
            </span>
          </h2>
          <div className="pt-16 sm:pt-20 md:pt-24">
            <ProjectCarousel layoutMode="multi" />
          </div>
        </div>
      </div>
    </section>
  );
}
