import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { LayoutGroup, motion } from "motion/react";
import { CheckCircle2, Terminal } from "lucide-react";

import { projectsData } from "../data/projects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
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

function isDiscontinued(project: Project): boolean {
  return (
    project.metrics?.some((metric) => /discontinued/i.test(metric)) === true ||
    /discontinued/i.test(project.deploymentNote ?? "")
  );
}

const TILE_CHROME =
  "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-none border-2 bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] shadow-[6px_6px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)]";

function ProjectImage({ project, compact }: { project: Project; compact?: boolean }) {
  const frame = compact
    ? "relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-bg-soft)]"
    : "relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--color-bg-soft)] sm:aspect-[16/9]";

  if (!project.imageSrc) {
    return (
      <div className={`${frame} flex items-center justify-center`}>
        <Terminal
          className="aspect-square h-auto w-1/5 min-w-12 shrink-0 text-[var(--color-muted)] opacity-40"
          strokeWidth={1.25}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <img
        src={project.imageSrc}
        alt={compact ? "" : project.imageAlt}
        className="h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--color-bg)_72%,transparent)] via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}

function FocusedCard({
  project,
  headingRef,
}: {
  project: Project;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  const primaryHref = projectPrimaryHref(project);
  const primaryLabel = projectPrimaryLabel(project);

  let secondarySlot: ReactNode;
  if (project.liveUrl && project.githubLink) {
    secondarySlot = (
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_55%,transparent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--color-link)_45%,transparent)] hover:text-[var(--color-link)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        View source
      </a>
    );
  } else if (project.liveUrl && !project.githubLink) {
    secondarySlot = (
      <span className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_48%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_8%,transparent)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-muted)]">
        {project.isClientProject ? "Client deliverable — repo private" : "Live product — no repo linked"}
      </span>
    );
  } else {
    secondarySlot = null;
  }

  return (
    <article
      aria-current="true"
      className={`${TILE_CHROME} border-[color-mix(in_srgb,var(--color-link)_70%,transparent)]`}
    >
      <ProjectImage project={project} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-2xl font-bold tracking-tight text-[var(--color-text)] outline-none sm:text-3xl"
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

          <p className="mt-3 shrink-0 text-sm font-medium leading-snug text-[var(--color-link)]">
            {project.tagline}
          </p>

          {project.metrics && project.metrics.length > 0 ? (
            <ul className="mt-3 flex shrink-0 flex-wrap gap-2" aria-label="Project notes">
              {project.metrics.map((metric) => (
                <li key={metric}>
                  <span className="inline-block rounded-lg border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_12%,transparent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-soft)]">
                    {metric}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <ul
            className="mt-4 flex list-none flex-col gap-2.5 text-sm leading-relaxed text-[var(--color-muted)]"
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

        <div className="mt-auto flex shrink-0 flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-border)_28%,transparent)] pt-6">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {primaryHref ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-[filter] duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] sm:min-w-0"
                aria-describedby={`project-heading-${project.id}`}
              >
                {primaryLabel}
              </a>
            ) : (
              <span className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_48%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_8%,transparent)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-muted)]">
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

function CompactTile({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${TILE_CHROME} min-h-[44px] cursor-pointer border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] text-left transition-[border-color,box-shadow] duration-200 hover:border-[color-mix(in_srgb,var(--color-link)_70%,transparent)] hover:shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-link)_45%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]`}
    >
      <ProjectImage project={project} compact />
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-[var(--color-text)]">
            {project.title}
          </span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${categoryPillClass(project.category)}`}
          >
            {project.category}
          </span>
        </div>
        <p className="text-sm leading-snug text-[var(--color-muted)]">{project.tagline}</p>
        {isDiscontinued(project) ? (
          <span className="w-fit rounded-lg border border-[color-mix(in_srgb,var(--color-highlight)_50%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-highlight)]">
            Discontinued
          </span>
        ) : null}
      </div>
    </button>
  );
}

// Strongest technical depth first — these three are always fully readable, no click required.
const ALWAYS_EXPANDED_COUNT = 3;

/**
 * Top 3 projects (ClackForge, TheListingHub, receipts-bot) render as full cards,
 * unconditionally — a recruiter never has to click to read them. The remaining tail
 * (Streak Garden, B.G.M.I.D.) keeps the original bento swap: one focused, one compact,
 * click to trade places via motion `layout` (spring overshoot).
 */
export function ProjectsShowcase() {
  const reducedMotion = usePrefersReducedMotion();
  const alwaysExpanded = projectsData.slice(0, ALWAYS_EXPANDED_COUNT);
  const tail = projectsData.slice(ALWAYS_EXPANDED_COUNT);

  const [focusedId, setFocusedId] = useState(tail[0]?.id);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skipInitialFocus = useRef(true);

  const focused = tail.find((project) => project.id === focusedId) ?? tail[0];

  const layoutTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0.32, visualDuration: 0.5 };

  useEffect(() => {
    if (skipInitialFocus.current) {
      skipInitialFocus.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [focusedId]);

  return (
    <div className="w-full">
      <ul className="grid grid-cols-1 gap-5 md:gap-6 lg:gap-8">
        {alwaysExpanded.map((project) => (
          <li key={project.id}>
            <FocusedCard project={project} />
          </li>
        ))}
      </ul>

      {focused ? (
        <div className="mt-5 md:mt-6 lg:mt-8">
          <p className="sr-only" aria-live="polite">
            Showing {focused.title}
          </p>
          <LayoutGroup>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
              {tail.map((project) => {
                const isFocused = project.id === focused.id;

                return (
                  <motion.li
                    key={project.id}
                    layout
                    layoutId={`project-${project.id}`}
                    className={isFocused ? "order-first md:order-none md:col-span-2" : undefined}
                    transition={layoutTransition}
                    whileTap={
                      isFocused || reducedMotion ? undefined : { scaleX: 1.06, scaleY: 0.94 }
                    }
                  >
                    {isFocused ? (
                      <FocusedCard project={project} headingRef={headingRef} />
                    ) : (
                      <CompactTile project={project} onSelect={() => setFocusedId(project.id)} />
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </LayoutGroup>
        </div>
      ) : null}
    </div>
  );
}
