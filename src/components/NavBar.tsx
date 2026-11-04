import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { NavItem } from "../types";
import { useHomeAnchor } from "../hooks/useHomeAnchor";
import { useMediaMinWidth } from "../hooks/useMediaMinWidth";
import { StaggeredMenu } from "./StaggeredMenu";

type NavBarProps = {
  items: NavItem[];
  activeSection: string;
  hidden: boolean;
  compact: boolean;
  onNavigate: (href: `#${string}`) => void;
};

const MOBILE_MENU_ID = "mobile-nav-drawer";

// Shared desktop item wrapper class (both the anchor <button> and the route <Link>
// render this). Active state is a filled chip around the label span only - the index
// prefix span (rendered separately, see navIndexClass) always stays plain.
function navItemClass() {
  return "focus-ring flex items-center gap-2 rounded-none px-1 py-2 font-mono text-sm font-semibold uppercase tracking-wide transition-colors";
}

// Muted mono index prefix ("01", "02", ...) - same visual weight as StaggeredMenu's
// own index spans (StaggeredMenu.tsx ~139,149), kept lighter/smaller than the label.
const navIndexClass = "text-xs font-normal text-[var(--color-soft)]";

// Active: solid-filled chip behind the label. Inactive: flat muted text, no box.
function navLabelClass(isActive: boolean) {
  return isActive
    ? "rounded-[8px] bg-[var(--color-link)] px-2 py-1 text-[#0a0a0a]"
    : "text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]";
}

export function NavBar({ items, activeSection, hidden, compact, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const goToAnchor = useHomeAnchor(onNavigate);
  // `hidden` (scroll-direction hide) is a mobile/tablet-only behavior (plan E0) - at
  // `lg`+ the bar only compacts, never translates off-screen. `headerHidden` upstream
  // (usePortfolioScroll) isn't breakpoint-aware, so gate it here instead of leaving the
  // translate/inert unconditional (which hid+inert'd the whole desktop nav on scroll-down).
  const isDesktop = useMediaMinWidth(1024);
  const effectiveHidden = hidden && !isDesktop;

  const handleNavigate = (item: NavItem) => {
    goToAnchor(item);
    setMobileOpen(false);
  };

  return (
    <header
      // `inert` also removes every descendant (nav links) from the Tab order and a11y
      // tree while the header is translated off-screen - same pattern as StaggeredMenu's
      // off-canvas `<aside>`, see StaggeredMenu.tsx.
      inert={effectiveHidden}
      // `-translate-y-full` moves the header by exactly its own height - but `.nav-shell`'s
      // offset box-shadow paints 6px past the border-box edge, so that sliver would still
      // land at y=0..6px after the translate ("lingering shadow"). Clearing by `100% + 8px`
      // takes the shadow fully off-screen too.
      className={`fixed left-0 top-0 z-50 w-full px-4 pt-3 transition-transform duration-300 sm:px-6 lg:px-0 ${compact ? "lg:pt-0" : "lg:pt-3"} ${effectiveHidden ? "-translate-y-[calc(100%+8px)]" : "translate-y-0"}`}
    >
      <div className="mx-auto w-full max-w-7xl lg:max-w-none">
        <div className="nav-shell">
          <nav
            className={`relative flex w-full items-center gap-4 px-4 py-4 sm:px-6 lg:px-8 ${compact ? "lg:py-2" : "lg:py-4"}`}
          >
            <button
              onClick={() => handleNavigate({ type: "anchor", label: "Home", href: "#home" })}
              className="focus-ring shrink-0 rounded-none text-left font-mono text-lg font-extrabold uppercase tracking-tight text-[var(--color-link)]"
            >
              Nicholas Griffiths
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-6 sm:gap-8">
              <ul className="hidden items-center gap-8 lg:flex">
                {items.map((item, index) => {
                  const indexPrefix = <span className={navIndexClass}>0{index + 1}</span>;
                  if (item.type === "route") {
                    const isActive = location.pathname === item.to;
                    return (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          aria-current={isActive ? "page" : undefined}
                          className={navItemClass()}
                        >
                          {indexPrefix}
                          <span className={navLabelClass(isActive)}>{item.label}</span>
                        </Link>
                      </li>
                    );
                  }
                  const sectionId = item.href.replace("#", "");
                  const isActive =
                    item.type === "anchor-or-route" && location.pathname !== "/"
                      ? location.pathname === item.to
                      : sectionId === activeSection;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNavigate(item)}
                        aria-current={isActive ? "page" : undefined}
                        className={navItemClass()}
                      >
                        {indexPrefix}
                        <span className={navLabelClass(isActive)}>{item.label}</span>
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
                  className="focus-ring relative z-[120] flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border-2 border-[var(--color-border)] lg:hidden"
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
