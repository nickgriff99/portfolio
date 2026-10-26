import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { useAnalyticsPageviews } from "./hooks/useAnalyticsPageviews";
import { ConsentProvider } from "./hooks/useConsent";
import { Home } from "./pages/Home";

// Lazy: separate route, never needed on the "/" page's first load. Named export,
// so map it to the `default` shape `React.lazy` requires.
const ThankYou = lazy(() =>
  import("./pages/ThankYou").then((m) => ({ default: m.ThankYou })),
);

function AnalyticsListener() {
  useAnalyticsPageviews();
  return null;
}

function App() {
  return (
    <ConsentProvider>
      <BrowserRouter>
        <AnalyticsListener />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/thank-you"
            element={
              <RouteErrorBoundary>
                <Suspense fallback={null}>
                  <ThankYou />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
        </Routes>
        <CookieConsentBanner />
      </BrowserRouter>
    </ConsentProvider>
  );
}

export default App;
