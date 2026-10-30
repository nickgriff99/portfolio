/** Thin labelled rule between curtain sections. Spacing comes from `.section-band` padding. */
export function SectionRule({ label }: { label: string }) {
  return (
    <div className="content-shell" aria-hidden="true">
      <div className="flex items-center gap-3 md:gap-4">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--color-soft)] sm:text-xs">
          {`// ${label}`}
        </span>
        <span className="h-px min-w-0 flex-1 bg-[color-mix(in_srgb,var(--color-border)_42%,transparent)]" />
      </div>
    </div>
  );
}
