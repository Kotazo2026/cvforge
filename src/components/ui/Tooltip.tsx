'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cv.utils';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2',
          'whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg',
          'opacity-0 transition-opacity duration-150',
          'group-hover:opacity-100 group-focus-within:opacity-100',
        )}
      >
        {content}
        <span
          className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900"
          aria-hidden
        />
      </span>
    </span>
  );
}
