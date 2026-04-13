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
  /** One-line hook under the title */
  tagline: string;
  description: string;
  tech: string[];
  /** Screenshot or placeholder under /public */
  imageSrc: string;
  imageAlt: string;
  /** Primary CTA when a public app exists */
  liveUrl?: string;
  /** Repository or secondary link */
  githubLink?: string;
  /** Extra line(s) for the Deployment cell (e.g. Discord: no web URL) */
  deploymentNote?: string;
  /** Small header badge for client / flagship work */
  isClientProject?: boolean;
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
