'use client';

import { cn } from '@/utils/cv.utils';

interface LayoutToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function LayoutToggle({ label, checked, onChange }: LayoutToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-cvforge-border bg-cvforge-raised/40 px-3 py-2.5">
      <span className="text-xs text-cvforge-text">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue',
          checked ? 'bg-cvforge-accent-blue' : 'bg-cvforge-border',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  );
}
