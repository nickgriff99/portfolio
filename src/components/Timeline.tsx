import type { TimelineEntry } from "../types";

export function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute bottom-0 left-5 top-0 w-0.5 bg-[var(--color-accent)] md:left-1/2 md:-translate-x-1/2" />
      {items.map((item, index) => {
        const isEven = index % 2 === 1;

        return (
          <article
            key={`${item.organization}-${item.title}`}
            className={`relative mb-8 w-full pl-12 pr-2 md:w-1/2 ${isEven ? "md:left-1/2 md:pl-8 md:pr-0" : "md:left-0 md:pl-0 md:pr-8"}`}
          >
            <div
              className={`absolute left-[14px] top-6 z-10 h-3 w-3 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-accent)] md:h-4 md:w-4 ${isEven ? "md:left-[-8px]" : "md:left-auto md:right-[-8px]"}`}
            />
            <div className="viewport-animate w-full">
              <div className="border-l-2 border-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] pl-6">
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
                  {item.title}
                </h3>
                <h4 className="mb-1 text-lg font-medium text-[var(--color-muted)]">{item.organization}</h4>
                <p className="mb-4 font-mono text-xs uppercase tracking-wide text-[var(--color-dev)] sm:text-sm">
                  {item.duration}
                </p>
                <ul className="space-y-2">
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-5 text-[var(--color-muted)] before:absolute before:left-0 before:top-1 before:text-[var(--color-accent)] before:content-['▹']"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
                {item.credentialUrl ? (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-4 inline-flex items-center gap-2 rounded text-sm font-semibold text-[var(--color-link)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    View certificate
                    {item.credentialId ? (
                      <span className="font-mono text-xs font-normal uppercase tracking-wide text-[var(--color-muted)]">
                        ID {item.credentialId}
                      </span>
                    ) : null}
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
