import { AdaptiveGrid } from "../AdaptiveGrid";
import { ContactForm } from "../ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="section-band">
      <div className="content-shell">
        <h2 className="section-title">
          <span className="header-surface relative inline-block rounded-2xl px-6 py-3">
            Get In <span className="keyword-highlight">Touch</span>
          </span>
        </h2>
        <AdaptiveGrid mode="multi" className="items-start">
          <div className="viewport-animate w-full">
            <div className="header-surface relative rounded-2xl p-6">
              <h3 className="mb-6 text-3xl font-semibold text-[var(--color-text)]">
                Let&apos;s <span className="keyword-accent">Work Together</span>
              </h3>
              <p className="mb-8 leading-7 text-[var(--color-muted)]">
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
                  className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-highlight)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/nickgriff99"
                  className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-highlight)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="viewport-animate w-full">
            <div className="header-surface relative rounded-2xl p-6">
              <ContactForm />
            </div>
          </div>
        </AdaptiveGrid>
      </div>
    </section>
  );
}
