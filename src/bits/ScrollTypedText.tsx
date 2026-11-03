/**
 * ScrollTypedText — React Bits-style scrub-scroll typing animation.
 *
 * Char count derived from scroll progress (never timers): fast scroll → instant jump,
 * scroll back → un-types, initial mid-page load → correct state on first paint.
 *
 * One GSAP ScrollTrigger per block. Direct innerHTML writes; no React state per tick.
 * Layout reserved from first paint: invisible full-text div holds block height;
 * typed overlay sits position:absolute over it.
 *
 * React 19 / StrictMode safe: unmountedRef reset in every effect body.
 */
import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Public types ─────────────────────────────────────────────────────────────

export interface TypedToken {
  text: string;
  /** CSS color value. Absent = inherit (plain output colour). */
  color?: string;
}

export interface TypedLine {
  tokens: TypedToken[];
}

export interface TypedBlock {
  id: string;
  lines: TypedLine[];
  /** ScrollTrigger start override. Default: "top 100%" */
  start?: string;
  /**
   * ScrollTrigger end override. Default: "bottom 75%" — block is fully typed once its
   * bottom edge enters the lower quarter of the viewport, so readers never have to
   * chase text that's still being typed near the top of the screen.
   */
  end?: string;
}

interface Props {
  blocks: TypedBlock[];
  /** When true: show all text immediately, no triggers, no cursor. */
  reducedMotion: boolean;
  className?: string;
  /**
   * When true: skip ScrollTrigger entirely and type each block in on mount via a
   * timed GSAP tween (sequential, small stagger between blocks). For toggle-triggered
   * reveals where there's no scroll motion to drive progress off of.
   */
  playOnMount?: boolean;
  /** Fires once the full mount-tween sequence finishes (or immediately under reducedMotion). */
  onPlayComplete?: () => void;
}

// ─── Flat-token helpers ───────────────────────────────────────────────────────

interface FlatToken {
  text: string;
  color?: string;
  cumStart: number; // visual char index of first char in this token
}

