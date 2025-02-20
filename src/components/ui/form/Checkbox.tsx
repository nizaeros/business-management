'use client';

import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className,
  error,
  disabled,
  label,
  id,
  ...props
}, ref) => {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-gray-200",
            "text-egyptian-blue",
            "focus:ring-2 focus:ring-egyptian-blue/20 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
            error && "border-red-300",
            className
          )}
          disabled={disabled}
          {...props}
        />
      </div>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "ml-2 block text-sm text-gray-700",
            disabled && "text-gray-500 cursor-not-allowed",
            error && "text-red-500"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
