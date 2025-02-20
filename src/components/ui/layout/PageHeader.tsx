'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(({
  className,
  title,
  description,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-4 mb-4",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

export { PageHeader, type PageHeaderProps };
