'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(({
  className,
  title,
  description,
  children,
  ...props
}, ref) => {
  return (
    <section
      ref={ref}
      className={cn("space-y-4", className)}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-base font-semibold text-gray-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </section>
  );
});

Section.displayName = 'Section';

export { Section, type SectionProps };
