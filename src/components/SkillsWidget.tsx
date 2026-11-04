import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { SplitText as SplitTextType } from "gsap/SplitText";

import VariableProximity from "@/bits/VariableProximity";
import { useHoverCapablePointer } from "@/hooks/useHoverCapablePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { skillsData } from "../data/skills";
import type { SkillCategoryKey } from "../types";

/**
 * SkillsWidget (Step 5) � blobby tab swap with proximity-reactive chips.
 *
 * Swap sequence (motion allowed):
 *   1. outgoing chips squash/shrink away (GSAP)
 *   2. incoming chips pop in with an out-of-phase elastic scaleX / scaleY (squash & stretch) while
 *      GSAP SplitText staggers each label's letters up
 *   3. SplitText is reverted and <VariableProximity> takes over the label (hover-capable pointers only)
 *
 * SplitText and VariableProximity both split text into per-letter spans, so they never own the same
 * label at once: SplitText runs during the intro, VariableProximity mounts after it. SplitText is
 * dynamically imported on the first swap so it stays out of the main bundle.
 *
 * Reduced motion: tabs swap instantly, no GSAP, no proximity effect.
 */

const PROXIMITY_FROM = "'wght' 600";
const PROXIMITY_TO = "'wght' 900";

const CATEGORY_KEYS = Object.keys(skillsData) as SkillCategoryKey[];

