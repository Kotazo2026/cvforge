'use client';

import { useState } from 'react';
import { Gauge } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import type { AtsScoreResult } from '@/types/ai.types';
import { AtsScoreGauge } from './AtsScoreGauge';
import { cn } from '@/utils/cv.utils';

interface AtsScorePanelProps {
  compact?: boolean;
}

export function AtsScorePanel({ compact = false }: AtsScorePanelProps) {
  const document = useCVStore((state) => state.document);

  const [jobOffer, setJobOffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsScoreResult | null>(null);

  const runScore = async () => {
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/ats-score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          document,
          jobOffer: jobOffer.trim() || undefined,
        }),
      });

      const data = (await response.json()) as {
        result?: AtsScoreResult;
        error?: string;
      };

      if (!response.ok || !data.result) {
        throw new Error(data.error ?? 'Impossible de calculer le score ATS.');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <p className="text-xs leading-relaxed text-cvforge-muted">
        Score ATS sur 100 : mots-clés présents ou manquants, densité par section et 3 actions
        prioritaires.
      </p>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-cvforge-text">
          Offre d&apos;emploi (optionnel)
        </span>
        <textarea
          value={jobOffer}
          onChange={(event) => setJobOffer(event.target.value)}
          rows={compact ? 4 : 5}
          placeholder="Collez l’annonce pour comparer les mots-clés…"
          className="w-full resize-y rounded-lg border border-cvforge-border bg-cvforge-raised px-3 py-2 text-sm text-cvforge-text placeholder:text-cvforge-muted focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue"
        />
      </label>

      <Button
        variant="primary"
        size="md"
        onClick={runScore}
        disabled={loading}
        loading={loading}
        icon={<Gauge className="h-4 w-4" aria-hidden />}
        className="w-full"
      >
        Calculer le score ATS
      </Button>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4 rounded-xl border border-cvforge-border bg-cvforge-raised/40 p-4">
          <p className="text-center text-xs text-cvforge-muted">
            Source : {result.source === 'anthropic' ? 'Claude Sonnet' : 'analyse locale'}
          </p>
          <AtsScoreGauge score={result.score} />

          <div className="grid gap-3 sm:grid-cols-2">
            <KeywordList title="Présents" keywords={result.presentKeywords} variant="present" />
            <KeywordList title="Manquants" keywords={result.missingKeywords} variant="missing" />
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-cvforge-muted">
              Densité par section
            </h4>
            <ul className="space-y-1.5">
              {result.sectionDensity.map((section) => (
                <li
                  key={section.sectionType}
                  className="flex items-center justify-between rounded-md bg-cvforge-surface px-2 py-1.5 text-xs"
                >
                  <span className="text-cvforge-text">{section.label}</span>
                  <span
                    className={cn(
                      'font-medium capitalize',
                      section.status === 'rich' && 'text-emerald-400',
                      section.status === 'ok' && 'text-amber-300',
                      section.status === 'low' && 'text-red-300',
                    )}
                  >
                    {section.charCount} car. · {section.entryCount} entr.
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-cvforge-muted">
              Top 3 actions
            </h4>
            <ol className="space-y-2">
              {result.recommendations.map((rec) => (
                <li
                  key={rec.priority}
                  className="rounded-lg border border-cvforge-border bg-cvforge-surface px-3 py-2"
                >
                  <p className="text-xs font-semibold text-cvforge-accent">
                    #{rec.priority} — {rec.title}
                  </p>
                  <p className="mt-0.5 text-xs text-cvforge-muted">{rec.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function KeywordList({
  title,
  keywords,
  variant,
}: {
  title: string;
  keywords: string[];
  variant: 'present' | 'missing';
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-cvforge-text">{title}</p>
      {keywords.length === 0 ? (
        <p className="text-xs text-cvforge-muted">—</p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {keywords.slice(0, 12).map((keyword) => (
            <span
              key={keyword}
              className={cn(
                'rounded-full px-2 py-0.5 text-[0.65rem] font-medium',
                variant === 'present'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-amber-500/15 text-amber-200',
              )}
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
