import { Suspense, lazy, useState } from "react";
import type { NavItem } from "../types";
import { useTheme } from "../context/ThemeContext";
import { FluidGlassHeader } from "./FluidGlassHeader";

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
  const { theme, toggleTheme } = useTheme();

  const handleNavigate = (href: string) => {
    onNavigate(href);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full px-4 pt-3 transition-transform duration-300 sm:px-6 lg:px-8 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="header-surface relative overflow-hidden rounded-2xl border border-white/20">
          <FluidGlassHeader />
          <nav className="relative z-10 flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => handleNavigate("#home")}
            className="text-left text-xl font-extrabold tracking-tight text-[var(--color-text)]"
          >
            Nicholas Griffiths
          </button>

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

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark and light mode"
              className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-[var(--color-text)] backdrop-blur transition-colors hover:bg-white/20"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

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
          </nav>
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
