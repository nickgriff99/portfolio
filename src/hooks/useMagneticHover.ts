import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useHoverCapablePointer } from "./useHoverCapablePointer";

type MagneticHoverOptions = {
  /** Max px the element shifts toward the cursor at the edge of its own bounds. Default 5 -
   * kept deliberately subtle per owner feedback (an earlier default of 14 read as "far too
   * strong" live). */
  strength?: number;
};

/**
 * Returns a ref for a "magnetic button" hover effect: on mousemove within the
 * element's own bounds, it eases toward the cursor (GSAP `quickTo`-driven, no
 * React-state/`gsap.set` re-renders - buttery, no layout thrash); on mouse-leave
 * it springs back to rest. Fully inert (zero listeners attached, zero tweens) when
 * `prefers-reduced-motion` is set or the device can't hover with a fine pointer -
 * same guard convention as this repo's other motion hooks.
 */
export function useMagneticHover<T extends HTMLElement>({
  strength = 5,
}: MagneticHoverOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isHoverCapable = useHoverCapablePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion || !isHoverCapable) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [prefersReducedMotion, isHoverCapable, strength]);

  return ref;
}
