export type SkillCategoryKey = "frontend" | "backend" | "tools";

export interface Skill {
  name: string;
  color: string;
}

export type SkillsMap = Record<SkillCategoryKey, Skill[]>;

export interface Project {
  id: number;
  title: string;
  /** Stable routing key, kebab-case, independent of title */
  slug: string;
  category: "frontend" | "backend" | "fullstack";
  /** One-line hook under the title */
  tagline: string;
  /** Longer narrative; used for SEO and optional expanded context */
  description: string;
  /** Short outcome bullets for project cards (problem → build → result) */
  highlights: string[];
  tech: string[];
  /** Preview image under /public (WebP/PNG/SVG) */
  imageSrc?: string;
  imageAlt?: string;
  /** Primary CTA when a public app exists */
  liveUrl?: string;
  /** Repository or secondary link */
  githubLink?: string;
  /** Extra line when there is no public URL or deploy is unusual */
  deploymentNote?: string;
  /** Surfaces in the “Client work” filter */
  isClientProject?: boolean;
  /** e.g. “Solo build — design + front-end” */
  role?: string;
  /** Small proof badges (stack slice, impact, constraint) */
  metrics?: string[];
}

export interface ProjectDetail {
  featureBreakdown: string[];
  cardSnippet: string;
}

export interface ReadmeSection {
  heading: string;
  body: string[];
}

export interface ProjectReadme {
  intro: string;
  sections: ReadmeSection[];
}

export interface TimelineEntry {
  title: string;
  organization: string;
  duration: string;
  bullets: string[];
  /** Verification ID for a completed professional certification */
  credentialId?: string;
  /** URL where the credential can be viewed or verified (external profile or hosted asset) */
  credentialUrl?: string;
}

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export type LayoutMode = "single" | "multi";
