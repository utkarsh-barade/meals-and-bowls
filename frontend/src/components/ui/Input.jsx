import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Input — 44px height, rounded, label, visible error (DESIGN.md §8).
 */
const Input = forwardRef(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-small font-medium text-text-primary"
          >
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full min-h-btn px-3.5 rounded-btn border text-body text-text-primary',
            'placeholder:text-text-placeholder',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            error
              ? 'border-danger bg-danger/5 focus-visible:ring-danger'
              : 'border-surface-border bg-white hover:border-primary/50',
            'disabled:bg-surface-muted disabled:cursor-not-allowed disabled:text-text-placeholder',
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-caption text-danger flex items-center gap-1">
            <span aria-hidden>⚠</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-caption text-text-secondary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
