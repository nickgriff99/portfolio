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
        /* threshold 0: any overlap counts. 0.08 could report "not intersecting" on first frame and hide the whole hero. */
        threshold: 0,
        rootMargin: "0px 0px 120px 0px",
      },
    );

    /** If layout/IO race left above-the-fold nodes without intersection, force them visible. */
    const syncVisibleInViewport = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        const rect = element.getBoundingClientRect();
        const vh = window.innerHeight || 0;
        const visible =
          rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < vh;
        if (visible) {
          element.classList.add("in-view", "keep-visible");
          element.classList.remove("out-view");
        }
      });
    };

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
    requestAnimationFrame(() => {
      requestAnimationFrame(syncVisibleInViewport);
    });

    const mutationObserver = new MutationObserver(() => {
      observeElements();
      requestAnimationFrame(() => {
        requestAnimationFrame(syncVisibleInViewport);
      });
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
