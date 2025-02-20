'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  error?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  options,
  error,
  placeholder,
  disabled,
  value,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        className={cn(
          "w-full rounded-md border border-gray-200 bg-white pl-3 pr-8 py-2 text-sm appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-egyptian-blue/20 focus:border-egyptian-blue",
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
          error && "border-red-300 focus:border-red-500 focus:ring-red-200",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map(({ value, label, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
