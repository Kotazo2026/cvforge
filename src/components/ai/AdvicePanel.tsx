'use client';

import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import { useEditorUIStore } from '@/store/editor-ui.store';
import type { AdviceResult } from '@/types/ai.types';
import { DiffBlock } from './DiffBlock';

export function AdvicePanel() {
  const document = useCVStore((state) => state.document);
  const applyFieldPatch = useCVStore((state) => state.applyFieldPatch);
  const setFieldHints = useEditorUIStore((state) => state.setFieldHints);
  const clearFieldHints = useEditorUIStore((state) => state.clearFieldHints);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdviceResult | null>(null);

  const runAdvice = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    clearFieldHints();

    try {
      const response = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ document }),
      });
      const data = (await response.json()) as { result?: AdviceResult; error?: string };
      if (!response.ok || !data.result) {
        throw new Error(data.error ?? 'Analyse impossible');
      }
      setResult(data.result);

      const hints: Record<string, string> = {};
      for (const item of data.result.reformulations) {
        hints[item.fieldKey] = item.after;
      }
      setFieldHints(hints);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const applyReformulation = (fieldKey: string, value: string) => {
    applyFieldPatch(fieldKey, value);
    setFieldHints(
      Object.fromEntries(
        Object.entries(useEditorUIStore.getState().fieldHints).filter(([key]) => key !== fieldKey),
      ),
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-cvforge-muted">
        3 à 5 conseils personnalisés et reformulations pour les descriptions à améliorer. Les
        suggestions apparaissent dans l&apos;éditeur (icône ampoule).
      </p>

      <Button
        variant="primary"
        size="md"
        onClick={runAdvice}
        loading={loading}
        icon={<Lightbulb className="h-4 w-4" aria-hidden />}
        className="w-full"
      >
        Générer les conseils
      </Button>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-cvforge-muted">
              Conseils
            </h3>
            <ul className="space-y-2">
              {result.tips.map((tip) => (
                <li
                  key={tip.id}
                  className="rounded-lg border border-cvforge-border bg-cvforge-raised/50 px-3 py-2 text-xs text-cvforge-text"
                >
                  {tip.message}
                </li>
              ))}
            </ul>
          </div>

          {result.reformulations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-cvforge-muted">
                Reformulations suggérées
              </h3>
              {result.reformulations.map((item) => (
                <div key={item.fieldKey} className="space-y-2">
                  <DiffBlock label={item.label} before={item.before} after={item.after} />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => applyReformulation(item.fieldKey, item.after)}
                  >
                    Appliquer cette reformulation
                  </Button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[0.65rem] text-cvforge-muted">
            Source : {result.source === 'anthropic' ? 'Claude' : 'analyse locale'}
          </p>
        </div>
      )}
    </div>
  );
}
