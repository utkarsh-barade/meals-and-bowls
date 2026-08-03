/**
 * useReducedMotion
 *
 * Thin wrapper around Framer Motion's built-in useReducedMotion hook.
 * Returns `true` when the OS/browser "prefers-reduced-motion: reduce" media
 * query is active.  Use this everywhere animations are defined so we degrade
 * gracefully to simple fades / static states for accessibility.
 *
 * Usage:
 *   const prefersReducedMotion = useReducedMotion();
 *   const floatAnim = prefersReducedMotion ? {} : { y: [0, -16, 0] };
 */
export { useReducedMotion } from 'framer-motion';
