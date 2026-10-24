'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, fullWidth = false, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-deep focus:ring-primary',
      secondary: 'bg-gray-100 text-text-main hover:bg-gray-200 focus:ring-gray-400',
      outline: 'bg-transparent border border-border text-text-main hover:bg-light-blue-surface focus:ring-primary',
      ghost: 'bg-transparent text-text-main hover:bg-light-blue-surface focus:ring-primary',
      destructive: 'bg-error text-white hover:bg-red-600 focus:ring-error',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && children}
      </button>
    );
  }
);

Button.displayName = 'Button';