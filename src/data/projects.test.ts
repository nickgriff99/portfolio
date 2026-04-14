import { describe, expect, it } from "vitest";

import { projectsData } from "./projects";

describe("projectsData", () => {
  it("has at least one project", () => {
    expect(projectsData.length).toBeGreaterThan(0);
  });

  it("each entry satisfies card + type expectations", () => {
    const ids = new Set<number>();

    for (const p of projectsData) {
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);

      expect(p.title.trim().length).toBeGreaterThan(0);
      expect(p.tagline.trim().length).toBeGreaterThan(0);
      expect(p.description.trim().length).toBeGreaterThan(0);
      expect(p.highlights.length).toBeGreaterThan(0);
      expect(p.tech.length).toBeGreaterThan(0);

      expect(p.imageSrc.startsWith("/")).toBe(true);
      expect(p.imageAlt.trim().length).toBeGreaterThan(0);

      expect(p.category === "frontend" || p.category === "backend").toBe(true);

      const hasLive = Boolean(p.liveUrl);
      const hasGithub = Boolean(p.githubLink);
      expect(hasLive || hasGithub).toBe(true);
    }
  });
});
