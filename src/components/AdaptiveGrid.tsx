import type { ReactNode } from "react";

import type { LayoutMode } from "../types";

type AdaptiveGridProps = {
  mode: LayoutMode;
  className?: string;
  children: ReactNode;
};

export function AdaptiveGrid({ mode, className = "", children }: AdaptiveGridProps) {
  const gridClassName =
    mode === "single"
      ? "grid grid-cols-1 w-full auto-rows-auto gap-8"
      : "grid grid-cols-1 w-full auto-rows-auto gap-8 md:grid-cols-2";

  return <div className={`${gridClassName} ${className}`.trim()}>{children}</div>;
}
