import { AdaptiveGrid } from "../AdaptiveGrid";

export function AboutMe() {
  return (
    <section id="about-me" className="section-band">
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
                I build full-stack products end-to-end — from the PostgreSQL schema to a Three.js configurator people
                actually enjoy using. Clean architecture and a sharp interface aren&apos;t separate skills to me; the
                stack and the experience get designed together, which is exactly what this site is built to prove.
              </p>
              <p className="mb-6 text-lg leading-8 text-[var(--color-muted)]">
                I recently wrapped a six-month React contract at Spot Parking, I&apos;m currently a Data Labeller at
                Tesla, and I&apos;m actively looking for a full-stack role where I can do this full-time.
              </p>
              <p className="text-lg leading-8 text-[var(--color-muted)]">
                Oh, and careful what you say around my receipts-bot — he keeps receipts. 😉
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
