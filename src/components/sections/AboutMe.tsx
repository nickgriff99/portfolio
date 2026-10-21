export function AboutMe() {
  return (
    <section id="about-me" className="section-band">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3 tracking-wide">
            About <span className="keyword-link">Me</span>
          </span>
        </h2>
        <div className="viewport-animate text-column text-left">
          <p className="mb-8 text-xl font-semibold leading-snug tracking-tight text-[var(--color-text)] sm:text-2xl sm:leading-snug lg:text-3xl">
            I build full-stack products end-to-end — from the PostgreSQL schema to a Three.js configurator people
            actually enjoy using. Clean architecture and a sharp interface aren&apos;t separate skills to me; the
            stack and the experience get designed together, which is exactly what this site is built to prove.
          </p>
          <p className="mb-6 text-base leading-7 text-[var(--color-muted)] sm:text-lg sm:leading-8">
            I recently wrapped a six-month React contract at Spot Parking, I&apos;m currently a Data Labeller at
            Tesla, and I&apos;m actively looking for a full-stack role where I can do this full-time.
          </p>
          <p className="font-mono text-sm leading-6 text-[var(--color-dev)] sm:text-base">
            <span aria-hidden="true" className="text-[color-mix(in_srgb,var(--color-dev)_55%,transparent)]">
              {"// "}
            </span>
            Oh, and careful what you say around my receipts-bot... he keeps receipts... 😉
          </p>
        </div>
      </div>
    </section>
  );
}
