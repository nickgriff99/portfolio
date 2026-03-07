import { useEffect } from "react";

export function useRevealOnScroll(selector = ".viewport-animate"): void {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            entry.target.classList.remove("out-view");
          } else if (!entry.target.classList.contains("keep-visible")) {
            entry.target.classList.add("out-view");
            entry.target.classList.remove("in-view");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 120px 0px",
      },
    );

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${index * 0.04}s`;
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [selector]);
}
