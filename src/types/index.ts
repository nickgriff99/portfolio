export type SkillCategoryKey = "frontend" | "backend" | "tools";

export interface Skill {
  name: string;
  color: string;
}

export type SkillsMap = Record<SkillCategoryKey, Skill[]>;

export interface Project {
  id: number;
  title: string;
  category: "frontend" | "backend";
  description: string;
  tech: string[];
  githubLink: string;
  featured: boolean;
}

export interface TimelineEntry {
  title: string;
  organization: string;
  duration: string;
  bullets: string[];
}

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export type LayoutMode = "single" | "multi";
