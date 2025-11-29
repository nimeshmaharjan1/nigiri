'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon | React.ReactNode;
  suffix?: string;
  prefix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, suffix, prefix, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="relative w-full">
        {StartIcon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
            <StartIcon
              size={16}
              strokeWidth={1}
              className="text-muted-foreground"
            />
          </div>
        )}

        {prefix && (
          <span
            className={cn(
              `text-muted-foreground absolute left-3 top-1/2  -translate-y-1/2`
            )}
          >
            {prefix}
          </span>
        )}

        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-sm',
            startIcon || prefix ? 'pl-8' : '',
            endIcon || suffix ? 'pr-10' : '', // 👈 extra padding for suffix
            className
          )}
          {...props}
        />

        {suffix && (
          <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-xs">
            {suffix}
          </span>
        )}

        {EndIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {typeof EndIcon === 'function' ? (
              <EndIcon
                size={16}
                strokeWidth={1}
                className="text-muted-foreground"
              />
            ) : (
              EndIcon
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
