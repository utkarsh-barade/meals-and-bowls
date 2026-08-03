import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/**
 * FadeIn — Simple scroll-triggered opacity reveal.
 * Use for subheadings, body text, and images that don't need vertical motion.
 */
export function FadeIn({
  children,
  delay    = 0,
  duration = 0.6,
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
        hidden:  { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay,
            duration: prefersReducedMotion ? 0.01 : duration,
            ease: 'easeInOut',
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn — Scale + fade reveal for cards, badges, and buttons.
 */
export function ScaleIn({
  children,
  delay    = 0,
  duration = 0.5,
  from     = 0.92,
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
        hidden:  { opacity: 0, scale: prefersReducedMotion ? 1 : from },
        visible: {
          opacity: 1,
          scale: 1,
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

/**
 * FloatingElement — Continuous vertical float loop.
 * Respects prefers-reduced-motion (static when enabled).
 */
export function FloatingElement({
  children,
  amplitude = 16,   // px to float up/down
  duration  = 6,    // seconds per full loop
  className  = '',
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { y: [0, -amplitude, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
