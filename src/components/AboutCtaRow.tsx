type AboutCtaRowProps = {
  /** Anchor nav - same-page scroll on Home, cross-page `/#id` navigate elsewhere (see useHomeAnchor). */
  onNavigate: (href: `#${string}`) => void;
};

/** Shared Experience/Contact/Resume CTA row - used by the Home AboutMe section and the /about page. */
export function AboutCtaRow({ onNavigate }: AboutCtaRowProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-sm uppercase tracking-wide">
      <button
        type="button"
        onClick={() => onNavigate("#experience")}
        className="focus-ring text-[var(--color-link)] transition-colors hover:text-[var(--color-accent)]"
      >
        Experience →
      </button>
      <button
        type="button"
        onClick={() => onNavigate("#contact")}
        className="focus-ring text-[var(--color-link)] transition-colors hover:text-[var(--color-accent)]"
      >
        Contact →
      </button>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring text-[var(--color-link)] transition-colors hover:text-[var(--color-accent)]"
      >
        Resume ↗
      </a>
    </div>
  );
}
