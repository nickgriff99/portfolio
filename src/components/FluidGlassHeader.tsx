import { Suspense, lazy } from "react";

import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const FluidGlassScene = lazy(() => import("./FluidGlassScene"));

function hasWebGLSupport() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
}

export function FluidGlassHeader() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canRenderScene =
    !prefersReducedMotion && window.innerWidth >= 1024 && hasWebGLSupport();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-95">
      {canRenderScene ? (
        <Suspense fallback={<div className="h-full w-full bg-white/10" />}>
          <FluidGlassScene />
        </Suspense>
      ) : (
        <div className="h-full w-full bg-white/10" />
      )}
    </div>
  );
}
