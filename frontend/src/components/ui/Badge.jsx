import { cn } from '@/utils/cn';

/**
 * Badge — status indicator (DESIGN.md §11).
 * Variants: green | yellow | red | blue | gray
 */
const variantMap = {
  green:  'bg-success/10 text-success',
  yellow: 'bg-secondary-light text-secondary',
  red:    'bg-danger/10 text-danger',
  blue:   'bg-info/10 text-info',
  gray:   'bg-surface-muted text-text-secondary',
};

export default function Badge({ variant = 'gray', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium',
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
