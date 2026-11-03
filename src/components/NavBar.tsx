import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { NavItem } from "../types";
import { useHomeAnchor } from "../hooks/useHomeAnchor";
import { StaggeredMenu } from "./StaggeredMenu";

type NavBarProps = {
  items: NavItem[];
  activeSection: string;
  hidden: boolean;
  onNavigate: (href: `#${string}`) => void;
};

const MOBILE_MENU_ID = "mobile-nav-drawer";

// Shared desktop item class so a later styling pass has one place to edit for both
// the anchor <button> and the route <Link>. Brutalist mono-uppercase pill labels,
// matching the "// label" comment-style headers used elsewhere (AboutMe, ProjectsShowcase).
function navItemClass(isActive: boolean) {
  return `focus-ring rounded-none px-2 py-2 font-mono text-sm font-semibold uppercase tracking-wide underline-offset-4 transition-colors ${
    isActive
      ? "text-[var(--color-link)] underline"
      : "text-[var(--color-muted)] hover:text-[var(--color-accent)]"
  }`;
}

export function NavBar({ items, activeSection, hidden, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const goToAnchor = useHomeAnchor(onNavigate);

  const handleNavigate = (href: `#${string}`) => {
    goToAnchor(href);
    setMobileOpen(false);
  };

  return (
    <header
      // `inert` also removes every descendant (nav links) from the Tab order and a11y
      // tree while the header is translated off-screen — same pattern as StaggeredMenu's
      // off-canvas `<aside>`, see StaggeredMenu.tsx.
      inert={hidden}
      className={`fixed left-0 top-0 w-full px-4 pt-3 transition-transform duration-300 sm:px-6 lg:px-8 ${mobileOpen ? "z-[120]" : "z-50"} ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="nav-shell">
          <nav className="relative flex w-full items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => handleNavigate("#home")}
              className="focus-ring shrink-0 rounded-none text-left font-mono text-lg font-extrabold uppercase tracking-tight text-[var(--color-link)]"
            >
              Nicholas Griffiths
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-6 sm:gap-8">
              <ul className="hidden items-center gap-8 lg:flex">
                {items.map((item) => {
                  if (item.type === "route") {
                    const isActive = location.pathname === item.to;
                    return (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          aria-current={isActive ? "page" : undefined}
                          className={navItemClass(isActive)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  const sectionId = item.href.replace("#", "");
                  const isActive = sectionId === activeSection;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNavigate(item.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={navItemClass(isActive)}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring hidden shrink-0 rounded-none font-mono text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] lg:inline-block"
              >
                Resume ↗
              </a>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setMobileOpen((prev) => !prev)}
                  aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
                  aria-expanded={mobileOpen}
                  aria-controls={MOBILE_MENU_ID}
                  className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-none border-2 border-[var(--color-border)] lg:hidden"
                >
                  <span className="sr-only">Menu</span>
                  <div className="space-y-1.5">
                    <span className="block h-0.5 w-6 bg-[var(--color-text)]" />
                    <span className="block h-0.5 w-6 bg-[var(--color-text)]" />
                    <span className="block h-0.5 w-6 bg-[var(--color-text)]" />
                  </div>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <StaggeredMenu
        id={MOBILE_MENU_ID}
        open={mobileOpen}
        items={items}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
