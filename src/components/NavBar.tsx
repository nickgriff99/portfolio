import { useId, useState } from "react";
import type { NavItem } from "../types";
import { StaggeredMenu } from "./StaggeredMenu";

type NavBarProps = {
  items: NavItem[];
  activeSection: string;
  hidden: boolean;
  onNavigate: (href: string) => void;
};

const MOBILE_MENU_ID = "mobile-nav-drawer";

export function NavBar({ items, activeSection, hidden, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const edgeId = useId().replace(/:/g, "");

  const handleNavigate = (href: string) => {
    onNavigate(href);
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
        <div className="nav-metal-border">
          <svg
            className="nav-edge-svg"
            aria-hidden
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`${edgeId}-edge-a`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8ecf8" stopOpacity="0" />
                <stop offset="8%" stopColor="#f0f4ff" stopOpacity="0.22" />
                <stop offset="22%" stopColor="#c8d4e8" stopOpacity="0.38" />
                <stop offset="38%" stopColor="#98a8c8" stopOpacity="0.18" />
                <stop offset="52%" stopColor="#d4c8f0" stopOpacity="0.32" />
                <stop offset="66%" stopColor="#8898b0" stopOpacity="0.12" />
                <stop offset="80%" stopColor="#b8c8e8" stopOpacity="0.28" />
                <stop offset="92%" stopColor="#9ec4d8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#e0e4f8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${edgeId}-edge-b`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d8dce8" stopOpacity="0" />
                <stop offset="14%" stopColor="#c8d4e8" stopOpacity="0.28" />
                <stop offset="34%" stopColor="#8898b8" stopOpacity="0.14" />
                <stop offset="52%" stopColor="#a8b8d8" stopOpacity="0.26" />
                <stop offset="70%" stopColor="#707890" stopOpacity="0.1" />
                <stop offset="86%" stopColor="#c8d4e8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#e0e4f8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect
              className="nav-edge-dash nav-edge-dash-a"
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx="calc(1rem - 1.5px)"
              ry="calc(1rem - 1.5px)"
              fill="none"
              stroke={`url(#${edgeId}-edge-a)`}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              vectorEffect="nonScalingStroke"
            />
            <rect
              className="nav-edge-dash nav-edge-dash-b"
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx="calc(1rem - 1.5px)"
              ry="calc(1rem - 1.5px)"
              fill="none"
              stroke={`url(#${edgeId}-edge-b)`}
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              vectorEffect="nonScalingStroke"
            />
          </svg>
          <div className="header-surface relative">
            <nav className="relative z-10 flex w-full items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <button
                onClick={() => handleNavigate("#home")}
                className="focus-ring shrink-0 rounded-md text-left text-xl font-extrabold tracking-tight text-[var(--color-link)]"
              >
                Nicholas Griffiths
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-6 sm:gap-8">
                <ul className="hidden items-center gap-8 lg:flex">
                  {items.map((item) => {
                    const sectionId = item.href.replace("#", "");
                    const isActive = sectionId === activeSection;
                    return (
                      <li key={item.label}>
                        <button
                          onClick={() => handleNavigate(item.href)}
                          aria-current={isActive ? "page" : undefined}
                          className={`focus-ring rounded-md font-semibold transition-colors ${
                            isActive ? "text-[var(--color-link)]" : "text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                          }`}
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
                  className="focus-ring hidden shrink-0 rounded-md font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] lg:inline-block"
                >
                  Resume ↗
                </a>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
                    aria-expanded={mobileOpen}
                    aria-controls={MOBILE_MENU_ID}
                    className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-md lg:hidden"
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
