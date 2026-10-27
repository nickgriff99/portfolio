import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of children on error. Defaults to a visible "something went
   * wrong" message (routes). Pass `null` for decorative/non-critical lazy chunks
   * (e.g. background particle effects) where a silent failure is correct. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

const DEFAULT_FALLBACK = (
  <div className="flex min-h-screen items-center justify-center p-8 text-center text-[var(--color-text)]">
    <p>
      Something went wrong loading this page.{" "}
      <a href="/" className="focus-ring underline">
        Back to home
      </a>
    </p>
  </div>
);

// Minimal boundary for lazy-loaded chunks: stops a failed chunk fetch (offline blip,
// stale deploy hash) from silently unmounting the whole app. No retry/telemetry by design.
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback !== undefined ? this.props.fallback : DEFAULT_FALLBACK;
    }

    return this.props.children;
  }
}
