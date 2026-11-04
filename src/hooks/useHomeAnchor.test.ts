import { beforeEach, describe, expect, it, vi } from "vitest";

// environment: node (vitest.config.ts) - no jsdom, so stub the one DOM API the hook
// reads (document.getElementById) rather than pulling in a browser environment just
// for this one branch check.
const getElementById = vi.fn<(id: string) => unknown>();
vi.stubGlobal("document", { getElementById });

const navigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

const { useHomeAnchor } = await import("./useHomeAnchor");

describe("useHomeAnchor", () => {
  beforeEach(() => {
    navigate.mockClear();
    getElementById.mockReset();
  });

  it("route items always navigate, regardless of DOM presence", () => {
    const onNavigate = vi.fn();
    const goToAnchor = useHomeAnchor(onNavigate);

    goToAnchor({ type: "route", label: "About", to: "/about" });

    expect(navigate).toHaveBeenCalledWith("/about");
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("scrolls locally when the target section exists in the DOM", () => {
    getElementById.mockReturnValue({} as Element);
    const onNavigate = vi.fn();
    const goToAnchor = useHomeAnchor(onNavigate);

    goToAnchor({ type: "anchor-or-route", label: "Experience", href: "#experience", to: "/experience" });

    expect(getElementById).toHaveBeenCalledWith("experience");
    expect(onNavigate).toHaveBeenCalledWith("#experience");
    expect(navigate).not.toHaveBeenCalled();
  });

  it("routes to the dedicated page when an anchor-or-route target is absent from the DOM", () => {
    getElementById.mockReturnValue(null);
    const onNavigate = vi.fn();
    const goToAnchor = useHomeAnchor(onNavigate);

    goToAnchor({ type: "anchor-or-route", label: "Experience", href: "#experience", to: "/experience" });

    expect(onNavigate).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/experience");
  });

  it("falls back to cross-page `/#id` navigate for a plain anchor absent from the DOM", () => {
    getElementById.mockReturnValue(null);
    const onNavigate = vi.fn();
    const goToAnchor = useHomeAnchor(onNavigate);

    goToAnchor({ type: "anchor", label: "Home", href: "#home" });

    expect(onNavigate).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/#home");
  });
});
