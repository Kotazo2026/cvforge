import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cv.utils';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary:
    'bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus-visible:ring-blue-500 disabled:bg-blue-300',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-blue-500 disabled:bg-slate-100',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-blue-500 disabled:text-slate-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
};

const sizeClasses: Record<ButtonProps['size'], string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2.5 px-5 text-base',
};

export function Button({
  variant,
  size,
  icon,
  loading = false,
  disabled = false,
  onClick,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-70',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
