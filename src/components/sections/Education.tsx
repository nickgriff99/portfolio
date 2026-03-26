import { educationData } from "../../data/education";
import { Timeline } from "../Timeline";

export function Education() {
  return (
    <section id="education" className="section-band section-alt">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3">
            <span className="keyword-link">Education</span>
          </span>
        </h2>
        <Timeline items={educationData} />
      </div>
    </section>
  );
}