interface FlatBlock {
  tokens: FlatToken[];
  total: number; // total visible char count
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function flattenBlock(lines: TypedLine[]): FlatBlock {
  const tokens: FlatToken[] = [];
  let pos = 0;
  for (let li = 0; li < lines.length; li++) {
    for (const t of lines[li].tokens) {
      tokens.push({ text: t.text, color: t.color, cumStart: pos });
      pos += t.text.length;
    }
    // Newline between lines (not after the last line)
    if (li < lines.length - 1) {
      tokens.push({ text: '\n', cumStart: pos });
      pos += 1;
    }
  }
  return { tokens, total: pos };
}

/** Tokens → colored HTML for chars 0..charCount. */
function buildTypedHTML(tokens: FlatToken[], charCount: number): string {
  let html = '';
  for (const t of tokens) {
    if (t.cumStart >= charCount) break;
    const visLen = Math.min(charCount - t.cumStart, t.text.length);
    const slice = escHtml(t.text.slice(0, visLen));
    html += t.color ? `<span style="color:${t.color}">${slice}</span>` : slice;
  }
  return html;
}

/** Tokens → full colored HTML (reduced-motion / static fallback). */
function buildFullHTML(tokens: FlatToken[]): string {
  let html = '';
  for (const t of tokens) {
    const escaped = escHtml(t.text);
    html += t.color ? `<span style="color:${t.color}">${escaped}</span>` : escaped;
  }
  return html;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScrollTypedText({
  blocks,
  reducedMotion,
  className = '',
  playOnMount = false,
  onPlayComplete,
}: Props) {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typedRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const unmountedRef = useRef(false);
  // Latest-ref: callers rarely memoize an onPlayComplete passed inline, and including
  // the prop directly in the effect's deps would re-run (and restart the type-in tween)
  // on every unrelated parent re-render. Kept current via a layout effect (runs before
  // the main effect below, in declaration order) rather than during render.
  const onPlayCompleteRef = useRef(onPlayComplete);
  useLayoutEffect(() => {
    onPlayCompleteRef.current = onPlayComplete;
  }, [onPlayComplete]);

  // Flat tokens computed once — blocks is assembled from static module-level data
  // in TerminalSession so reference is stable across renders.
  const flatBlocks = useMemo<FlatBlock[]>(
    () => blocks.map((b) => flattenBlock(b.lines)),
    [blocks],
  );

  // useLayoutEffect so spans are filled before the browser's first paint, eliminating
  // the one-frame blank that useEffect would cause on mid-page load / hash navigation.
  useLayoutEffect(() => {
    unmountedRef.current = false; // Reset on every (re-)mount — critical under StrictMode

    if (reducedMotion) {
      blocks.forEach((_, i) => {
        const typedEl = typedRefs.current[i];
        const cursorEl = cursorRefs.current[i];
        if (typedEl) typedEl.innerHTML = buildFullHTML(flatBlocks[i].tokens);
        if (cursorEl) cursorEl.style.display = 'none';
      });
      onPlayCompleteRef.current?.();
      return;
    }

    if (playOnMount) {
      const tl = gsap.timeline({
        onComplete() {
          if (!unmountedRef.current) onPlayCompleteRef.current?.();
        },
      });

      blocks.forEach((block, i) => {
        const typedEl = typedRefs.current[i];
        const cursorEl = cursorRefs.current[i];
        if (!typedEl) return;

        const { tokens, total } = flatBlocks[i];
        const applyChars = (charCount: number) => {
          if (unmountedRef.current) return;
          const clamped = Math.max(0, Math.min(total, charCount));
          typedEl.innerHTML = buildTypedHTML(tokens, clamped);
          if (cursorEl) {
            cursorEl.style.display = clamped > 0 && clamped < total ? 'inline' : 'none';
          }
        };

        // Fast but legible: proportional to char count, capped so long blocks don't drag.
        const duration = Math.min(total * 0.012, 2.5);
        const counter = { n: 0 };
        tl.to(
          counter,
          {
            n: total,
            duration,
            ease: 'none',
            onUpdate() {
              applyChars(Math.round(counter.n));
            },
          },
          i === 0 ? 0 : '+=0.1',
        );
      });

      return () => {
        unmountedRef.current = true;
        tl.kill();
      };
    }

    const triggers: ScrollTrigger[] = [];

    blocks.forEach((block, i) => {
      const blockEl = blockRefs.current[i];
      const typedEl = typedRefs.current[i];
      const cursorEl = cursorRefs.current[i];
      if (!blockEl || !typedEl) return;

      const { tokens, total } = flatBlocks[i];

      const applyChars = (charCount: number) => {
        if (unmountedRef.current) return;
        const clamped = Math.max(0, Math.min(total, charCount));
        typedEl.innerHTML = buildTypedHTML(tokens, clamped);
        if (cursorEl) {
          // Show cursor only while partially typed
          cursorEl.style.display = clamped > 0 && clamped < total ? 'inline' : 'none';
        }
      };

      const st = ScrollTrigger.create({
        trigger: blockEl,
        start: block.start ?? 'top 100%',
        end: block.end ?? 'bottom 75%',
        scrub: true,
        onUpdate(self) {
          applyChars(Math.round(self.progress * total));
        },
        // Guarantee fully typed when scrolled past (covers scrub rounding edge cases)
        onLeave() {
          applyChars(total);
        },
      });

      // ScrollTrigger.create fires onUpdate with current progress immediately,
      // so mid-page loads (hash nav, scroll-restore) get the right state on first paint.
      applyChars(Math.round(st.progress * total));

      triggers.push(st);
    });

    return () => {
      unmountedRef.current = true;
      triggers.forEach((t) => t.kill());
    };
  }, [blocks, flatBlocks, reducedMotion, playOnMount]);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const fullHTML = buildFullHTML(flatBlocks[i].tokens);
        return (
          <div
            key={block.id}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            className="relative"
          >
            {/* Invisible full-text reference — reserves the block's final layout height
                so no layout shift occurs as typing progresses. Same font/wrap settings
                as the overlay so line wrapping is identical. */}
            <div
              aria-hidden="true"
              className="whitespace-pre-wrap break-words font-mono opacity-0 pointer-events-none select-none"
              dangerouslySetInnerHTML={{ __html: fullHTML }}
            />

            {/* Typed overlay — absolute, same bounds as reference.
                overflow:hidden clips cursor at block boundary (safe: cursor never
                appears beyond the last line). */}
            <div
              aria-hidden="true"
              className="absolute inset-0 whitespace-pre-wrap break-words font-mono overflow-hidden"
            >
              <span
                ref={(el) => {
                  typedRefs.current[i] = el;
                }}
              />
              {/* Block cursor. Hidden when block is at 0% or 100% progress.
                  CSS blink animation defined in global.css (.terminal-cursor). */}
              <span
                ref={(el) => {
                  cursorRefs.current[i] = el;
                }}
                className="terminal-cursor"
                style={{ display: 'none' }}
              >
                █
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