export function SkillsWidget() {
  const reducedMotion = usePrefersReducedMotion();
  const hoverCapable = useHoverCapablePointer();

  /** Tab that looks selected (updates on click). */
  const [selectedCategory, setSelectedCategory] = useState<SkillCategoryKey>("languages");
  /** Category whose chips are on screen (lags selectedCategory by the outro). */
  const [displayedCategory, setDisplayedCategory] = useState<SkillCategoryKey>("languages");
  /** False while a swap intro owns the labels; VariableProximity only mounts once it's true. */
  const [introDone, setIntroDone] = useState(true);

  const chipRefs = useRef<(HTMLLIElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // One ref per tab button so arrow-key navigation can focus the target tab.
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const targetRef = useRef<SkillCategoryKey>("languages");
  const displayedRef = useRef<SkillCategoryKey>("languages");
  const introPendingRef = useRef(false);
  const outroRef = useRef<gsap.core.Tween | null>(null);
  const introCleanupRef = useRef<(() => void) | null>(null);
  const splitTextRef = useRef<typeof SplitTextType | null>(null);
  const splitTextLoadRef = useRef<Promise<void> | null>(null);
  // Unmount guard so the SplitText promise callback never calls setState after unmount.
  const unmountedRef = useRef(false);

  const getChips = () => chipRefs.current.filter((chip): chip is HTMLLIElement => chip !== null);

  const loadSplitText = useCallback(() => {
    splitTextLoadRef.current ??= import("gsap/SplitText").then(({ SplitText }) => {
      gsap.registerPlugin(SplitText);
      splitTextRef.current = SplitText;
    });
    return splitTextLoadRef.current;
  }, []);

  const handleCategorySelect = (category: SkillCategoryKey) => {
    if (category === targetRef.current) return;

    setSelectedCategory(category);
    targetRef.current = category;

    if (reducedMotion) {
      displayedRef.current = category;
      setDisplayedCategory(category);
      return;
    }

    // Abandon whatever is in flight (a swap clicked mid-intro or mid-outro).
    outroRef.current?.kill();
    introCleanupRef.current?.();

    const chips = getChips();

    // Clicked back to what's already on screen: bring the chips home instead of swapping.
    if (category === displayedRef.current) {
      gsap.to(chips, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.3,
        ease: "back.out(2)",
        overwrite: true,
        clearProps: "transform,opacity",
      });
      setIntroDone(true);
      return;
    }

    const splitTextReady = loadSplitText();

    outroRef.current = gsap.to(chips, {
      scaleX: 0.35,
      scaleY: 0.8,
      opacity: 0,
      rotation: () => gsap.utils.random(-14, 14),
      duration: 0.26,
      ease: "back.in(2)",
      stagger: { each: 0.025, from: "end" },
      overwrite: true,
      onComplete: () => {
        void splitTextReady.then(() => {
          // Bail if unmounted, or if a newer click already made this swap stale.
          if (unmountedRef.current) return;
          if (targetRef.current === displayedRef.current) return;
          displayedRef.current = targetRef.current;
          introPendingRef.current = true;
          setIntroDone(false);
          setDisplayedCategory(targetRef.current);
        });
      },
    });
  };

  // Intro for the freshly rendered chips. Layout effect: chips are hidden before the browser paints
  // them, so there is no flash of the finished chips ahead of their entrance.
  useLayoutEffect(() => {
    if (!introPendingRef.current) return;
    introPendingRef.current = false;

    const SplitText = splitTextRef.current;
    const chips = getChips();
    if (!SplitText || chips.length === 0) {
      setIntroDone(true);
      return;
    }

    const splits = labelRefs.current
      .filter((label): label is HTMLSpanElement => label !== null)
      .map((label) => new SplitText(label, { type: "chars" }));

    gsap.set(chips, { scaleX: 0, scaleY: 0, opacity: 0, rotation: () => gsap.utils.random(-12, 12) });

    // Lets cleanup tell a finished intro from an abandoned one (mid-intro click, category change).
    let completedNaturally = false;

    const timeline = gsap.timeline({
      onComplete: () => {
        completedNaturally = true;
        cleanup();
        setIntroDone(true);
      },
    });

    chips.forEach((chip, index) => {
      const start = index * 0.05;
      // Out-of-phase elastics on X and Y: the blob overshoots wide-and-flat, then tall-and-narrow.
      timeline.to(chip, { scaleX: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" }, start);
      timeline.to(chip, { scaleY: 1, duration: 0.8, ease: "elastic.out(1, 0.55)" }, start + 0.04);
      timeline.to(chip, { opacity: 1, rotation: 0, duration: 0.3, ease: "power2.out" }, start);
    });
    splits.forEach((split, index) => {
      timeline.from(
        split.chars,
        {
          yPercent: 90,
          opacity: 0,
          duration: 0.35,
          ease: "back.out(2.2)",
          stagger: 0.018,
        },
        index * 0.05 + 0.12,
      );
    });

    let cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      timeline.kill();
      splits.forEach((split) => split.revert());
      gsap.set(chips, { clearProps: "transform,opacity" });
      introCleanupRef.current = null;
      // An abandoned intro must not leave introDone stuck at false (VariableProximity would
      // never mount).
      if (!completedNaturally && !unmountedRef.current) {
        setIntroDone(true);
      }
    }
    introCleanupRef.current = cleanup;

    return cleanup;
  }, [displayedCategory]);

  useEffect(() => {
    // Reset on every mount: StrictMode runs mount -> cleanup -> mount in dev, and without this the
    // flag set by the first cleanup would stay true and block every tab swap.
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      outroRef.current?.kill();
    };
  }, []);

  const squashTab = (element: HTMLElement) => {
    if (reducedMotion) return;
    gsap.fromTo(
      element,
      { scaleX: 1.16, scaleY: 0.84 },
      { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.35)", overwrite: true },
    );
  };

  const proximityEnabled = hoverCapable && !reducedMotion && introDone;
  const skills = skillsData[displayedCategory];

  return (
    <div className="skills-widget h-auto w-full">
      {/* ARIA tabs pattern: role=tablist, role=tab buttons, roving tabindex */}
      <div
        role="tablist"
        aria-label="Skill categories"
        className="mb-8 flex flex-wrap justify-center gap-3 border-b border-[color-mix(in_srgb,var(--color-border)_35%,transparent)] pb-4 lg:justify-start"
      >
        {CATEGORY_KEYS.map((category, index) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              ref={(el) => {
                tabButtonRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${category}`}
              aria-selected={isSelected}
              aria-controls="skills-panel"
              tabIndex={isSelected ? 0 : -1}
              onClick={(event) => {
                handleCategorySelect(category);
                squashTab(event.currentTarget);
              }}
              onPointerEnter={(event) => {
                if (hoverCapable && !isSelected) squashTab(event.currentTarget);
              }}
              onKeyDown={(event) => {
                // Arrow/Home/End move focus and select (automatic activation).
                const idx = CATEGORY_KEYS.indexOf(category);
                const len = CATEGORY_KEYS.length;
                const nav: Partial<Record<string, number>> = {
                  ArrowRight: (idx + 1) % len,
                  ArrowLeft: (idx - 1 + len) % len,
                  Home: 0,
                  End: len - 1,
                };
                const nextIdx = nav[event.key];
                if (nextIdx === undefined) return;
                event.preventDefault();
                const nextCategory = CATEGORY_KEYS[nextIdx];
                if (nextCategory === undefined) return;
                handleCategorySelect(nextCategory);
                tabButtonRefs.current[nextIdx]?.focus();
              }}
              className={`focus-ring cursor-pointer rounded-[8px] border-2 px-5 py-2.5 font-semibold capitalize transition-[background-color,color,border-color] duration-500 ${
                isSelected
                  ? "border-transparent bg-[var(--color-link)] text-[#0a0a0a]"
                  : "border-[color-mix(in_srgb,var(--color-border)_40%,transparent)] bg-transparent text-[var(--color-muted)] hover:border-[var(--color-link)] hover:text-[var(--color-link)]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* role=tabpanel is not valid on <ul>, so the panel wraps it. */}
      <div role="tabpanel" id="skills-panel" aria-labelledby={`tab-${selectedCategory}`}>
        <ul className="flex min-h-[15rem] min-w-0 max-w-full list-none flex-wrap content-start items-center justify-center gap-x-6 gap-y-4 p-0 pt-2 lg:justify-start">
          {skills.map((skill, index) => (
            <li
              key={`${displayedCategory}-${skill.name}`}
              ref={(element) => {
                chipRefs.current[index] = element;
              }}
              // inline-grid: real label and ghost share grid-area 1/1, so chip width
              // is always the ghost's (max weight) width and never shifts on hover.
              // No will-change: GSAP promotes layers only while tweening.
              className="inline-grid cursor-default text-base font-bold tracking-wide"
              style={{
                color: skill.color,
                fontVariationSettings: PROXIMITY_FROM,
              }}
            >
              {/* Real content � grid-area 1/1, stacks with ghost below */}
              <span style={{ gridArea: "1/1" }}>
                {introDone && proximityEnabled ? (
                  <VariableProximity
                    label={skill.name}
                    fromFontVariationSettings={PROXIMITY_FROM}
                    toFontVariationSettings={PROXIMITY_TO}
                    radius={70}
                    falloff="gaussian"
                    className="inline"
                  />
                ) : (
                  <span
                    ref={(element) => {
                      labelRefs.current[index] = element;
                    }}
                    className="inline-block whitespace-nowrap"
                  >
                    {skill.name}
                  </span>
                )}
              </span>
              {/*
               * Ghost: invisible, always at PROXIMITY_TO (max weight), aria-hidden.
               * Shares grid-area 1/1 with the real content so the chip is always as wide
               * as its widest state. SplitText only ever targets labelRefs, not this span.
               */}
              <span
                aria-hidden="true"
                className="invisible inline-block whitespace-nowrap"
                style={{ gridArea: "1/1", fontVariationSettings: PROXIMITY_TO }}
              >
                {skill.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
