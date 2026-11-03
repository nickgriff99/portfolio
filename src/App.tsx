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

const ProjectDetail = lazy(() =>
  import("./pages/ProjectDetail").then((m) => ({ default: m.ProjectDetail })),
);

const ProjectReadme = lazy(() =>
  import("./pages/ProjectReadme").then((m) => ({ default: m.ProjectReadme })),
);

const Projects = lazy(() =>
  import("./pages/Projects").then((m) => ({ default: m.Projects })),
);

const About = lazy(() =>
  import("./pages/About").then((m) => ({ default: m.About })),
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
                {/* Non-null: Home unmounts fully on route change (fixed NavBar/Footer
                    included), so a `null` fallback here left a ~300ms fully blank body
                    between Home's content disappearing and the ThankYou chunk mounting,
                    even with the submit-intent chunk prewarm in ContactForm. This matches
                    the body's own background token so there's no white flash, plus a
                    small pulse so the gap doesn't read as a dead page. */}
                <Suspense
                  fallback={
                    <div
                      role="status"
                      className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]"
                    >
                      <span className="sr-only">Loading...</span>
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-accent)]"
                      />
                    </div>
                  }
                >
                  <ThankYou />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <RouteErrorBoundary>
                <Suspense
                  fallback={
                    <div
                      role="status"
                      className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]"
                    >
                      <span className="sr-only">Loading...</span>
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-accent)]"
                      />
                    </div>
                  }
                >
                  <ProjectDetail />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/projects/:slug/readme"
            element={
              <RouteErrorBoundary>
                <Suspense
                  fallback={
                    <div
                      role="status"
                      className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]"
                    >
                      <span className="sr-only">Loading...</span>
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-accent)]"
                      />
                    </div>
                  }
                >
                  <ProjectReadme />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/projects"
            element={
              <RouteErrorBoundary>
                <Suspense
                  fallback={
                    <div
                      role="status"
                      className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]"
                    >
                      <span className="sr-only">Loading...</span>
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-accent)]"
                      />
                    </div>
                  }
                >
                  <Projects />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/about"
            element={
              <RouteErrorBoundary>
                <Suspense
                  fallback={
                    <div
                      role="status"
                      className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]"
                    >
                      <span className="sr-only">Loading...</span>
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 animate-pulse rounded-full bg-[var(--color-accent)]"
                      />
                    </div>
                  }
                >
                  <About />
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
