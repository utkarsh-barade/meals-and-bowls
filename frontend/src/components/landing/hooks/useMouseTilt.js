import { useRef, useCallback } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * useMouseTilt
 *
 * Tracks mouse position relative to a container and produces spring-smoothed
 * rotateX / rotateY motion values for a subtle 3D tilt effect.
 *
 * Use on desktop only — callers should skip handlers on touch devices.
 *
 * @param {object} options
 * @param {number} options.maxTilt        Max degrees of tilt in any direction (default 10).
 * @param {object} options.springConfig   Framer Motion spring config.
 *
 * @returns {{ ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }}
 *
 * Usage:
 *   const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useMouseTilt();
 *   <motion.div ref={ref} style={{ rotateX, rotateY, transformPerspective: 800 }}
 *     onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
 */
export function useMouseTilt({
  maxTilt     = 10,
  springConfig = { stiffness: 200, damping: 28, mass: 0.8 },
} = {}) {
  const ref = useRef(null);

  // Raw normalised position: -1 (top-left) → +1 (bottom-right)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Map to rotation degrees
  const rotateYRaw = useTransform(rawX, [-1, 1], [-maxTilt, maxTilt]);
  const rotateXRaw = useTransform(rawY, [-1, 1], [ maxTilt, -maxTilt]);

  // Spring-smooth so motion feels physical, not snappy
  const rotateX = useSpring(rotateXRaw, springConfig);
  const rotateY = useSpring(rotateYRaw, springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const y = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
      rawX.set(x);
      rawY.set(y);
    },
    [rawX, rawY],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}
