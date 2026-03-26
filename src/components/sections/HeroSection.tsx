type HeroSectionProps = {
  onNavigate: (href: string) => void;
};

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section id="home" className="section-band section-hero min-h-screen pt-24">
      <div className="content-shell flex min-h-[72vh] flex-col items-center justify-center text-center">
        <h1 className="viewport-animate mb-5 text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-7xl">
          Hello, I&apos;m <span className="keyword-accent">Nicholas Griffiths</span>
        </h1>
        <h2 className="viewport-animate mb-6 text-2xl font-semibold text-[var(--color-muted)] sm:text-3xl">
          Full Stack <span className="keyword-link">Web Developer</span>
        </h2>
        <p className="viewport-animate mb-10 max-w-3xl text-lg leading-8 text-[var(--color-soft)]">
          I create exceptional digital experiences through <span className="keyword-highlight">clean code</span> and innovative design.
        </p>
        <div className="viewport-animate flex flex-col gap-4 sm:flex-row">
          <button onClick={() => onNavigate("#projects")} className="btn-primary">
            View My Work
          </button>
          <button onClick={() => onNavigate("#contact")} className="btn-secondary">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  );
}
