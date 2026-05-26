import { X } from 'lucide-react';
import { cn } from '@/utils/cv.utils';

export interface BadgeProps {
  label: string;
  onRemove?: () => void;
  color?: string;
  className?: string;
}

export function Badge({ label, onRemove, color, className }: BadgeProps) {
  const style = color ? { backgroundColor: color, borderColor: color } : undefined;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        color ? 'border-transparent text-white' : 'border-slate-200 bg-slate-100 text-slate-700',
        className,
      )}
      style={style}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'rounded-full p-0.5 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            color ? 'hover:bg-white/20' : 'hover:bg-slate-200',
          )}
          aria-label={`Retirer ${label}`}
        >
          <X className="h-3 w-3" aria-hidden />
        </button>
      )}
    </span>
  );
}
