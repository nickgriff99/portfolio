import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { NavItem } from "../types";
import { useHomeAnchor } from "../hooks/useHomeAnchor";
import { useMediaMinWidth } from "../hooks/useMediaMinWidth";
import { StaggeredMenu } from "./StaggeredMenu";
import ShinyText from "../bits/ShinyText";

type NavBarProps = {
  items: NavItem[];
  activeSection: string;
  hidden: boolean;
  compact: boolean;
  onNavigate: (href: `#${string}`) => void;
};

const MOBILE_MENU_ID = "mobile-nav-drawer";

// Inactive hover uses the same lime pairing as HeroSection's "Griffiths"
// (color="#a3e635" shineColor="#e4ffb0"). Active hover lives on the teal chip, so
// its sweep matches the logo instead (teal ink + white specular) - a lime flash
// on that pill fights --color-link.
const NAV_SHINE_COLOR = "#a3e635";
const NAV_SHINE_HIGHLIGHT = "#e4ffb0";
const NAV_SHINE_ACTIVE_HIGHLIGHT = "#ffffff";

// Shared desktop item wrapper class (both the anchor <button> and the route <Link>
// render this). `group` lets the label/index spans react to hover anywhere in this
// box, not just when the cursor is directly over the text itself. Active state is a
// filled chip around the label span only - the index prefix span (rendered separately,
// see navIndexClass) always stays plain.
function navItemClass() {
  return "group focus-ring flex items-center gap-2 rounded-none px-1 py-2 font-mono text-sm font-semibold uppercase tracking-wide transition-colors";
}

// Muted mono index prefix ("01", "02", ...) - same visual weight as StaggeredMenu's
// own index spans (StaggeredMenu.tsx ~139,149), kept lighter/smaller than the label.
// Active tab's index picks up the link color too, matching its filled label chip.
function navIndexClass(isActive: boolean) {
  return `text-xs font-normal ${isActive ? "text-[var(--color-link)]" : "text-[var(--color-soft)]"}`;
}

// Active chip lives on a wrapper that never unmounts. ShinyText uses
// `background-clip: text`, so putting `bg-*` on it clips the teal fill to the
// glyphs and kills the pill. Scale is CSS `group-hover` (not React hover state)
// so it doesn't wait on the ShinyText remount.
function navLabelLayoutClass(isActive: boolean) {
  return isActive
    ? "inline-block origin-center rounded-[8px] bg-[var(--color-link)] px-2 py-1 transition-transform duration-150 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    : "";
}

// Text color only - chip box/padding live on the wrapper above. Inactive: flat
// muted text, no box. `group-hover` (not `hover`) so the color change fires
// anywhere in the clickable box (see navItemClass).
function navLabelClass(isActive: boolean) {
  return isActive
    ? "text-[#0a0a0a]"
    : "text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)]";
}

// Color ShinyText's gradient sweeps through while a nav item is hovered - matches
// the color the plain label would already be showing (active chip text / hover green),
// so the shine rides on top of that color instead of fighting it.
function navLabelShineColor(isActive: boolean) {
  return isActive ? "#0a0a0a" : NAV_SHINE_COLOR;
}

function navLabelShineHighlight(isActive: boolean) {
  return isActive ? NAV_SHINE_ACTIVE_HIGHLIGHT : NAV_SHINE_HIGHLIGHT;
}

export function NavBar({ items, activeSection, hidden, compact, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [logoHovered, setLogoHovered] = useState(false);
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
      className={`fixed left-0 top-0 z-50 w-full px-4 pt-3 transition-transform duration-300 sm:px-6 lg:px-0 lg:pt-0 ${effectiveHidden ? "-translate-y-[calc(100%+8px)]" : "translate-y-0"}`}
    >
      <div className="mx-auto w-full max-w-7xl lg:max-w-none">
        <div className="nav-shell">
          <nav
            className={`relative flex w-full items-center gap-4 px-4 py-4 sm:px-6 lg:px-8 ${compact ? "lg:py-2" : "lg:py-4"}`}
          >
            <button
              onClick={() => handleNavigate({ type: "anchor", label: "Home", href: "#home" })}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              className="focus-ring shrink-0 rounded-none text-left font-mono text-lg font-extrabold uppercase tracking-tight"
            >
              {logoHovered ? (
                <ShinyText
                  text="Nicholas Griffiths"
                  color="var(--color-link)"
                  shineColor="#ffffff"
                  speed={4}
                />
              ) : (
                <span className="text-[var(--color-link)]">Nicholas Griffiths</span>
              )}
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-6 sm:gap-8">
              <ul className="hidden items-center gap-8 lg:flex">
                {items.map((item, index) => {
                  const isActive =
                    item.type === "route"
                      ? location.pathname === item.to
                      : item.type === "anchor-or-route" && location.pathname !== "/"
                        ? location.pathname === item.to
                        : item.href.replace("#", "") === activeSection;
                  const isHovered = hoveredLabel === item.label;
                  const inner = isHovered ? (
                    <ShinyText
                      text={item.label}
                      color={navLabelShineColor(isActive)}
                      shineColor={navLabelShineHighlight(isActive)}
                      speed={4}
                    />
                  ) : (
                    <span className={navLabelClass(isActive)}>{item.label}</span>
                  );
                  const label = isActive ? (
                    <span className={navLabelLayoutClass(true)}>{inner}</span>
                  ) : (
                    inner
                  );
                  const liProps = {
                    key: item.label,
                    onMouseEnter: () => setHoveredLabel(item.label),
                    onMouseLeave: () => setHoveredLabel(null),
                  };
                  if (item.type === "route") {
                    return (
                      <li {...liProps}>
                        <Link
                          to={item.to}
                          aria-current={isActive ? "page" : undefined}
                          className={navItemClass()}
                        >
                          <span className={navIndexClass(isActive)}>0{index + 1}</span>
                          {label}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li {...liProps}>
                      <button
                        onClick={() => handleNavigate(item)}
                        aria-current={isActive ? "page" : undefined}
                        className={navItemClass()}
                      >
                        <span className={navIndexClass(isActive)}>0{index + 1}</span>
                        {label}
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
