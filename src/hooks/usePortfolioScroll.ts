import { useEffect, useRef, useState } from "react";

export function usePortfolioScroll(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "home");
  const [headerHidden, setHeaderHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Lazy-init to the real scroll position at mount, not 0 — a hardcoded 0 here makes
  // the first `update()` misread a restored/jumped scroll position (browser scroll
  // restore, keyboard-focus auto-scroll) as a large fast downward scroll and hides
  // the header with zero actual user input.
  const lastScrollTopRef = useRef(window.scrollY);

  useEffect(() => {
    const update = () => {
      const header = document.querySelector("header");
      const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      const lastScrollTop = lastScrollTopRef.current;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) {
          continue;
        }

        if (scrollTop >= section.offsetTop - headerHeight - 200) {
          setActiveSection(id);
        }
      }

      if (Math.abs(scrollTop - lastScrollTop) > 5) {
        setHeaderHidden(scrollTop > lastScrollTop && scrollTop > 40);
        lastScrollTopRef.current = scrollTop;
      }

      setShowBackToTop(scrollTop > 500);
    };

    // rAF-throttle: native `scroll` can fire far more often than once per frame
    // (especially with momentum scrolling), and each tick was doing a `querySelector`
    // + up to 7 `getElementById` calls synchronously. Coalescing to one pass per
    // animation frame keeps the same visual update cadence (never more than 1
    // frame of latency) while cutting redundant DOM reads during a scroll burst.
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [sectionIds]);

  const scrollToSection = (sectionId: string) => {
    const header = document.querySelector("header");
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
    const top = target.offsetTop - headerHeight;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return {
    activeSection,
    headerHidden,
    showBackToTop,
    scrollToSection,
  };
}
