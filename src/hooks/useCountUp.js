import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to animate numeric values smoothly over a specified duration
 * Uses requestAnimationFrame with cubic ease-out easing and honors prefers-reduced-motion.
 *
 * @param {number} targetValue - The number to animate towards
 * @param {duration} duration - Duration in milliseconds (defaults to 600ms)
 * @returns {number} The current animated value
 */
export function useCountUp(targetValue, duration = 600) {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const previousValueRef = useRef(targetValue);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startValue = previousValueRef.current;
    const diff = targetValue - startValue;

    // If there is no change, don't trigger animation
    if (diff === 0) {
      return;
    }

    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      if (prefersReducedMotion || duration <= 0) {
        setCurrentValue(targetValue);
        previousValueRef.current = targetValue;
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const nextVal = startValue + diff * easedProgress;
      setCurrentValue(nextVal);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setCurrentValue(targetValue);
        previousValueRef.current = targetValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
}
