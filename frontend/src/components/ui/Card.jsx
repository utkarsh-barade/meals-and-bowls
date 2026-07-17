import { cn } from '@/utils/cn';

/**
 * Card — white bg, soft shadow, 12px radius, 24px padding (DESIGN.md §7).
 */
export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface-card rounded-card shadow-card p-6 border border-surface-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Convenience sub-components */
Card.Header = function CardHeader({ className, children }) {
  return (
    <div className={cn('mb-4 pb-4 border-b border-surface-border', className)}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ className, children }) {
  return (
    <h3 className={cn('text-card-title text-text-primary', className)}>
      {children}
    </h3>
  );
};

Card.Body = function CardBody({ className, children }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};
