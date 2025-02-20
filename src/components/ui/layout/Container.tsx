'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'default' | 'small' | 'large';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({
  className,
  children,
  size = 'default',
  ...props
}, ref) => {
  const maxWidthClass = {
    small: 'max-w-[960px]',
    default: 'max-w-[1400px]',
    large: 'max-w-[1920px]',
  }[size];

  return (
    <div
      ref={ref}
      className={cn(
        "w-full mx-auto px-4 animate-fade-in",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export { Container, type ContainerProps };
