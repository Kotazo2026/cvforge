'use client';

import { useEffect } from 'react';
import { cn } from '@/utils/cv.utils';

export interface ToastProps {
  message: string;
  variant?: 'success' | 'error';
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, variant = 'success', onDismiss, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 right-6 z-[100] max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        variant === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white',
      )}
    >
      {message}
    </div>
  );
}
