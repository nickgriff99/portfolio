import { useLocation, useNavigate } from "react-router-dom";

/**
 * Anchor links (#home, #experience, #contact) only resolve on `/`. From any other
 * route (`/about`, `/projects`, `/projects/:slug`), navigate to `/` + the hash and
 * let `Home`'s hash-scroll effect finish the job once it mounts/updates.
 */
export function useHomeAnchor(onNavigate: (href: `#${string}`) => void) {
  const location = useLocation();
  const navigate = useNavigate();

  return (href: `#${string}`) => {
    if (location.pathname === "/") {
      onNavigate(href);
    } else {
      navigate(`/${href}`);
    }
  };
}
