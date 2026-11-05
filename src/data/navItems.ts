import type { NavItem } from "../types";

/** Shared primary nav items. Module-level constant (not a hook) so every consumer
 *  gets the same stable array reference without re-deriving it via useMemo. */
export const NAV_ITEMS: NavItem[] = [
  { type: "anchor", label: "Home", href: "#home" },
  { type: "route", label: "About", to: "/about" },
  { type: "anchor-or-route", label: "Projects", href: "#projects", to: "/projects" },
  { type: "anchor-or-route", label: "Experience", href: "#experience", to: "/experience" },
  { type: "anchor", label: "Contact", href: "#contact" },
];
