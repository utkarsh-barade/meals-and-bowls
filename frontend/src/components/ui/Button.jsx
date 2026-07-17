import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Button — variants per DESIGN.md §6.
 * Variants: primary | secondary | danger | ghost
 * Sizes: sm | md | lg
 */
const variantClasses = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover disabled:bg-surface-muted disabled:text-text-placeholder',
  secondary:
    'bg-white text-primary border border-primary hover:bg-primary-light active:bg-primary-light disabled:bg-surface-muted disabled:text-text-placeholder disabled:border-surface-border',
  danger:
    'bg-danger text-white hover:bg-red-700 active:bg-red-800 disabled:bg-surface-muted disabled:text-text-placeholder',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-muted active:bg-surface-muted disabled:text-text-placeholder',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-small',
  md: 'px-4 py-2.5 text-body min-h-btn',
  lg: 'px-6 py-3 text-body min-h-btn',
};

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-btn font-medium',
          'transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
