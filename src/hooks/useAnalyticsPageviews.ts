import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { loadGA4, trackPageview } from "../utils/analytics";
import { useConsent } from "./useConsent";

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

export function useAnalyticsPageviews() {
  const { consent } = useConsent();
  const location = useLocation();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (consent !== "accepted" || hasLoaded.current) return;
    hasLoaded.current = true;
    loadGA4(MEASUREMENT_ID);
  }, [consent]);

  useEffect(() => {
    if (consent !== "accepted") return;
    trackPageview(location.pathname);
  }, [location.pathname, consent]);
}
