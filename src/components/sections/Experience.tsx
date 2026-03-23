import { experienceData } from "../../data/experience";
import { Timeline } from "../Timeline";

export function Experience() {
  return (
    <section id="experience" className="section-band">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="keyword-highlight">Experience</span>
        </h2>
        <Timeline items={experienceData} />
      </div>
    </section>
  );
}
