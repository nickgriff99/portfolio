import { useCallback, useState } from "react";

const STORAGE_KEY = "cookie-consent";

export type ConsentStatus = "accepted" | "declined" | undefined;

function readStoredConsent(): ConsentStatus {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "accepted" || stored === "declined" ? stored : undefined;
}

export function useConsent() {
  const [consent, setConsentState] = useState<ConsentStatus>(readStoredConsent);

  const setConsent = useCallback((value: ConsentStatus) => {
    if (value === undefined) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    setConsentState(value);
  }, []);

  return { consent, setConsent };
}
