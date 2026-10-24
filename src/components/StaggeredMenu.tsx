import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { NavItem } from "../types";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type StaggeredMenuProps = {
  id?: string;
  open: boolean;
  items: NavItem[];
  activeSection: string;
  onNavigate: (href: string) => void;
  onClose: () => void;
};

/**
 * Mobile drawer + backdrop rendered via portal (header uses transform; fixed children would be trapped).
 * Uses CSS transforms only — GSAP inline styles previously overrode Tailwind and could leave opacity:0 stuck
 * (e.g. after prefers-reduced-motion toggled or effect early-return).
 */
export function StaggeredMenu({
  id,
  open,
  items,
  activeSection,
  onNavigate,
  onClose,
}: StaggeredMenuProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dialog declares `aria-modal`, so it should at least be escapable by keyboard —
  // closed items are also made unreachable below via `inert` (closed = not just hidden
  // behind `pointer-events-none`, items were still Tab-focusable while invisible).
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-[color-mix(in_srgb,var(--color-bg)_50%,transparent)] backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        id={id}
        // `aria-hidden` alone doesn't stop focus landing in a visually-closed panel —
        // `inert` also removes every descendant from the Tab order (and the a11y tree).
        inert={!open}
        className={cn(
          "fixed right-0 top-0 z-[110] h-screen w-[86vw] max-w-sm border-l border-[color-mix(in_srgb,var(--color-border)_45%,transparent)] bg-[var(--color-surface)] p-8 shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden",
          open ? "pointer-events-auto translate-x-0" : "pointer-events-none translate-x-full",
        )}
        aria-hidden={!open}
        aria-label="Site navigation"
        {...(open ? { "aria-modal": true as const } : {})}
        role="dialog"
      >
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-[var(--color-soft)]">Menu</p>
        <ul className="space-y-4">
          {items.map((item, index) => {
            const sectionId = item.href.replace("#", "");
            const isActive = sectionId === activeSection;
            return (
              <li
                key={item.label}
                className={cn(
                  "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                style={{
                  transitionDelay:
                    open && !prefersReducedMotion ? `${80 + index * 50}ms` : "0ms",
                }}
              >
                <button
                  type="button"
                  onClick={() => onNavigate(item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "focus-ring sm-item w-full text-left text-3xl font-semibold tracking-tight transition-colors",
                    isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text)] hover:text-[var(--color-accent)]",
                  )}
                >
                  <span className="mr-3 text-base align-middle text-[var(--color-soft)]">0{index + 1}</span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </>,
    document.body,
  );
}
