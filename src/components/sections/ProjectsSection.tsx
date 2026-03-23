import { ProjectCarousel } from "../ProjectCarousel";

export function ProjectsSection() {
  return (
    <section id="projects" className="section-band">
      <div className="content-shell pb-12">
        <h2 className="section-title">
          Featured <span className="keyword-accent">Projects</span>
        </h2>
        <ProjectCarousel layoutMode="multi" />
      </div>
    </section>
  );
}
