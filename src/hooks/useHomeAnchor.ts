import { useNavigate } from "react-router-dom";
import type { NavItem } from "../types";

/**
 * Resolves a nav click by DOM-presence, not by which route we're on. Works for any
 * page now that Contact exists everywhere: if the target section id exists in the
 * current DOM, scroll to it locally (`onNavigate`, backed by scrollToId); otherwise
 * route to a dedicated page (`anchor-or-route`'s `to`) or fall back to `/` + hash
 * (plain `anchor` items, e.g. Home, which has no dedicated page off `/`).
 */
export function useHomeAnchor(onNavigate: (href: `#${string}`) => void) {
  const navigate = useNavigate();

  return (item: NavItem) => {
    if (item.type === "route") {
      navigate(item.to);
      return;
    }
    if (document.getElementById(item.href.slice(1))) {
      onNavigate(item.href);
    } else if (item.type === "anchor-or-route") {
      navigate(item.to);
    } else {
      navigate(`/${item.href}`);
    }
  };
}
