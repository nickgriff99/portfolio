import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { projectsData } from "../data/projects";
import { useMediaMinWidth } from "../hooks/useMediaMinWidth";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Project } from "../types";

const STEP_MIN_HEIGHT = "min-h-[min(92vh,56rem)]";

function categoryPillClass(category: Project["category"]) {
  return category === "frontend"
    ? "bg-[var(--color-accent)] text-[#0a0a0a]"
    : "bg-[var(--color-accent-secondary)] text-[#f4f4f5]";
}

const bentoCell =
  "header-surface rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_38%,transparent)] p-5 lg:p-6";

const actionPillClass =
  "inline-flex min-h-[42px] w-full items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_48%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_8%,transparent)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-muted)]";

function deploymentHostname(liveUrl: string) {
  try {
    return new URL(liveUrl).hostname.replace(/^www\./, "");
  } catch {
    return liveUrl.replace(/^https?:\/\//, "");
  }
}

function ProjectBento({ project }: { project: Project }) {
  const isLive = Boolean(project.liveUrl);
  const primaryHref = project.liveUrl ?? project.githubLink;
  const primaryLabel = project.liveUrl ? "Open live site" : "View source";

  const deploymentTitle = isLive ? "Live site" : "Not publicly hosted";
  const deploymentBodyDefault = isLive
    ? "This project is deployed and reachable on the web. Use the primary action to open it in a new tab."
    : "There is no public hosting for this build. Use the primary action to open the repository, or run the project locally for the full experience.";

  let secondarySlot: ReactNode;
  if (project.liveUrl && project.githubLink) {
    secondarySlot = (
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[42px] w-full items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-border)_55%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--color-link)_45%,transparent)] hover:text-[var(--color-link)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        View source
      </a>
    );
  } else if (project.liveUrl && !project.githubLink) {
    secondarySlot = (
      <span className={actionPillClass}>
        {project.isClientProject ? "Client deliverable — production URL above" : "Live product — no repo linked here"}
      </span>
    );
  } else {
    secondarySlot = <span className={actionPillClass}>No public deploy — explore via source or local run</span>;
  }

  return (
    <div className="grid grid-cols-12 gap-3 lg:gap-4">
      <div className={`${bentoCell} col-span-12 lg:col-span-8`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text)] lg:text-3xl">
              {project.title}
            </h3>
            {project.isClientProject ? (
              <span className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Client
              </span>
            ) : null}
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${categoryPillClass(project.category)}`}
          >
            {project.category}
          </span>
        </div>
        <p className="mt-3 text-sm font-medium text-[var(--color-link)]">{project.tagline}</p>
      </div>

      <div className={`${bentoCell} col-span-12 flex flex-col justify-center lg:col-span-4`}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Deployment</p>
        <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{deploymentTitle}</p>
        {isLive && project.liveUrl ? (
          <p className="mt-1 break-all font-mono text-xs text-[var(--color-link)]">{deploymentHostname(project.liveUrl)}</p>
        ) : null}
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">{deploymentBodyDefault}</p>
        {project.deploymentNote ? (
          <p className="mt-3 border-t border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] pt-3 text-xs leading-relaxed text-[var(--color-soft)]">
            {project.deploymentNote}
          </p>
        ) : null}
      </div>

      <div
        className={`${bentoCell} col-span-12 flex min-h-[11rem] flex-col lg:min-h-[12rem]`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">About</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">{project.description}</p>
      </div>

      <div className={`${bentoCell} col-span-12`}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Stack</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((tech) => (
            <li key={tech}>
              <span className="inline-block rounded-full border border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_10%,transparent)] px-3 py-1 text-xs text-[var(--color-muted)]">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${bentoCell} col-span-12`}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Actions</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {primaryHref ? (
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] w-full items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-[filter] duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              {primaryLabel}
            </a>
          ) : (
            <span className={actionPillClass}>No outbound link configured</span>
          )}
          {secondarySlot}
        </div>
      </div>
    </div>
  );
}

