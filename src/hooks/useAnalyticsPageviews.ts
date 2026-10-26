import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { loadGA4, trackPageview } from "../utils/analytics";
import { useConsent } from "./useConsent";

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

export function useAnalyticsPageviews() {
  const { consent } = useConsent();
  const location = useLocation();
  const hasLoaded = useRef(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== "accepted" || hasLoaded.current) return;
    hasLoaded.current = true;
    loadGA4(MEASUREMENT_ID);
  }, [consent]);

  useEffect(() => {
    // Reset on every non-accepted state (not just once): otherwise a
    // revoke-then-reaccept on the same path (now reachable without reload
    // since consent lives in Context) would see the stale ref match the
    // unchanged pathname and silently skip the reacceptance's pageview.
    if (consent !== "accepted") {
      lastTrackedPath.current = null;
      return;
    }
    if (lastTrackedPath.current === location.pathname) return;
    lastTrackedPath.current = location.pathname;
    trackPageview(location.pathname);
  }, [location.pathname, consent]);
}
