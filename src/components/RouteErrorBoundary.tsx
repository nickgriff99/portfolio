import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Minimal boundary for lazy-loaded routes: stops a failed chunk fetch (offline blip,
// stale deploy hash) from silently unmounting the whole app. No retry/telemetry by design.
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8 text-center text-[var(--color-text)]">
          <p>
            Something went wrong loading this page.{" "}
            <a href="/" className="focus-ring underline">
              Back to home
            </a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
