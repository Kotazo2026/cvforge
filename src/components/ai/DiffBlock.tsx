import { cn } from '@/utils/cv.utils';

interface DiffBlockProps {
  label: string;
  before: string;
  after: string;
}

export function DiffBlock({ label, before, after }: DiffBlockProps) {
  const changed = before.trim() !== after.trim();
  if (!changed) return null;

  return (
    <div className="rounded-lg border border-cvforge-border bg-cvforge-raised/50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cvforge-muted">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[0.65rem] font-medium text-amber-300/90">Avant</p>
          <p className="text-xs leading-relaxed text-cvforge-muted line-through decoration-amber-500/40">
            {before || '—'}
          </p>
        </div>
        <div>
          <p className="mb-1 text-[0.65rem] font-medium text-emerald-300/90">Après</p>
          <p
            className={cn(
              'text-xs leading-relaxed text-cvforge-text',
              changed && 'rounded bg-emerald-500/10 px-1.5 py-1',
            )}
          >
            {after || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
