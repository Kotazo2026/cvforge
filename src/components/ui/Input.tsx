import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cv.utils';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  className,
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400 transition-colors',
          'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500',
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
