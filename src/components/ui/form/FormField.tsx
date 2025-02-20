'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  help?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  className,
  label,
  error,
  required,
  optional,
  help,
  htmlFor,
  children,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {optional && <span className="text-gray-400 ml-1.5 text-xs">(Optional)</span>}
        </label>
      )}
      {children}
      {help && !error && (
        <p className="text-xs text-gray-500">{help}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export { FormField, type FormFieldProps };
