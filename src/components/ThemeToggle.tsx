import { useTheme } from "../context/ThemeContext";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/** Inactive side: smaller, softer */
const inactiveIcon = "h-[18px] w-[18px] text-[var(--color-muted)] opacity-55";
/** Active thumb icon: larger, full emphasis */
const activeIcon = "h-5 w-5 text-[var(--color-accent)]";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  /** Outer track + focus ring: warm accent when light is on, cool link when dark is on */
  const modeChrome = isDark
    ? "border-[color-mix(in_srgb,var(--color-link)_58%,transparent)] focus-visible:ring-[color-mix(in_srgb,var(--color-link)_72%,transparent)]"
    : "border-[color-mix(in_srgb,var(--color-accent)_52%,transparent)] focus-visible:ring-[color-mix(in_srgb,var(--color-accent)_68%,transparent)]";

  /** Sliding thumb ring follows the same mode */
  const thumbRing = isDark
    ? "ring-[color-mix(in_srgb,var(--color-link)_38%,transparent)]"
    : "ring-[color-mix(in_srgb,var(--color-accent)_42%,transparent)]";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={`relative h-12 w-[90px] shrink-0 rounded-full border bg-white/10 text-[var(--color-text)] backdrop-blur transition-[background-color,border-color,box-shadow] hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color-mix(in_srgb,var(--color-bg)_72%,transparent)] ${modeChrome}`}
    >
      {/* Inactive icon on the side opposite the thumb */}
      {isDark ? (
        <span
          className="pointer-events-none absolute inset-y-0 left-3 z-[1] flex items-center justify-center leading-none"
          aria-hidden
        >
          <SunIcon className={inactiveIcon} />
        </span>
      ) : (
        <span
          className="pointer-events-none absolute inset-y-0 right-3 z-[1] flex items-center justify-center leading-none"
          aria-hidden
        >
          <MoonIcon className={inactiveIcon} />
        </span>
      )}

      <span
        className={`pointer-events-none absolute left-1 top-1/2 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-md ring-1 transition-[transform,box-shadow] duration-200 ease-out ${thumbRing} ${
          isDark ? "translate-x-[42px]" : "translate-x-0"
        }`}
        aria-hidden
      >
        {isDark ? <MoonIcon className={activeIcon} /> : <SunIcon className={activeIcon} />}
      </span>
    </button>
  );
}
