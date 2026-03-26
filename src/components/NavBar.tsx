import { Suspense, lazy, useId, useState } from "react";
import type { NavItem } from "../types";

const StaggeredMenu = lazy(() =>
  import("./StaggeredMenu").then((module) => ({ default: module.StaggeredMenu })),
);

type NavBarProps = {
  items: NavItem[];
  activeSection: string;
  hidden: boolean;
  onNavigate: (href: string) => void;
};

export function NavBar({ items, activeSection, hidden, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const edgeId = useId().replace(/:/g, "");

  const handleNavigate = (href: string) => {
    onNavigate(href);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full px-4 pt-3 transition-transform duration-300 sm:px-6 lg:px-8 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
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
                <stop offset="0%" stopColor="#f0f4ff" stopOpacity="0.9" />
                <stop offset="28%" stopColor="#a8b8d8" stopOpacity="0.55" />
                <stop offset="55%" stopColor="#d4c8f0" stopOpacity="0.7" />
                <stop offset="78%" stopColor="#9ec4d8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#e8ecf8" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id={`${edgeId}-edge-b`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c8d4e8" stopOpacity="0.65" />
                <stop offset="40%" stopColor="#8898b8" stopOpacity="0.35" />
                <stop offset="72%" stopColor="#b8c8e8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#e0e4f8" stopOpacity="0.75" />
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
                className="shrink-0 text-left text-xl font-extrabold tracking-tight text-[var(--color-text)]"
              >
                Nicholas Griffiths
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-6 sm:gap-8">
                <ul className="hidden items-center gap-8 md:flex">
                  {items.map((item) => {
                    const sectionId = item.href.replace("#", "");
                    const isActive = sectionId === activeSection;
                    return (
                      <li key={item.label}>
                        <button
                          onClick={() => handleNavigate(item.href)}
                          className={`font-semibold transition-colors ${
                            isActive ? "text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Open mobile menu"
                    className="md:hidden"
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

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <StaggeredMenu
            open={mobileOpen}
            items={items}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onClose={() => setMobileOpen(false)}
          />
        </Suspense>
      </div>
    </header>
  );
}
