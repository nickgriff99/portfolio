import { SkillsWidget } from "../SkillsWidget";

export function SkillsAndTechnologies() {
  return (
    <section id="skills" className="section-band section-alt">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="keyword-accent">Skills</span> &amp; <span className="keyword-link">Technologies</span>
        </h2>
        <div className="viewport-animate">
          <SkillsWidget />
        </div>
      </div>
    </section>
  );
}
