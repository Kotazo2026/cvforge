'use client';

import { Briefcase } from 'lucide-react';
import { useCVStore } from '@/store/cv.store';
import { buildCvProgressChecklist, computeCvProgressPercent } from '@/utils/cv-progress';
import { cn } from '@/utils/cv.utils';

export function RightPanel() {
  const document = useCVStore((state) => state.document);
  const items = buildCvProgressChecklist(document);
  const percent = computeCvProgressPercent(items);

  return (
    <aside
      className="hidden w-[min(100%,280px)] shrink-0 flex-col border-l border-cvforge-border bg-cvforge-surface xl:flex"
      aria-label="Progression du CV"
      data-cvforge-chrome
    >
      <div className="border-b border-cvforge-border px-4 py-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cvforge-text">Progression</h2>
          <span className="text-sm font-bold text-cvforge-accent">{percent}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-cvforge-raised"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression du CV"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cvforge-accent-blue to-cvforge-accent transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
              item.completed
                ? 'text-emerald-400/90 line-through decoration-emerald-500/50'
                : 'text-amber-200/90',
            )}
          >
            <span
              className={cn(
                'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                item.completed ? 'bg-emerald-400' : 'bg-amber-400',
              )}
              aria-hidden
            />
            {item.label}
          </li>
        ))}
      </ul>

      <section className="border-t border-cvforge-border p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-cvforge-text">
          <Briefcase className="h-4 w-4 text-cvforge-muted" aria-hidden />
          Offres d&apos;emploi adaptées
        </div>
        <p className="mt-2 text-xs leading-relaxed text-cvforge-muted">
          Bientôt : suggestions d&apos;offres alignées sur votre profil et votre CV.
        </p>
      </section>
    </aside>
  );
}
