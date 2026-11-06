// @vitest-environment jsdom
import { cleanup, render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { mockMatchMedia } from "../test/mockMatchMedia";
import type { NavItem } from "../types";
import { NavBar } from "./NavBar";

beforeAll(() => {
  mockMatchMedia();
});

afterEach(cleanup);

const items: NavItem[] = [
  { type: "route", label: "About", to: "/about" },
  { type: "anchor-or-route", label: "Projects", href: "#projects", to: "/projects" },
  { type: "anchor", label: "Contact", href: "#contact" },
];

function renderNavBar(options: { path: string; activeSection: string }) {
  return render(
    <MemoryRouter initialEntries={[options.path]}>
      <NavBar
        items={items}
        activeSection={options.activeSection}
        hidden={false}
        compact={false}
        onNavigate={() => {}}
      />
    </MemoryRouter>,
  );
}

// NavBar renders the desktop <nav> and the mobile StaggeredMenu drawer with the same
// items, so every label appears twice in the DOM - scope queries to the desktop <nav>.
function desktopNav(container: HTMLElement) {
  return within(container.querySelector("nav")!);
}

describe("NavBar active state", () => {
  it("marks a `route` item active purely by pathname match", () => {
    const { container } = renderNavBar({ path: "/about", activeSection: "" });
    expect(desktopNav(container).getByRole("link", { name: /about/i }).getAttribute("aria-current")).toBe("page");
  });

  it("marks an `anchor-or-route` item active by pathname when off the home route", () => {
    // Only `type: "route"` items render as `<Link>`; "anchor-or-route" always renders
    // as a `<button>` (NavBar.tsx) even when its `isActive` check is route-based.
    const { container } = renderNavBar({ path: "/projects", activeSection: "" });
    expect(desktopNav(container).getByRole("button", { name: /projects/i }).getAttribute("aria-current")).toBe("page");
  });

  it("falls back to `activeSection` for an `anchor-or-route` item while on `/`", () => {
    const { container } = renderNavBar({ path: "/", activeSection: "projects" });
    const projectsButton = desktopNav(container).getByRole("button", { name: /projects/i });
    expect(projectsButton.getAttribute("aria-current")).toBe("page");
  });

  it("marks a plain `anchor` item active via `activeSection`", () => {
    const { container } = renderNavBar({ path: "/", activeSection: "contact" });
    const contactButton = desktopNav(container).getByRole("button", { name: /contact/i });
    expect(contactButton.getAttribute("aria-current")).toBe("page");
  });
});
