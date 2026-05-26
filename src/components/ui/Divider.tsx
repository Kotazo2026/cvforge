import { cn } from '@/utils/cv.utils';

export interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ className, orientation = 'horizontal' }: DividerProps) {
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 border-0 bg-slate-200',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
