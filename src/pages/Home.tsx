import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Lazy: pulls in `ogl` (WebGL), not needed for first paint - the body's own CSS
// gradient (global.css) already paints this same dark background underneath, so
// a `null` Suspense fallback during the brief chunk-load window is invisible.
const Grainient = lazy(() => import("@/bits/Grainient"));
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { SectionRule } from "../components/SectionRule";
import { RouteErrorBoundary } from "../components/RouteErrorBoundary";
import { AboutMe } from "../components/sections/AboutMe";
import { ContactSection } from "../components/sections/ContactSection";
import { TerminalSession } from "../components/sections/TerminalSession";
import { HeroSection } from "../components/sections/HeroSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { NAV_ITEMS } from "../data/navItems";
import { useConsent } from "../hooks/useConsent";
import { usePortfolioScroll } from "../hooks/usePortfolioScroll";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useMagneticHover } from "../hooks/useMagneticHover";

export function Home() {
  const sectionIds = useMemo(
    () => ["home", "projects", "experience", "contact"],
    [],
  );

  const { activeSection, headerHidden, scrolled, showBackToTop, scrollToSection } =
    usePortfolioScroll(sectionIds);

  useRevealOnScroll();

  // Cross-page anchor links (useHomeAnchor) land here as `/#id` - once mounted (and on
  // every hash change, e.g. clicking another anchor link while already on `/`), scroll
  // the matching section into view. No existing hash-scroll logic before this.
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    scrollToSection(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollToSection is stable per sectionIds identity
  }, [location.hash]);

  const backToTopRef = useMagneticHover<HTMLButtonElement>({ strength: 3 });
  // Consent banner's mobile card (flex-col, ~144px tall) physically occupies the
  // same bottom-right corner as this button at <640px - not just a stacking-order
  // z-index clash, the banner's card is a real obstruction. Rather than viewport-
  // specific offset math, just don't show both reachable targets at once.
  const { consent } = useConsent();
  const bannerVisible = consent === undefined;

  const [grainientUnavailable, setGrainientUnavailable] = useState(false);
  const [particlesUnavailable, setParticlesUnavailable] = useState(false);
  const useHeroCssFallback = grainientUnavailable || particlesUnavailable;

  // Cached ref to the hero element - avoids getElementById on every rAF tick.
  const heroElemRef = useRef<HTMLElement | null>(null);

  // ResizeObserver: keep --hero-h CSS var in sync with hero's rendered height.
  // Written on the hero element itself (not documentElement) so only styles on/inside the
  // hero element trigger style recalc, not the entire document.
  const heroHeightRef = useRef(0);
  useEffect(() => {
    const hero = document.getElementById("home") as HTMLElement | null;
    if (!hero) return;
    heroElemRef.current = hero;
    let lastH = -1;
    const update = () => {
      const h = hero.offsetHeight;
      heroHeightRef.current = h;
      if (h !== lastH) {
        lastH = h;
        hero.style.setProperty("--hero-h", `${h}px`);
      }
    };
    const ro = new ResizeObserver(update);
    ro.observe(hero);
    update(); // initial
    return () => ro.disconnect();
  }, []);

  // Scroll listener: writes --hero-progress (0→1) on the hero element for parallax CSS;
  // sets `inert` on hero once curtain fully covers it (scrollY >= heroH).
  // --hero-progress and --hero-h written on #home, not :root - only hero subtree recalcs.
  // Skips write when value unchanged (no-op past heroH where progress stays 1).
  // Inert toggling runs both directions (set when covered, cleared when user scrolls back).
  // Passive + rAF-throttled.
  useEffect(() => {
    let rafId: number | null = null;
    let lastProgress = -1;
    // Mobile Safari collapses/expands its address bar *while* scrolling, which live-changes
    // 100dvh - and `.section-hero`'s sticky `top` (global.css) is 100dvh-based, so the
    // ResizeObserver above re-measures `heroH` in step with `scrollY` right around the
    // covered/uncovered crossover. Without a buffer, `covered` flips back and forth a few
    // times a second there, toggling `visibility:hidden` on the whole hero and flashing the
    // Grainient background through - the flicker reported scrolling on a real phone. A dead
    // zone around the boundary (not a single threshold) means small chrome-driven jitter can't
    // flip the state; only a real ~60px+ scroll past the boundary commits the change.
    const COVER_HYSTERESIS = 64;
    let wasCovered = false;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const hero = heroElemRef.current;
        if (!hero) return;
        const heroH = heroHeightRef.current || window.innerHeight;
        const scrollY = window.scrollY;
        const covered = wasCovered
          ? scrollY >= heroH - COVER_HYSTERESIS
          : scrollY >= heroH + COVER_HYSTERESIS;
        wasCovered = covered;

        // Inert: set when curtain fully covers hero, clear when scrolling back up.
        if (covered) {
          if (!hero.hasAttribute("inert")) hero.setAttribute("inert", "");
          hero.style.setProperty("visibility", "hidden");
        } else {
          if (hero.hasAttribute("inert")) hero.removeAttribute("inert");
          hero.style.removeProperty("visibility");
        }

        // Parallax progress: skip write if value hasn't changed (e.g. while deep in curtain
        // progress stays 1). Also stops triggering style recalc when nothing would change.
        const progress = covered ? 1 : Math.max(0, scrollY / heroH);
        if (progress !== lastProgress) {
          lastProgress = progress;
          hero.style.setProperty("--hero-progress", String(progress));
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // sync on mount
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    scrollToSection(id);
  };

  return (
    <>
      <NavBar
        items={NAV_ITEMS}
        activeSection={activeSection}
        hidden={headerHidden}
        compact={scrolled}
        onNavigate={handleNavClick}
      />

      {/* Grainient: viewport-sized, fixed behind everything. Previously page-tall absolute
          (covered the whole page-length canvas). Now fixed = always exactly one viewport,
          which saves rendering the canvas over the curtain section and the footer (saves
          roughly 3-5× the canvas pixel count on a long page at 1920×1080). The opaque
          .page-curtain below visually hides it behind the curtain anyway.
          RouteErrorBoundary + onUnavailable silent-fallback behavior unchanged. */}
      {/* bg-[var(--color-bg)]: solid dark base behind the WebGL canvas. The canvas uses
          alpha:true so any unrendered edge pixels or sub-pixel gaps would otherwise composite
          against the body's lime/teal radial gradient (color-link 22% at 5% 0%), producing
          a green-grey patch on mobile. The dark base colour makes those gaps invisible. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[var(--color-bg)]"
      >
        <RouteErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Grainient
              onUnavailable={() => setGrainientUnavailable(true)}
              color1="#000000"
              color2="#0d273B"
              color3="#194360"
              timeSpeed={0.05}
              colorBalance={-0.12}
              warpStrength={0.58}
              warpFrequency={0.48}
              warpSpeed={0}
              warpAmplitude={42}
              blendAngle={144}
              blendSoftness={1.28}
              rotationAmount={300}
              noiseScale={1.25}
              grainAmount={0}
              grainScale={0.2}
              grainAnimated={false}
              contrast={0.8}
              gamma={0.82}
              saturation={0.9}
              centerX={0.5}
              centerY={-0.5}
              zoom={0.6}
            />
          </Suspense>
        </RouteErrorBoundary>
      </div>

      {/* main: relative + z-10 lifts it above the fixed Grainient (z-0).
          Hero section inside has position:sticky via .section-hero in global.css.
          Curtain wrapper (.page-curtain) sits after hero in DOM and paints over it. */}
      <main className="relative z-10 w-full">
        <HeroSection
          onNavigate={handleNavClick}
          useHeroCssFallback={useHeroCssFallback}
          onParticlesUnavailable={() => setParticlesUnavailable(true)}
        />

        {/* Curtain: opaque dark wrapper that scrolls up over the pinned hero.
            z-index:1 (via .page-curtain) > hero z-index:0, ensuring the curtain
            is always visually and click-wise on top. Footer folded in so the curtain
            background covers the hero through the very end of the page. */}
        <div className="page-curtain">
          <AboutMe onNavigate={handleNavClick} />
          <SectionRule label="projects" />
          <ProjectsSection />
          <SectionRule label="experience" />
          <TerminalSession />
          <SectionRule label="contact" />
          <ContactSection />
          <Footer />
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <button
          ref={backToTopRef}
          type="button"
          aria-label="Return to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          // `transform` deliberately excluded: `useMagneticHover` owns it (mousemove-tracked
          // x/y) - a CSS transform transition here would fight the GSAP tween frame-by-frame.
          // Only `opacity`/`filter` (visibility fade + hover brightness) need one.
          className={`focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl text-[#0a0a0a] shadow-lg shadow-black/20 transition-[opacity,filter] duration-300 hover:brightness-110 ${
            showBackToTop && !bannerVisible
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }`}
        >
          ↑
        </button>
      </div>
    </>
  );
}
