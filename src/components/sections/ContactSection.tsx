import { AdaptiveGrid } from "../AdaptiveGrid";
import { ContactForm } from "../ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="section-band">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3 tracking-wide">
            Get In <span className="keyword-highlight">Touch</span>
          </span>
        </h2>
        <AdaptiveGrid mode="multi" className="items-start">
          <div className="viewport-animate w-full text-left">
            <h3 className="mb-6 text-xl font-semibold leading-snug tracking-tight text-[var(--color-text)] sm:text-2xl lg:text-3xl">
              Let&apos;s <span className="keyword-accent">Work Together</span>
            </h3>
            <p className="text-column mb-8 leading-7 text-[var(--color-muted)]">
              I&apos;m always interested in new opportunities and exciting projects. Whether you have a question or just
              want to say hi, I&apos;ll try my best to get back to you!
            </p>
            <div className="mb-8 space-y-3 text-[var(--color-muted)]">
              <p>
                <strong>Email:</strong> nichg999@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> Available upon request
              </p>
              <p>
                <strong>Location:</strong> Available for remote work
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/nicholas-griffiths-1a1883220/"
                className="focus-ring inline-flex items-center rounded-md px-2 py-2 font-semibold text-[var(--color-accent)] hover:text-[var(--color-dev)]"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/nickgriff99"
                className="focus-ring inline-flex items-center rounded-md px-2 py-2 font-semibold text-[var(--color-accent)] hover:text-[var(--color-dev)]"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="viewport-animate w-full">
            {/* Form genuinely needs a frame (contained-input-area affordance) — reuse the
               Projects card's sharp sticker language (rounded-none, border-2, hard-offset
               shadow) for site-wide consistency, but skip the hover lift/escalation: this
               box isn't a nav target like a project card, so no hover-interactive signal. */}
            <div className="rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] p-6 shadow-[6px_6px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)] sm:p-7">
              <ContactForm />
            </div>
          </div>
        </AdaptiveGrid>
      </div>
    </section>
  );
}
