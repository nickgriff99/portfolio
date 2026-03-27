import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import type { LayoutMode } from "../types";

export interface CardSwapProps {
  layoutMode?: LayoutMode;
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  showControls?: boolean;
  showProgressDots?: boolean;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute left-1/2 top-1/2 overflow-hidden rounded-2xl [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform] ${customClass ?? ""} ${className ?? ""}`.trim()}
    >
      {/* Glass on inner node: GSAP transforms stay on outer; avoids backdrop + transform bugs */}
      <div className="header-surface flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl">
        {children}
      </div>
    </div>
  ),
);
Card.displayName = "Card";

type CardRef = React.RefObject<HTMLDivElement | null>;
type QueueAction = "next" | "prev";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: 0,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const rotateNext = <T,>(items: T[]) =>
  items.length > 0 ? [...items.slice(1), items[0]] : items;

const rotatePrev = <T,>(items: T[]) =>
  items.length > 0 ? [items[items.length - 1], ...items.slice(0, -1)] : items;

export const CardSwap: React.FC<CardSwapProps> = ({
  layoutMode = "multi",
  width = 560,
  height = 430,
  cardDistance = 62,
  verticalDistance = 66,
  delay = 5500,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 5,
  easing = "elastic",
  showControls = true,
  showProgressDots = true,
  children,
}) => {
  const config = useMemo(
    () =>
      easing === "elastic"
        ? {
            ease: "elastic.out(0.62,0.9)",
            durMove: 1.05,
          }
        : {
            ease: "power1.inOut",
            durMove: 0.55,
          },
    [easing],
  );

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children],
  );
  const cardCount = childArr.length;
  const refs = useMemo<CardRef[]>(
    () => Array.from({ length: cardCount }, () => React.createRef<HTMLDivElement>()),
    [cardCount],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const pendingOrderRef = useRef<number[] | null>(null);
  const actionQueueRef = useRef<QueueAction[]>([]);
  const nextActionRef = useRef<() => void>(() => undefined);
  const prevActionRef = useRef<() => void>(() => undefined);
  const goToActionRef = useRef<(index: number) => void>(() => undefined);

  useEffect(() => {
    order.current = Array.from({ length: cardCount }, (_, i) => i);
    pendingOrderRef.current = null;
    actionQueueRef.current = [];
  }, [cardCount]);

  useEffect(() => {
    const total = cardCount;
    if (!total) {
      return;
    }

    const clearAutoAdvance = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const applyAction = (items: number[], action: QueueAction) =>
      action === "next" ? rotateNext(items) : rotatePrev(items);

    const getProjectedOrder = () => {
      let projected = pendingOrderRef.current ? [...pendingOrderRef.current] : [...order.current];
      for (const action of actionQueueRef.current) {
        projected = applyAction(projected, action);
      }
      return projected;
    };

    const scheduleAutoAdvance = () => {
      clearAutoAdvance();
      if (
        total < 2 ||
        delay <= 0 ||
        isHoveringRef.current ||
        isAnimatingRef.current ||
        actionQueueRef.current.length > 0
      ) {
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        actionQueueRef.current.push("next");
        runNextAction();
      }, delay);
    };

    const animateToOrder = (nextOrder: number[]) => {
      setActiveIndex(nextOrder[0] ?? 0);
      isAnimatingRef.current = true;
      pendingOrderRef.current = [...nextOrder];
      clearAutoAdvance();
      tlRef.current?.kill();

      const timeline = gsap.timeline({
        onComplete: () => {
          order.current = [...nextOrder];
          pendingOrderRef.current = null;
          isAnimatingRef.current = false;
          setActiveIndex(nextOrder[0] ?? 0);

          if (actionQueueRef.current.length > 0) {
            runNextAction();
            return;
          }

          if (!isHoveringRef.current) {
            scheduleAutoAdvance();
          }
        },
      });

      tlRef.current = timeline;

      nextOrder.forEach((cardIndex, slotIndex) => {
        const node = refs[cardIndex]?.current;
        if (!node) {
          return;
        }

        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, total);
        timeline.set(node, { zIndex: slot.zIndex }, 0);
        timeline.to(
          node,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          slotIndex * 0.04,
        );
      });
    };

    const runNextAction = () => {
      if (isAnimatingRef.current) {
        return;
      }

      const nextAction = actionQueueRef.current.shift();
      if (!nextAction) {
        if (!isHoveringRef.current) {
          scheduleAutoAdvance();
        }
        return;
      }

      animateToOrder(applyAction([...order.current], nextAction));
    };

    const enqueueAction = (action: QueueAction, count = 1) => {
      if (total < 2) {
        return;
      }

      clearAutoAdvance();
      for (let i = 0; i < count; i += 1) {
        actionQueueRef.current.push(action);
      }

      if (!isAnimatingRef.current) {
        runNextAction();
      }
    };

    nextActionRef.current = () => enqueueAction("next");
    prevActionRef.current = () => enqueueAction("prev");
    goToActionRef.current = (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= total) {
        return;
      }

      clearAutoAdvance();

      const projected = getProjectedOrder();
      actionQueueRef.current = [];

      const currentPosition = projected.indexOf(targetIndex);
      if (currentPosition <= 0) {
        if (!isAnimatingRef.current && !isHoveringRef.current) {
          scheduleAutoAdvance();
        }
        return;
      }

      const forwardSteps = currentPosition;
      const backwardSteps = total - currentPosition;
      const direction: QueueAction = forwardSteps <= backwardSteps ? "next" : "prev";
      const steps = Math.min(forwardSteps, backwardSteps);

      for (let i = 0; i < steps; i += 1) {
        actionQueueRef.current.push(direction);
      }

      if (!isAnimatingRef.current) {
        runNextAction();
      }
    };

    clearAutoAdvance();
    tlRef.current?.kill();

    const positionedOrder =
      order.current.length === total
        ? [...order.current]
        : Array.from({ length: total }, (_, i) => i);

    if (order.current.length !== total) {
      order.current = positionedOrder;
    }

    positionedOrder.forEach((cardIndex, slotIndex) => {
      const node = refs[cardIndex]?.current;
      if (!node) {
        return;
      }
      placeNow(node, makeSlot(slotIndex, cardDistance, verticalDistance, total), skewAmount);
    });

    scheduleAutoAdvance();

    const node = containerRef.current;
    if (pauseOnHover && node) {
      const onMouseEnter = () => {
        isHoveringRef.current = true;
        clearAutoAdvance();
      };

      const onMouseLeave = () => {
        isHoveringRef.current = false;
        if (!isAnimatingRef.current && actionQueueRef.current.length === 0) {
          scheduleAutoAdvance();
        }
      };

      node.addEventListener("mouseenter", onMouseEnter);
      node.addEventListener("mouseleave", onMouseLeave);

      return () => {
        node.removeEventListener("mouseenter", onMouseEnter);
        node.removeEventListener("mouseleave", onMouseLeave);
        clearAutoAdvance();
        tlRef.current?.kill();
      };
    }

    return () => {
      clearAutoAdvance();
      tlRef.current?.kill();
    };
  }, [cardCount, cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, refs, config]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  const currentActiveIndex = activeIndex < cardCount ? activeIndex : 0;

  const wrapperClassName =
    layoutMode === "single"
      ? "mx-auto flex w-full flex-col items-center gap-5"
      : "mx-auto flex w-full max-w-[980px] flex-col items-center gap-5";
  const containerClassName =
    layoutMode === "single"
      ? "relative mx-auto w-full overflow-visible [perspective:1200px]"
      : "relative mx-auto w-full max-w-[760px] overflow-visible [perspective:1200px]";

  return (
    <div className={wrapperClassName}>
      <div className="relative flex w-full items-center justify-center">
        {showControls && cardCount > 1 ? (
          <button
            type="button"
            onClick={() => prevActionRef.current()}
            className="absolute left-0 hidden rounded-lg border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:brightness-110 md:block"
          >
            Previous
          </button>
        ) : null}

        <div
          ref={containerRef}
          className={containerClassName}
          style={{ width, height }}
        >
          {rendered}
        </div>

        {showControls && cardCount > 1 ? (
          <button
            type="button"
            onClick={() => nextActionRef.current()}
            className="absolute right-0 hidden rounded-lg border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:brightness-110 md:block"
          >
            Next
          </button>
        ) : null}
      </div>

      {showProgressDots && cardCount > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-3" aria-label="Card progress">
          {Array.from({ length: cardCount }, (_, i) => {
            const isActive = i === currentActiveIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goToActionRef.current(i)}
                className={`h-3 w-3 rounded-full border transition-all duration-150 ${
                  isActive
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                    : "border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-border)_12%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-border)_26%,transparent)]"
                }`}
                aria-label={`Go to card ${i + 1}`}
              />
            );
          })}
        </div>
      ) : null}

      {showControls && cardCount > 1 ? (
        <div className="flex gap-3 md:hidden">
          <button
            type="button"
            onClick={() => prevActionRef.current()}
            className="rounded-md border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:brightness-110"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => nextActionRef.current()}
            className="rounded-md border border-[color-mix(in_srgb,var(--color-border)_42%,transparent)] bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:brightness-110"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CardSwap;
