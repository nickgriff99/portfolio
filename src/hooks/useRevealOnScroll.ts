import { useEffect } from "react";

/**
 * Bidirectional scroll reveal for `.viewport-animate`.
 * Intersecting → `.in-view`; leaving → `.out-view` so the fade replays on the way back up.
 * Reduced motion: everything shown, observer skipped.
 * Do not put `.viewport-animate` on nodes that already own `transform` (terminal, bento tiles, SkillsWidget).
 */
export function useRevealOnScroll(selector = ".viewport-animate"): void {
  useEffect(() => {
    const nodes = () => Array.from(document.querySelectorAll<HTMLElement>(selector));

    const showAll = () => {
      nodes().forEach((element) => {
        element.classList.add("in-view");
        element.classList.remove("out-view");
        element.style.transitionDelay = "";
      });
    };

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof window.IntersectionObserver === "undefined") {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("in-view");
            target.classList.remove("out-view");
          } else {
            target.classList.add("out-view");
            target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0, rootMargin: "80px 0px 80px 0px" },
    );

    const observed = new Set<HTMLElement>();

    const observeNew = () => {
      nodes().forEach((element) => {
        if (observed.has(element) || !document.contains(element)) return;
        element.style.transitionDelay = "";
        observer.observe(element);
        observed.add(element);
      });
      for (const element of observed) {
        if (!document.contains(element)) {
          observer.unobserve(element);
          observed.delete(element);
        }
      }
    };

    observeNew();

    const mutationObserver = new MutationObserver(observeNew);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let viteAfterUpdate: (() => void) | undefined;
    if (import.meta.hot) {
      viteAfterUpdate = observeNew;
      import.meta.hot.on("vite:afterUpdate", viteAfterUpdate);
    }

    return () => {
      mutationObserver.disconnect();
      if (import.meta.hot && viteAfterUpdate) {
        import.meta.hot.off("vite:afterUpdate", viteAfterUpdate);
      }
      observed.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [selector]);
}
