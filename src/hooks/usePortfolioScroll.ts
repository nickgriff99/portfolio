import { useEffect, useRef, useState } from "react";

export function usePortfolioScroll(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "home");
  const [headerHidden, setHeaderHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
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

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
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
