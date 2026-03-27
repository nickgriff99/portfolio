import { useEffect } from "react";

function isRectInViewport(rect: DOMRect, vh: number): boolean {
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < vh;
}

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

    const syncVisibleInViewport = () => {
      const vh = window.innerHeight || 0;
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (isRectInViewport(rect, vh)) {
          element.classList.add("in-view", "keep-visible");
          element.classList.remove("out-view");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const vh = window.innerHeight || 0;
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("in-view", "keep-visible");
            target.classList.remove("out-view");
            observer.unobserve(target);
          } else if (!target.classList.contains("keep-visible")) {
            const rect = target.getBoundingClientRect();
            // IO can briefly report not intersecting during layout / HMR; don't hide if still on-screen.
            if (isRectInViewport(rect, vh)) {
              target.classList.add("in-view", "keep-visible");
              target.classList.remove("out-view");
              observer.unobserve(target);
            } else {
              target.classList.add("out-view");
              target.classList.remove("in-view");
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "120px 0px 120px 0px",
      },
    );

    const observeElements = () => {
      for (const el of Array.from(observed)) {
        if (!document.contains(el)) {
          observed.delete(el);
        }
      }

      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((element, index) => {
        if (!observed.has(element)) {
          element.style.transitionDelay = `${index * 0.04}s`;
          element.classList.add("in-view");
          element.classList.remove("out-view");
          observer.observe(element);
          observed.add(element);
        } else {
          const rect = element.getBoundingClientRect();
          const vh = window.innerHeight || 0;
          if (isRectInViewport(rect, vh) && !element.classList.contains("keep-visible")) {
            element.classList.add("in-view", "keep-visible");
            element.classList.remove("out-view");
          }
        }
      });
    };

    observeElements();
    requestAnimationFrame(() => {
      requestAnimationFrame(syncVisibleInViewport);
    });

    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimeout !== undefined) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeTimeout = undefined;
        syncVisibleInViewport();
      }, 100);
    };
    window.addEventListener("resize", onResize);

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

    let viteAfterUpdate: (() => void) | undefined;
    if (import.meta.hot) {
      viteAfterUpdate = () => {
        observeElements();
        requestAnimationFrame(() => {
          requestAnimationFrame(syncVisibleInViewport);
        });
      };
      import.meta.hot.on("vite:afterUpdate", viteAfterUpdate);
    }

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("resize", onResize);
      if (resizeTimeout !== undefined) clearTimeout(resizeTimeout);
      if (import.meta.hot && viteAfterUpdate) {
        import.meta.hot.off("vite:afterUpdate", viteAfterUpdate);
      }
      observed.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [selector]);
}
