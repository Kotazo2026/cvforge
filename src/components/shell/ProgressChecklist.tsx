'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import type { ProgressCategory, ProgressCheckItem } from '@/utils/cv-progress';
import { PROGRESS_CATEGORY_LABELS, groupProgressItemsByCategory } from '@/utils/cv-progress';
import { cn } from '@/utils/cv.utils';

const CATEGORY_ORDER: ProgressCategory[] = ['completeness', 'quality', 'ats'];

interface ProgressChecklistProps {
  items: ProgressCheckItem[];
  categoryScores: Record<ProgressCategory, number>;
}

export function ProgressChecklist({ items, categoryScores }: ProgressChecklistProps) {
  const grouped = groupProgressItemsByCategory(items);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-3">
      {CATEGORY_ORDER.map((category) => {
        const meta = PROGRESS_CATEGORY_LABELS[category];
        const categoryItems = grouped[category];
        const score = categoryScores[category];

        return (
          <section key={category} aria-labelledby={`progress-${category}`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3
                  id={`progress-${category}`}
                  className="text-xs font-semibold uppercase tracking-wide text-cvforge-text"
                >
                  {meta.title}
                </h3>
                <p className="text-[0.65rem] text-cvforge-muted">{meta.description}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 text-xs font-bold tabular-nums',
                  score >= 80
                    ? 'text-emerald-400'
                    : score >= 40
                      ? 'text-amber-300'
                      : 'text-cvforge-muted',
                )}
              >
                {score}%
              </span>
            </div>

            <div
              className="mb-2 h-1 overflow-hidden rounded-full bg-cvforge-raised"
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression ${meta.title}`}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  score >= 80
                    ? 'bg-emerald-500'
                    : score >= 40
                      ? 'bg-amber-400'
                      : 'bg-cvforge-border',
                )}
                style={{ width: `${score}%` }}
              />
            </div>

            <ul className="space-y-1">
              {categoryItems.map((item) => (
                <li key={item.id}>
                  <ProgressChecklistItem item={item} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ProgressChecklistItem({ item }: { item: ProgressCheckItem }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm transition-all duration-300',
        item.completed
          ? 'bg-emerald-500/10 text-emerald-300/95'
          : 'text-amber-100/90 hover:bg-cvforge-raised/60',
      )}
      title={!item.completed && item.hint ? item.hint : undefined}
    >
      {item.completed ? (
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 animate-[checkPop_400ms_ease-out]"
          aria-hidden
        />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/80" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'block leading-snug',
            item.completed && 'line-through decoration-emerald-500/40',
          )}
        >
          {item.label}
        </span>
        {!item.completed && item.hint && (
          <span className="mt-0.5 block text-[0.65rem] leading-tight text-cvforge-muted">
            {item.hint}
          </span>
        )}
      </div>
    </div>
  );
}
