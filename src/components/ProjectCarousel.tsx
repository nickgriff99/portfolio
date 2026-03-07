import { useEffect, useMemo, useState } from "react";

import { projectsData } from "../data/projects";
import type { Project } from "../types";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function ProjectCarousel() {
  const projects = useMemo(() => shuffleArray(projectsData), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [isPaused, projects.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
  const previous = () =>
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));

  const handleSwipeEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setIsPaused(false);
      return;
    }

    const distance = touchStart - touchEnd;
    if (distance > 50) {
      next();
    } else if (distance < -50) {
      previous();
    }

    setIsDragging(false);
    setIsPaused(false);
  };

  const renderCard = (project: Project, index: number) => {
    const offset = index - currentIndex;
    const normalizedOffset =
      offset > projects.length / 2
        ? offset - projects.length
        : offset < -projects.length / 2
          ? offset + projects.length
          : offset;

    if (Math.abs(normalizedOffset) > 2) {
      return null;
    }

    const isActive = normalizedOffset === 0;

    let transform = "translateX(0) translateY(0) scale(1) rotateY(0deg)";
    let opacity = 1;
    let zIndex = 10;
    let pointerEvents: "auto" | "none" = "auto";

    if (normalizedOffset === -2) {
      transform = "translateX(-120%) translateY(30px) scale(0.6) rotateY(-30deg)";
      opacity = 0;
      zIndex = 1;
      pointerEvents = "none";
    } else if (normalizedOffset === -1) {
      transform = "translateX(-80%) translateY(20px) scale(0.85) rotateY(-15deg)";
      opacity = 0.7;
      zIndex = 1;
      pointerEvents = "none";
    } else if (normalizedOffset === 1) {
      transform = "translateX(80%) translateY(20px) scale(0.85) rotateY(15deg)";
      opacity = 0.7;
      zIndex = 1;
      pointerEvents = "none";
    } else if (normalizedOffset === 2) {
      transform = "translateX(120%) translateY(30px) scale(0.6) rotateY(30deg)";
      opacity = 0;
      zIndex = 1;
      pointerEvents = "none";
    } else {
      zIndex = 100;
    }

    return (
      <article
        key={project.id}
        className="absolute w-full max-w-[600px] overflow-hidden rounded-[20px] bg-white shadow-xl transition-all duration-500"
        style={{ transform, opacity, zIndex, pointerEvents }}
        onMouseEnter={() => isActive && setIsPaused(true)}
        onMouseLeave={() => isActive && setIsPaused(false)}
        onClick={() => {
          if (!isActive && Math.abs(normalizedOffset) === 1) {
            if (normalizedOffset < 0) {
              previous();
            } else {
              next();
            }
          }
        }}
      >
        <div className="relative flex h-[250px] items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-700 text-[1.4rem] font-bold text-white">
          {project.title}
        </div>

        <div className="min-h-[330px] p-8 max-[1024px]:flex max-[1024px]:min-h-[400px] max-[1024px]:flex-col">
          <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
            <div>
              <h3 className="mb-2 text-2xl font-semibold text-zinc-800">
                {project.title}
              </h3>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs capitalize text-white ${
                  project.category === "frontend" ? "bg-accent-emerald" : "bg-amber-500"
                }`}
              >
                {project.category}
              </span>
            </div>

            <a
              href={isActive ? project.githubLink : "#"}
              target={isActive ? "_blank" : "_self"}
              rel="noreferrer"
              onClick={(event) => {
                if (!isActive) {
                  event.preventDefault();
                }
              }}
              className={`inline-block rounded-lg px-4 py-2 text-sm text-white transition-colors duration-300 max-[1024px]:order-10 max-[1024px]:mt-auto max-[1024px]:self-center ${
                isActive ? "bg-brand-primary hover:brightness-110" : "bg-zinc-500"
              }`}
            >
              View Code
            </a>
          </div>

          <p className="mb-6 text-[0.95rem] leading-7 text-zinc-500">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="viewport-animate px-0 py-0 max-[1024px]:-translate-y-5 max-[1024px]:px-5 max-[1024px]:py-12">
      <div
        className="relative mx-auto h-[500px] w-full max-w-[1000px] select-none [perspective:1200px] [perspective-origin:center_center]"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onTouchStart={(event) => {
          setTouchEnd(null);
          setTouchStart(event.targetTouches[0].clientX);
          setIsDragging(true);
          setIsPaused(true);
        }}
        onTouchMove={(event) => setTouchEnd(event.targetTouches[0].clientX)}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={(event) => {
          setTouchEnd(null);
          setTouchStart(event.clientX);
          setIsDragging(true);
          setIsPaused(true);
        }}
        onMouseMove={(event) => {
          if (isDragging) {
            setTouchEnd(event.clientX);
          }
        }}
        onMouseUp={handleSwipeEnd}
        onMouseLeave={handleSwipeEnd}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          {projects.map((project, index) => renderCard(project, index))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4 max-[1024px]:hidden">
        <button
          onClick={previous}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-2xl text-white transition-all duration-300 hover:brightness-110"
        >
          ‹
        </button>

        <div className="flex gap-2">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                currentIndex === index ? "bg-brand-primary" : "bg-zinc-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-2xl text-white transition-all duration-300 hover:brightness-110"
        >
          ›
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-zinc-500 max-[1024px]:hidden">
        {currentIndex + 1} of {projects.length}
      </p>
    </div>
  );
}
