import { useMemo, useState } from "react";

import { projectsData } from "../data/projects";
import type { Project } from "../types";

export type ProjectFilterKey = "all" | "frontend" | "backend" | "fullstack" | "client";

export const projectFilterCategories: Array<{ key: ProjectFilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "fullstack", label: "Full-stack" },
  { key: "client", label: "Client work" },
];

/**
 * Shared filter state for the Projects section. Lifted out of `ProjectsShowcase` so the
 * filter bar (rendered once, in normal vertical flow) and both render paths — the desktop
 * scroll-jack and the mobile/reduced-motion masonry fallback — stay in sync off one list,
 * instead of each computing (and potentially drifting from) its own.
 */
export function useProjectFilter() {
  const [filter, setFilter] = useState<ProjectFilterKey>("all");

  const filteredProjects = useMemo<Project[]>(() => {
    if (filter === "all") return projectsData;
    if (filter === "client") return projectsData.filter((p) => p.isClientProject);
    return projectsData.filter((p) => p.category === filter);
  }, [filter]);

  return { filter, setFilter, filteredProjects };
}
