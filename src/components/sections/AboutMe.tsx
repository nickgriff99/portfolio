import { AdaptiveGrid } from "../AdaptiveGrid";

export function AboutMe() {
  return (
    <section id="about" className="section-band">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3 tracking-wide">
            About <span className="keyword-link">Me</span>
          </span>
        </h2>
        <AdaptiveGrid mode="multi" className="items-center">
          <div className="viewport-animate w-full">
            <div className="header-surface relative rounded-2xl p-8">
              <p className="mb-6 text-lg leading-8 text-[var(--color-muted)]">
                Hello world! I&apos;m Nick, a web developer with a strong focus on professionalism and attention to
                detail-making your site look EXTRA nice. With a diverse background spanning management, sales, and
                quality assurance, I bring valuable real-world experience and exceptional time management skills to every
                project.
              </p>
              <p className="mb-6 text-lg leading-8 text-[var(--color-muted)]">
                As a natural leader who believes in team success, I work tirelessly to ensure the highest quality in
                everything I deliver. I currently work with Spot parking as a Junior React Developer Intern. I also work as a QA/R&D Engineer with Tesla and freelance web developer, I
                specialize in creating user-friendly, gorgeous websites that enhance your online presence and drive
                results.
              </p>
              <p className="text-lg leading-8 text-[var(--color-muted)]">
                I&apos;m passionate about continuous learning and staying current with emerging technologies and trends. My
                approach combines strong people skills and work ethic from my previous roles with ever-evolving web
                development expertise, always looking for ways to improve operations and enhance the user experience.
              </p>
            </div>
          </div>

          <div className="viewport-animate mx-auto max-w-xl">
            <img
              src="/assets/images/profile-family.jpg"
              alt="Nicholas Griffiths"
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </AdaptiveGrid>
      </div>
    </section>
  );
}
