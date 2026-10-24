import { type ReactNode } from "react";

import { CheckCircle2, Terminal } from "lucide-react";

import type { Project } from "../types";

function categoryPillClass(category: Project["category"]) {
  if (category === "frontend") return "bg-[var(--color-accent)] text-[#0a0a0a]";
  if (category === "fullstack") return "bg-[var(--color-link)] text-[#0a0a0a]";
  return "bg-[var(--color-dev)] text-[#f4f4f5]";
}

function projectPrimaryHref(project: Project): string | undefined {
  return project.liveUrl ?? project.githubLink;
}

function projectPrimaryLabel(project: Project): string {
  if (project.liveUrl) return "Open live site";
  if (project.githubLink) return "View source";
  return "";
}

export function ProjectCard({ project }: { project: Project }) {
  const primaryHref = projectPrimaryHref(project);
  const primaryLabel = projectPrimaryLabel(project);

  let secondarySlot: ReactNode;
  if (project.liveUrl && project.githubLink) {
    secondarySlot = (
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_55%,transparent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--color-link)_45%,transparent)] hover:text-[var(--color-link)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        View source
      </a>
    );
  } else if (project.liveUrl && !project.githubLink) {
    secondarySlot = (
      <span className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_48%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_8%,transparent)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-muted)]">
        {project.isClientProject ? "Client deliverable — repo private" : "Live product — no repo linked"}
      </span>
    );
  } else {
    secondarySlot = null;
  }

  return (
    <article className="group flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] shadow-[6px_6px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)] transition-[box-shadow,transform,border-color] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-link)_70%,transparent)] hover:shadow-[10px_10px_0_0_color-mix(in_srgb,var(--color-link)_55%,transparent)] motion-reduce:transition-none min-[880px]:flex-row-reverse lg:flex-col">
      {/* `min-[880px]:flex-row-reverse` + `lg:flex-col`: tablet-row layout (text+CTAs left, image
          right — DOM keeps image first, `row-reverse` just flips the *visual* order) lives only in
          the `880px`-to-`lg` band. Custom `880px` breakpoint, not stock `md` (768px): this card
          renders at `md:col-span-2` of a `md:grid-cols-4` row in the masonry fallback, so its real
          rendered width at a literal 768px viewport is ~340px — measured live, confirmed too narrow
          for a legible two-column split (text column collapses under ~170px). `880px` was the
          narrowest point that kept both columns readable in a live check; `lg:flex-col` hard-reverts
          to stacked at 1024px+ regardless, per spec — this is now the only desktop layout (the
          scroll-jack carousel this band was also sized against has been removed entirely). */}
        {project.imageSrc ? (
          <div
            // Row mode: fixed `aspect-[3/4]` + `self-start`, NOT a self-stretch box tied to the
            // text column's height. Tried self-stretch + `aspect-auto` first (image inherits
            // whatever height the stretched flex row ends up needing) on the theory that the image
            // would "never add extra height on top of what the row needs" — true, but it also means
            // the image's `object-cover` crop ratio is entirely at the mercy of the text column's
            // content length, which varies per project. Verified live (Playwright) at 880px: a
            // 3-highlight card with long copy wraps to 4-5 lines per bullet, inflating the text
            // column to ~1070px tall against a ~157px-wide image slot — object-cover stretched that
            // into a ~6.9:1 "soda-straw" vertical sliver (confirmed via screenshot: individual site
            // screenshots read as an illegible, disconnected scroll of UI chrome rather than a
            // recognizable thumbnail). A fixed `aspect-[3/4]` pegs the crop to the image's own width
            // (~2.3-2.7:1 at a sane height, not content-length-dependent) — still a portrait crop
            // (card width is capped under ~470px at every viewport below `lg`'s full revert to
            // stacked, so there's no width budget for a landscape 16:10 image here regardless), but
            // a legible one. `self-start` (not `self-center`): for the tallest cards the remaining
            // row space below the image is bare card background either way; anchoring the image to
            // the top reads as a deliberate "pinned thumbnail" like a byline photo, not an image
            // floating in the middle of empty space.
            //
            // `[@media(max-height:1000px)]:max-h-*` is a prior round's short-viewport clipping fix:
            // caps the image's share of vertical space so a wide (task-2-widened) card's
            // width-driven `aspect-[16/10]` height can't alone exceed the available slot. `1000px`
            // isn't an arbitrary guess — it was originally derived from the now-removed
            // scroll-jack carousel's own slide clearance (`pt-[200px]` fixed-bar offset +
            // `max-h-[80vh]` cap), which shared this card at `lg:`+ width: below the threshold the
            // available height had no slack (every px load-bearing, so the image had to be
            // capped); at/above it there was always >= 20vh of slack, comfortably fitting the
            // card's natural (non-compact) content (confirmed live at 1080px). Verified live
            // across the full 700/768/900/1080px height matrix at the time: 900px clipped (CTA
            // buttons + highlights pushed out) with this gated at 780px — fixed by moving the
            // threshold to the real regime boundary instead of a round-sounding guess. Kept as-is
            // now that the carousel is gone and this card only renders in the masonry grid — it
            // still protects short-viewport content from clipping there, just without the
            // scroll-jack-specific math that originally produced the exact number.
            // Explicitly gated behind `lg:` (not applied bare) — this is only ever meant to cap
            // `lg:`'s `aspect-[16/10]` regime. A bare (un-prefixed) `[@media(max-height:1000px)]`
            // is a height-only query, orthogonal to width, so it would ALSO fire inside the
            // `min-[880px]` row-mode band on any short+narrow combination (e.g. 900x700) — caught
            // live: at 900px wide / 700px tall the row-mode image's fixed `w-2/5` stayed put but
            // its height got clamped to `26vh` (182px) under its natural `aspect-[3/4]` height
            // (~213px), silently warping the crop to ~0.88 instead of the intended 0.75. Gating
            // with `lg:` fixes that without changing anything in the actual stacked/masonry
            // regime this was built for (which only ever renders at `lg:` width regardless).
            className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-bg-soft)] min-[880px]:aspect-[3/4] min-[880px]:w-2/5 min-[880px]:shrink-0 min-[880px]:self-start lg:aspect-[16/10] lg:w-full lg:self-auto lg:[@media(max-height:1000px)]:max-h-[26vh]"
          >
            <img
              src={project.imageSrc}
              alt={project.imageAlt}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
              loading="lazy"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--color-bg)_72%,transparent)] via-transparent to-transparent"
              aria-hidden
            />
          </div>
        ) : (
          <div className="relative flex aspect-[16/10] w-full shrink-0 items-center justify-center overflow-hidden bg-[var(--color-bg-soft)] min-[880px]:aspect-[3/4] min-[880px]:w-2/5 min-[880px]:shrink-0 min-[880px]:self-start lg:aspect-[16/10] lg:w-full lg:self-auto lg:[@media(max-height:1000px)]:max-h-[26vh]">
            <Terminal
              className="aspect-square h-auto w-1/5 min-w-12 shrink-0 text-[var(--color-muted)] opacity-40"
              strokeWidth={1.25}
              aria-hidden
            />
          </div>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7 min-[880px]:px-5 lg:px-7 [@media(max-height:1000px)]:py-4">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className="font-display text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl min-[880px]:text-xl lg:text-3xl"
                    id={`project-heading-${project.id}`}
                  >
                    {project.title}
                  </h3>
                  {project.isClientProject ? (
                    <span className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                      Client
                    </span>
                  ) : null}
                </div>
                {project.role ? (
                  <p className="text-xs font-medium text-[var(--color-muted)]">{project.role}</p>
                ) : null}
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${categoryPillClass(project.category)}`}
              >
                {project.category}
              </span>
            </div>

            <p className="mt-3 shrink-0 text-sm font-medium leading-snug text-[var(--color-link)] [@media(max-height:1000px)]:mt-2">{project.tagline}</p>

            {project.metrics && project.metrics.length > 0 ? (
              <ul className="mt-3 flex shrink-0 flex-wrap gap-2" aria-label="Project notes">
                {project.metrics.map((m) => (
                  <li key={m}>
                    <span className="inline-block rounded-lg border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_12%,transparent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-soft)]">
                      {m}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <ul
              className="mt-4 flex min-h-0 flex-1 list-none flex-col gap-2.5 text-sm leading-relaxed text-[var(--color-muted)] [@media(max-height:1000px)]:mt-2 [@media(max-height:1000px)]:gap-1.5"
              aria-label="Highlights"
            >
              {project.highlights.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 size-[1.1rem] shrink-0 text-[var(--color-accent)] opacity-90"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <p className="sr-only">{project.description}</p>
          </div>

          <div className="mt-auto flex shrink-0 flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-border)_28%,transparent)] pt-6 [@media(max-height:1000px)]:gap-2.5 [@media(max-height:1000px)]:pt-3">
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="inline-block rounded-full border border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_10%,transparent)] px-3 py-1 text-xs text-[var(--color-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.deploymentNote ? (
              <p className="text-xs leading-relaxed text-[var(--color-soft)]">{project.deploymentNote}</p>
            ) : null}

            {/* `min-[880px]:flex-col`: in the tablet row-layout band (above) the text column is
               narrow, so force the two CTAs back to stacked there even though `sm:flex-row` would
               otherwise already be active — `lg:flex-row` restores the side-by-side pair once the
               card reverts to its full-width stacked desktop layout. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch min-[880px]:flex-col lg:flex-row">
              {primaryHref ? (
                <a
                  href={primaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-[filter] duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:min-w-0"
                  aria-describedby={`project-heading-${project.id}`}
                >
                  {primaryLabel}
                </a>
              ) : (
                <span className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_48%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_8%,transparent)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-muted)]">
                  No link configured
                </span>
              )}
              {secondarySlot}
            </div>
          </div>
        </div>
    </article>
  );
}

/**
 * Masonry grid — the project section's only layout (the desktop scroll-jack carousel this
 * once sat alongside as a fallback has been removed entirely). Filter state lives in
 * `ProjectsSection` (via `useProjectFilter`) and is passed down as `filteredProjects`.
 */
export function ProjectsShowcase({ filteredProjects }: { filteredProjects: Project[] }) {
  return (
    <div className="viewport-animate w-full">
      {filteredProjects.length === 0 ? (
        <p className="rounded-none border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-6 py-12 text-center text-[var(--color-muted)]">
          No projects match this filter.
        </p>
      ) : (
        <ul className="grid grid-cols-1 items-stretch gap-8 md:auto-rows-fr md:grid-cols-4 md:gap-10 lg:gap-12">
          {filteredProjects.map((project, index) => {
            const isOrphanedLast =
              index === filteredProjects.length - 1 && filteredProjects.length % 2 !== 0;
            // Same alternation convention as Timeline.tsx's `isEven` — a vertical offset on
            // top of the existing col-span/col-start width-and-centering logic. Uses
            // `translate-y` (paint-time transform), not `margin-top`: this grid relies on
            // `md:auto-rows-fr` (-> grid-auto-rows: minmax(0, 1fr)) + default `items-stretch`
            // for the equal 748x976 card sizing, and a grid item's margin counts toward its
            // track-sizing contribution — `mt-12` here would grow every row, not just this
            // card. `translate-y` is excluded from layout/track sizing entirely, so it offsets
            // the card visually without touching the width-and-centering or equal-height math.
            // Offset (32px) is kept deliberately under the row gap (40px/48px at md/lg, above)
            // with an 8px+ buffer at every breakpoint — translate doesn't reserve track space,
            // so an offset >= the gap would visually tuck this card under the next row instead
            // of reading as a clean masonry stagger.
            const isEven = index % 2 === 1;
            return (
              <li
                key={project.id}
                className={`flex min-h-0 w-full md:col-span-2 ${isOrphanedLast ? "md:col-start-2" : ""} ${isEven ? "md:translate-y-8" : ""}`}
              >
                <ProjectCard project={project} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
