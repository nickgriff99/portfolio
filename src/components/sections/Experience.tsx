import { experienceData } from "../../data/experience";
import { Timeline } from "../Timeline";

export function Experience() {
  return (
    <section id="experience" className="section-band">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3 tracking-wide">
            <span className="keyword-highlight">Experience</span>
          </span>
        </h2>
        <Timeline items={experienceData} />
      </div>
    </section>
  );
}
