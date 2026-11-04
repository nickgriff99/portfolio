import { useEffect, useState } from "react";

/**
 * `true` when the device can hover with a precise (mouse/trackpad) pointer -
 * `matchMedia("(hover: hover) and (pointer: fine)")`. Touch-only devices (which
 * can get "stuck" in a hover/active state after a tap) report `false`. Same
 * matchMedia-listener convention as `useMediaMinWidth`/`usePrefersReducedMotion`.
 */
export function useHoverCapablePointer(): boolean {
  const [isHoverCapable, setIsHoverCapable] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const handleChange = () => {
      setIsHoverCapable(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHoverCapable;
}
