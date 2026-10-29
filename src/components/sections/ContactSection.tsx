import { AdaptiveGrid } from "../AdaptiveGrid";
import { ContactForm } from "../ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="section-band" aria-labelledby="contact-heading">
      <div className="content-shell">
        <h2
          id="contact-heading"
          className="mb-10 max-w-5xl font-display text-[clamp(2.25rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-[var(--color-text)] sm:mb-14"
        >
          Let&apos;s <span className="keyword-accent">Work</span> Together
        </h2>

        <AdaptiveGrid mode="multi" className="items-start">
          <div className="viewport-animate w-full text-left">
            <p className="mb-8 max-w-prose text-base leading-7 text-[var(--color-muted)] sm:text-lg sm:leading-8">
              I&apos;m always interested in new opportunities and exciting projects. Whether you have a
              question or just want to say hi, I&apos;ll try my best to get back to you.
            </p>

            <dl className="mb-8 space-y-3 font-mono text-sm text-[var(--color-muted)] sm:text-base">
              <div>
                <dt className="text-xs uppercase tracking-widest text-[var(--color-soft)]">Email</dt>
                <dd>
                  <a
                    href="mailto:nichg999@gmail.com"
                    className="focus-ring inline-block text-[var(--color-link)] underline-offset-4 hover:underline"
                  >
                    nichg999@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-[var(--color-soft)]">Phone</dt>
                <dd>Available upon request</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-[var(--color-soft)]">Location</dt>
                <dd>Available for remote work</dd>
              </div>
            </dl>

            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/nicholas-griffiths-1a1883220/"
                className="focus-ring inline-flex items-center rounded-md px-2 py-2 font-mono text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-dev)]"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/nickgriff99"
                className="focus-ring inline-flex items-center rounded-md px-2 py-2 font-mono text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-dev)]"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="viewport-animate w-full">
            <div className="rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] p-6 shadow-[6px_6px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)] sm:p-7">
              <ContactForm />
            </div>
          </div>
        </AdaptiveGrid>
      </div>
    </section>
  );
}
