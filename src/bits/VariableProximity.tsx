import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
  type CSSProperties,
  type HTMLAttributes
} from 'react';

import { subscribeProximity } from './proximityLoop';

interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  /** Unused since the shared pointer loop (distances are measured in viewport space). Kept so existing call sites compile. */
  containerRef?: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  /** Stops listening and rests every letter at `fromFontVariationSettings`. */
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    containerRef: _containerRef,
    radius = 50,
    falloff = 'linear',
    disabled = false,
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const rootRef = useRef<HTMLSpanElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(false);

  const setRefs = useCallback(
    (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)] as const;
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  useEffect(() => {
    const resetLetters = () => {
      activeRef.current = false;
      letterRefs.current.forEach(letter => {
        if (letter) letter.style.fontVariationSettings = fromFontVariationSettings;
      });
    };

    if (disabled) {
      resetLetters();
      return;
    }

    const calculateFalloff = (distance: number) => {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case 'exponential':
          return norm ** 2;
        case 'gaussian':
          return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case 'linear':
        default:
          return norm;
      }
    };

    const unsubscribe = subscribeProximity((pointerX, pointerY) => {
      const root = rootRef.current;
      if (!root) return;

      // Cheap cull: a pointer farther than `radius` from the whole label can't affect any letter,
      // so skip the per-letter getBoundingClientRect pass (the expensive part).
      const bounds = root.getBoundingClientRect();
      const outside =
        pointerX < bounds.left - radius ||
        pointerX > bounds.right + radius ||
        pointerY < bounds.top - radius ||
        pointerY > bounds.bottom + radius;

      if (outside) {
        if (activeRef.current) resetLetters();
        return;
      }

      activeRef.current = true;
      letterRefs.current.forEach(letter => {
        if (!letter) return;

        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(
          pointerX - (rect.left + rect.width / 2),
          pointerY - (rect.top + rect.height / 2)
        );

        if (distance >= radius) {
          letter.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }

        const falloffValue = calculateFalloff(distance);
        const newSettings = parsedSettings
          .map(({ axis, fromValue, toValue }) => {
            const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
            return `'${axis}' ${interpolatedValue}`;
          })
          .join(', ');

        letter.style.fontVariationSettings = newSettings;
      });
    });

    return () => {
      unsubscribe();
      resetLetters();
    };
  }, [disabled, falloff, fromFontVariationSettings, parsedSettings, radius]);

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={setRefs}
      onClick={onClick}
      style={{
        display: 'inline',
        fontFamily: '"Roboto Flex", sans-serif',
        ...style
      }}
      className={className}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map(letter => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={el => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: fromFontVariationSettings
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
