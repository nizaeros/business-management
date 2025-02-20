'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className,
  label,
  error,
  ...props
}, ref) => {
  return (
    <div className="flex items-start gap-2">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "w-4 h-4 border border-gray-300 rounded bg-white text-egyptian-blue focus:ring-egyptian-blue/20",
            error && "border-red-300",
            className
          )}
          {...props}
        />
      </div>
      {label && (
        <label className={cn(
          "text-sm text-gray-700",
          error && "text-red-500"
        )}>
          {label}
        </label>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox, type CheckboxProps };
