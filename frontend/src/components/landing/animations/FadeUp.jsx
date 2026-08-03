import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/**
 * FadeUp — Scroll-triggered fade + slide-up reveal.
 *
 * Used for every "section" element that needs to enter on scroll.
 * Hero entrance animations use inline variants instead (they animate
 * on mount, not on scroll).
 *
 * @param {number}  delay     Seconds before animation starts.
 * @param {number}  duration  Animation duration in seconds.
 * @param {number}  distance  Pixels to travel upward (default 40).
 * @param {string}  className Extra Tailwind classes.
 * @param {boolean} once      Trigger animation only once (default true).
 */
export function FadeUp({
  children,
  delay    = 0,
  duration = 0.6,
  distance = 40,
  className = '',
  once = true,
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={{
        hidden:  { opacity: 0, y: prefersReducedMotion ? 0 : distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay,
            duration: prefersReducedMotion ? 0.01 : duration,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
