'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cv.utils';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
  className?: string;
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  minRows = 3,
  className,
  id,
  ...rest
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  const resize = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={inputId}
        value={value}
        placeholder={placeholder}
        rows={minRows}
        onChange={(event) => {
          onChange(event.target.value);
          resize();
        }}
        className={cn(
          'w-full resize-none overflow-hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400 transition-colors',
          'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
        )}
        {...rest}
      />
    </div>
  );
}
