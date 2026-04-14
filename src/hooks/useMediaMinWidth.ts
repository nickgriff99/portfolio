import { useEffect, useState } from "react";

/** `true` when `window.innerWidth >= minWidth` (default: Tailwind `lg`). */
export function useMediaMinWidth(minWidth = 1024) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minWidth]);

  return matches;
}