function BrowserStageFrame({ project, active }: { project: Project; active: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] shadow-[0_20px_50px_color-mix(in_srgb,var(--color-bg)_55%,transparent)] transition-opacity duration-300 motion-reduce:transition-none ${active ? "z-10 opacity-100" : "opacity-0"}`}
      aria-hidden={!active}
    >
      <div className="flex h-10 items-center gap-2 border-b border-[color-mix(in_srgb,var(--color-border)_35%,transparent)] bg-[color-mix(in_srgb,#000_25%,transparent)] px-4">
        <span className="size-2.5 rounded-full bg-[color-mix(in_srgb,#f87171_85%,transparent)]" />
        <span className="size-2.5 rounded-full bg-[color-mix(in_srgb,#fbbf24_85%,transparent)]" />
        <span className="size-2.5 rounded-full bg-[color-mix(in_srgb,#4ade80_75%,transparent)]" />
        <span className="ml-3 truncate text-xs text-[var(--color-muted)]">
          {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, "") : project.title}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full bg-[var(--color-bg-soft)]">
        <img
          src={project.imageSrc}
          alt={active ? project.imageAlt : ""}
          className="h-full w-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

function StickyStageStack({ projects, activeIndex }: { projects: Project[]; activeIndex: number }) {
  return (
    <div className="relative aspect-[16/11] w-full sm:aspect-[16/10]">
      {projects.map((project, i) => (
        <BrowserStageFrame key={project.id} project={project} active={i === activeIndex} />
      ))}
    </div>
  );
}

function StepDots({
  count,
  activeIndex,
  onSelect,
  labels,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  labels: string[];
}) {
  return (
    <nav className="mt-6" aria-label="Jump to project">
      <ul className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {Array.from({ length: count }, (_, i) => (
          <li key={labels[i] ?? i}>
            <button
              type="button"
              aria-current={i === activeIndex ? "step" : undefined}
              aria-label={`Scroll to project ${i + 1}: ${labels[i] ?? `Project ${i + 1}`}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${
                i === activeIndex
                  ? "bg-[color-mix(in_srgb,var(--color-link)_22%,transparent)] text-[var(--color-text)]"
                  : "text-[var(--color-muted)] hover:bg-[color-mix(in_srgb,var(--color-border)_18%,transparent)] hover:text-[var(--color-text)]"
              }`}
              onClick={() => onSelect(i)}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ProjectsShowcase() {
  const projects = projectsData;
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useMediaMinWidth(1024);
  const stacked = prefersReducedMotion || !isLg;

  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const setStepRef = useCallback((el: HTMLElement | null, index: number) => {
    stepRefs.current[index] = el;
  }, []);

  useLayoutEffect(() => {
    if (stacked) return;

    const elements = stepRefs.current.filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = 0;
        let bestRatio = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = elements.indexOf(entry.target as HTMLElement);
          if (idx < 0) continue;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = idx;
          }
        }
        if (bestRatio > 0.12) setActiveIndex(bestIdx);
      },
      {
        root: null,
        rootMargin: "-14% 0px -14% 0px",
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stacked, projects.length]);

  const scrollToStep = (index: number) => {
    const el = stepRefs.current[index];
    el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  const activeProject = projects[activeIndex] ?? projects[0];

  return (
    <div className="viewport-animate w-full">
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >{`Active project: ${activeProject.title}`}</div>

      {!stacked ? (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="header-surface rounded-2xl p-4 sm:p-5">
              <StickyStageStack projects={projects} activeIndex={activeIndex} />
              <StepDots
                count={projects.length}
                activeIndex={activeIndex}
                onSelect={scrollToStep}
                labels={projects.map((p) => p.title)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-0">
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => setStepRef(el, index)}
                className={`flex flex-col justify-center py-8 ${STEP_MIN_HEIGHT}`}
              >
                <ProjectBento project={project} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-12 sm:gap-16">
          {projects.map((project, index) => (
            <article
              key={project.id}
              ref={(el) => setStepRef(el, index)}
              className="scroll-mt-28"
              aria-labelledby={`project-title-${project.id}`}
            >
              <div className="mb-6 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] shadow-[0_16px_40px_color-mix(in_srgb,var(--color-bg)_50%,transparent)]">
                <div className="flex h-9 items-center gap-2 border-b border-[color-mix(in_srgb,var(--color-border)_35%,transparent)] bg-[color-mix(in_srgb,#000_25%,transparent)] px-3">
                  <span className="size-2 rounded-full bg-[color-mix(in_srgb,#f87171_85%,transparent)]" />
                  <span className="size-2 rounded-full bg-[color-mix(in_srgb,#fbbf24_85%,transparent)]" />
                  <span className="size-2 rounded-full bg-[color-mix(in_srgb,#4ade80_75%,transparent)]" />
                </div>
                <div className="relative aspect-[16/10] w-full bg-[var(--color-bg-soft)]">
                  <img
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    className="h-full w-full object-cover object-top"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              </div>
              <div className="sr-only" id={`project-title-${project.id}`}>
                {project.title}
              </div>
              <ProjectBento project={project} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
