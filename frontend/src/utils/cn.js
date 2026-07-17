import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility: merge Tailwind class names without conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
