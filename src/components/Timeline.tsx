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
            <div className="viewport-animate">
              <h3 className="mb-2 text-2xl font-semibold text-[var(--color-text)]">{item.title}</h3>
              <h4 className="mb-1 text-lg text-[var(--color-muted)]">{item.organization}</h4>
              <p className="mb-4 text-sm italic text-[var(--color-soft)]">{item.duration}</p>
              <ul className="space-y-2">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="pl-5 text-[var(--color-muted)] before:absolute before:-ml-4 before:text-[var(--color-accent)] before:content-['▹']">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
