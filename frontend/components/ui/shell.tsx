'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ className, children, ...props }: ShellProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col space-y-4 p-4 pt-6 md:p-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
