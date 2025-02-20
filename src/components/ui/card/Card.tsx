'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
  interactive?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  as: Component = 'div',
  className,
  interactive = false,
  children,
  ...props
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200",
        interactive && "hover:bg-gray-50/50 hover:shadow-md hover:border-egyptian-blue/30 hover:scale-[1.01] cursor-pointer",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export { Card, type CardProps };
