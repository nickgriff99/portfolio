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
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("in-view", "keep-visible");
            target.classList.remove("out-view");
            observer.unobserve(target);
          } else if (!target.classList.contains("keep-visible")) {
            target.classList.add("out-view");
            target.classList.remove("in-view");
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
