'use client';

import { useId, useState } from 'react';
import { cn } from '@/utils/cv.utils';

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'url' | 'email' | 'tel';
  disabled?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  className,
  type = 'text',
  disabled = false,
}: TextFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className={cn('relative w-full', className)}>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={floated ? placeholder : undefined}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'peer w-full rounded-lg border border-slate-200 bg-white px-3 pb-2 pt-5 text-sm text-slate-900',
          'transition-colors placeholder:text-slate-400',
          'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-3 origin-left transition-all duration-150',
          floated
            ? 'top-1.5 text-xs font-medium text-blue-600'
            : 'top-1/2 -translate-y-1/2 text-sm text-slate-400',
        )}
      >
        {label}
      </label>
    </div>
  );
}
