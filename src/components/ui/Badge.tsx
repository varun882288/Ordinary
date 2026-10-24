'use client';

import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const variants = {
  default: 'bg-primary-light text-primary border-primary/20',
  success: 'bg-success-light text-success border-success/20',
  warning: 'bg-warning-light text-warning border-warning/20',
  error: 'bg-error-light text-error border-error/20',
  info: 'bg-info-light text-info border-info/20',
  neutral: 'bg-gray-100 text-text-secondary border-gray-200',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'default' && 'bg-primary',
          variant === 'success' && 'bg-success',
          variant === 'warning' && 'bg-warning',
          variant === 'error' && 'bg-error',
          variant === 'info' && 'bg-info',
          variant === 'neutral' && 'bg-gray-400',
        )} />
      )}
      {children}
    </span>
  );
}