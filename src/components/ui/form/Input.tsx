'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type = 'text',
  error,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-egyptian-blue/20 focus:border-egyptian-blue",
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
          error && "border-red-300 focus:border-red-500 focus:ring-red-200",
          icon && iconPosition === 'left' && "pl-9",
          icon && iconPosition === 'right' && "pr-9",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
      {icon && (
        <div 
          className={cn(
            "absolute top-0 bottom-0 flex items-center justify-center",
            "text-gray-400 w-10",
            iconPosition === 'left' && "left-0",
            iconPosition === 'right' && "right-0",
            disabled && "text-gray-300"
          )}
        >
          {icon}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
