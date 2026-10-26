import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "cookie-consent";

export type ConsentStatus = "accepted" | "declined" | undefined;

function readStoredConsent(): ConsentStatus {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "accepted" || stored === "declined" ? stored : undefined;
}

interface ConsentContextValue {
  consent: ConsentStatus;
  setConsent: (value: ConsentStatus) => void;
}

// Shared store: every call site (banner, footer, analytics listener) must see
// the same consent value and the same setter, or acceptance/revocation only
// updates whichever component happened to call setConsent.
const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentStatus>(readStoredConsent);

  const setConsent = useCallback((value: ConsentStatus) => {
    if (value === undefined) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    setConsentState(value);
  }, []);

  // No JSX here: this is a .ts file (hook-adjacent provider, no existing .tsx
  // provider convention in this project to match), so build the element directly.
  return createElement(ConsentContext.Provider, { value: { consent, setConsent } }, children);
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
