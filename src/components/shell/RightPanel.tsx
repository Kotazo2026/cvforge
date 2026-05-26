'use client';

import { Briefcase } from 'lucide-react';
import { useMemo } from 'react';
import { useCVStore } from '@/store/cv.store';
import {
  buildCvProgressChecklist,
  computeCvProgressScore,
  type ProgressCategory,
} from '@/utils/cv-progress';
import { ProgressChecklist } from './ProgressChecklist';

export function RightPanel() {
  const document = useCVStore((state) => state.document);

  const score = useMemo(() => {
    const items = buildCvProgressChecklist(document);
    return computeCvProgressScore(items);
  }, [document]);

  const categoryScores: Record<ProgressCategory, number> = {
    completeness: score.completeness,
    quality: score.quality,
    ats: score.ats,
  };

  return (
    <aside
      className="hidden w-[min(100%,300px)] shrink-0 flex-col border-l border-cvforge-border bg-cvforge-surface xl:flex"
      aria-label="Progression du CV"
      data-cvforge-chrome
    >
      <div className="border-b border-cvforge-border px-4 py-4">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cvforge-text">Progression intelligente</h2>
          <span className="text-lg font-bold tabular-nums text-cvforge-accent">{score.percent}%</span>
        </div>
        <p className="mb-3 text-[0.65rem] leading-relaxed text-cvforge-muted">
          Score pondéré : complétude 40 % · qualité 35 % · ATS 25 %
        </p>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-cvforge-raised"
          role="progressbar"
          aria-valuenow={score.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Score global du CV"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cvforge-accent-blue via-cvforge-accent to-emerald-500 transition-[width] duration-700 ease-out"
            style={{ width: `${score.percent}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[0.65rem]">
          <ScorePill label="Complétude" value={score.completeness} />
          <ScorePill label="Qualité" value={score.quality} />
          <ScorePill label="ATS" value={score.ats} />
        </div>
      </div>

      <ProgressChecklist items={score.items} categoryScores={categoryScores} />

      <section className="shrink-0 border-t border-cvforge-border p-4">
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

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-cvforge-raised/80 px-1 py-1">
      <div className="font-semibold tabular-nums text-cvforge-text">{value}%</div>
      <div className="text-cvforge-muted">{label}</div>
    </div>
  );
}
