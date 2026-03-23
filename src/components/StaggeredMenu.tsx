import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { NavItem } from "../types";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type StaggeredMenuProps = {
  open: boolean;
  items: NavItem[];
  activeSection: string;
  onNavigate: (href: string) => void;
  onClose: () => void;
};

export function StaggeredMenu({
  open,
  items,
  activeSection,
  onNavigate,
  onClose,
}: StaggeredMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const links = panel.querySelectorAll(".sm-item");

    if (open) {
      gsap.fromTo(
        panel,
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      );

      gsap.fromTo(
        links,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.36, ease: "power2.out", delay: 0.1 },
      );
      return;
    }

    gsap.to(panel, {
      xPercent: 100,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
    });
  }, [open, prefersReducedMotion]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#1B264F]/45 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className={`fixed right-0 top-0 z-50 h-screen w-[86vw] max-w-sm border-l border-white/20 bg-[var(--color-surface)] p-8 transition-transform duration-300 md:hidden ${
          open
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
      >
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-[var(--color-soft)]">Menu</p>
        <ul className="space-y-4">
          {items.map((item, index) => {
            const sectionId = item.href.replace("#", "");
            const isActive = sectionId === activeSection;
            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavigate(item.href)}
                  className={`sm-item w-full text-left text-3xl font-semibold tracking-tight transition-colors ${
                    isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text)] hover:text-[var(--color-accent)]"
                  }`}
                >
                  <span className="mr-3 text-base align-middle text-[var(--color-soft)]">0{index + 1}</span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
