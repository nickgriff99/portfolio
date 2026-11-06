// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import { projectsData } from "../data/projects";
import { mockMatchMedia } from "../test/mockMatchMedia";
import { ProjectsShowcase } from "./ProjectsShowcase";

beforeAll(() => {
  mockMatchMedia();
});

describe("ProjectsShowcase", () => {
  it("renders one card per project, each linking to its slug route", () => {
    render(
      <MemoryRouter>
        <ProjectsShowcase />
      </MemoryRouter>,
    );

    for (const project of projectsData) {
      const link = screen.getByRole("link", { name: new RegExp(project.title, "i") });
      expect(link.getAttribute("href")).toBe(`/projects/${project.slug}`);
    }

    expect(screen.getAllByRole("link")).toHaveLength(projectsData.length);
  });
});
