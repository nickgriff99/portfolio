import { useEffect } from "react";

export function useRevealOnScroll(selector = ".viewport-animate"): void {
  useEffect(() => {
    const observed = new Set<HTMLElement>();
    const revealAll = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        if (!observed.has(element)) {
          element.classList.add("in-view");
          element.classList.remove("out-view");
          observed.add(element);
        }
      });
    };

    if (typeof window.IntersectionObserver === "undefined") {
      revealAll();
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

    const observeElements = () => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((element, index) => {
        if (observed.has(element)) {
          return;
        }

        element.style.transitionDelay = `${index * 0.04}s`;
        element.classList.add("in-view");
        element.classList.remove("out-view");
        observer.observe(element);
        observed.add(element);
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observed.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [selector]);
}
