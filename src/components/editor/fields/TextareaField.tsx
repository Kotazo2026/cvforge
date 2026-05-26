'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/utils/cv.utils';

export interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
  disabled?: boolean;
  /** Surlignage jaune quand une correction grammaticale est en attente. */
  grammarHighlight?: boolean;
  grammarTitle?: string;
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  minRows = 3,
  maxLength,
  showCharCount = false,
  className,
  disabled = false,
  grammarHighlight = false,
  grammarTitle,
}: TextareaFieldProps) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

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
    <div className={cn('relative w-full', className)}>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        disabled={disabled}
        rows={minRows}
        maxLength={maxLength}
        placeholder={floated ? placeholder : undefined}
        onChange={(event) => {
          onChange(event.target.value);
          resize();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        title={grammarTitle}
        className={cn(
          'w-full resize-none overflow-hidden rounded-lg border border-slate-200 bg-white px-3 pb-2 pt-5 text-sm text-slate-900',
          'transition-colors placeholder:text-slate-400',
          'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          grammarHighlight && 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-400/70',
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-3 origin-left transition-all duration-150',
          floated
            ? 'top-1.5 text-xs font-medium text-blue-600'
            : 'top-4 text-sm text-slate-400',
        )}
      >
        {label}
      </label>
      {showCharCount && maxLength !== undefined && (
        <p className="mt-1 text-right text-xs text-slate-400">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
