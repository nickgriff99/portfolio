import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import type { NavItem } from "../types";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Only `button`s live inside the drawer today, but keep this generic in case a link/input joins them.
const FOCUSABLE_SELECTOR = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type StaggeredMenuProps = {
  id?: string;
  open: boolean;
  items: NavItem[];
  activeSection: string;
  onNavigate: (item: NavItem) => void;
  onClose: () => void;
};

/**
 * Mobile drawer + backdrop rendered via portal (header uses transform; fixed children would be trapped).
 * Uses CSS transforms only - GSAP inline styles previously overrode Tailwind and could leave opacity:0 stuck
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
  const location = useLocation();
  const asideRef = useRef<HTMLElement>(null);
  // Holds whatever had focus before the drawer opened (the hamburger button, in practice).
  // Captured via `document.activeElement` rather than a prop ref from NavBar, since this
  // component has no ref to that button and isn't allowed to touch NavBar.tsx this round.
  const triggerRef = useRef<HTMLElement | null>(null);

  // Move focus into the drawer on open (first nav item), restore it to the trigger on close -
  // `aria-modal="true"` promises modal focus behavior, so it has to actually happen.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      asideRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
    } else {
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [open]);

  // Escape-to-close (Phase 5) + real Tab-cycling focus trap: while open, Tab from the last
  // focusable item wraps to the first (Shift+Tab from the first wraps to the last) so focus
  // can never escape into `inert`-excluded background content.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = asideRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
        ref={asideRef}
        // `aria-hidden` alone doesn't stop focus landing in a visually-closed panel -
        // `inert` also removes every descendant from the Tab order (and the a11y tree).
        inert={!open}
        className={cn(
          // Opaque .nav-shell header (NavBar.tsx) is ~92px tall on mobile (pt-3 + 2px border + py-4 + 44px hamburger row + 2px border);
          // pt-28 (112px) clears it so the first item isn't hidden underneath the solid header.
          "fixed right-0 top-0 z-[110] h-screen w-[86vw] max-w-sm border-l-2 border-[var(--color-border)] bg-[var(--color-surface)] px-8 pb-8 pt-28 transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden",
          open ? "pointer-events-auto translate-x-0" : "pointer-events-none translate-x-full",
        )}
        aria-hidden={!open}
        aria-label="Site navigation"
        {...(open ? { "aria-modal": true as const } : {})}
        role="dialog"
      >
        {/* Header's own hamburger button lives in a separate `position:fixed` stacking
            context, so no z-index on it can paint above this portaled drawer - it's
            visually covered and unclickable while open. Give the drawer its own close
            affordance instead of relying on that trapped button. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close mobile menu"
          className="focus-ring absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-[8px] border-2 border-[var(--color-border)]"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <p className="mb-8 font-mono text-xs uppercase tracking-wide text-[var(--color-soft)]">// menu</p>
        <ul className="space-y-4">
          {items.map((item, index) => {
            const isActive =
              item.type === "route"
                ? location.pathname === item.to
                : item.type === "anchor-or-route" && location.pathname !== "/"
                  ? location.pathname === item.to
                  : item.href.replace("#", "") === activeSection;
            const itemClass = cn(
              "focus-ring sm-item w-full rounded-none text-left font-mono text-2xl font-semibold uppercase tracking-tight underline-offset-4 transition-colors",
              isActive
                ? "text-[var(--color-link)] underline"
                : "text-[var(--color-text)] hover:text-[var(--color-accent)]",
            );
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
                {item.type === "route" ? (
                  <Link
                    to={item.to}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={itemClass}
                  >
                    <span className="mr-3 text-base align-middle text-[var(--color-soft)]">0{index + 1}</span>
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate(item)}
                    aria-current={isActive ? "page" : undefined}
                    className={itemClass}
                  >
                    <span className="mr-3 text-base align-middle text-[var(--color-soft)]">0{index + 1}</span>
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-8 inline-block text-sm font-semibold uppercase tracking-wide text-[var(--color-link)] transition-colors hover:text-[var(--color-accent)]"
        >
          Resume ↗
        </a>
      </aside>
    </>,
    document.body,
  );
}
