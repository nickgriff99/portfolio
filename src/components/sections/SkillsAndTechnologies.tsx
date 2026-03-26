import { SkillsWidget } from "../SkillsWidget";

export function SkillsAndTechnologies() {
  return (
    <section id="skills" className="section-band">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3">
            <span className="keyword-accent">Skills</span> &amp;{" "}
            <span className="keyword-link">Technologies</span>
          </span>
        </h2>
        <div className="viewport-animate">
          <SkillsWidget />
        </div>
      </div>
    </section>
  );
}
