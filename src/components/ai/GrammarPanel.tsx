'use client';

import { useState } from 'react';
import { SpellCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import { useEditorUIStore } from '@/store/editor-ui.store';
import type { GrammarResult } from '@/types/ai.types';
import { cn } from '@/utils/cv.utils';

export function GrammarPanel() {
  const document = useCVStore((state) => state.document);
  const applyFieldPatch = useCVStore((state) => state.applyFieldPatch);
  const grammarIssues = useEditorUIStore((state) => state.grammarIssues);
  const setGrammarIssues = useEditorUIStore((state) => state.setGrammarIssues);
  const removeGrammarIssue = useEditorUIStore((state) => state.removeGrammarIssue);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const runGrammar = async () => {
    setLoading(true);
    setError(null);
    setGrammarIssues([]);

    try {
      const response = await fetch('/api/ai/grammar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ document }),
      });
      const data = (await response.json()) as { result?: GrammarResult; error?: string };
      if (!response.ok || !data.result) {
        throw new Error(data.error ?? 'Correction impossible');
      }
      setGrammarIssues(data.result.issues);
      setSource(data.result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const applyIssue = (issueId: string) => {
    const issue = grammarIssues.find((item) => item.id === issueId);
    if (!issue) return;
    applyFieldPatch(issue.fieldKey, issue.suggestion);
    removeGrammarIssue(issueId);
  };

  const applyAll = () => {
    for (const issue of grammarIssues) {
      applyFieldPatch(issue.fieldKey, issue.suggestion);
    }
    setGrammarIssues([]);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-cvforge-muted">
        Repère fautes d&apos;orthographe et de grammaire. Les champs concernés sont surlignés en
        jaune dans l&apos;éditeur.
      </p>

      <Button
        variant="primary"
        size="md"
        onClick={runGrammar}
        loading={loading}
        icon={<SpellCheck className="h-4 w-4" aria-hidden />}
        className="w-full"
      >
        Lancer la correction
      </Button>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      {grammarIssues.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-cvforge-text">
              {grammarIssues.length} correction(s) suggérée(s)
            </p>
            <Button variant="primary" size="sm" onClick={applyAll}>
              Tout accepter
            </Button>
          </div>

          <ul className="space-y-2">
            {grammarIssues.map((issue) => (
              <li
                key={issue.id}
                className={cn(
                  'rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2',
                  'transition-colors hover:bg-yellow-500/15',
                )}
                title={`Suggestion : ${issue.suggestion}`}
              >
                <p className="text-xs font-medium text-yellow-100">{issue.fieldLabel}</p>
                <p className="mt-1 text-[0.65rem] text-cvforge-muted line-through">{issue.original}</p>
                <p className="mt-0.5 text-xs text-cvforge-text">{issue.suggestion}</p>
                <p className="mt-1 text-[0.65rem] text-yellow-200/80">{issue.message}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => applyIssue(issue.id)}
                >
                  Appliquer
                </Button>
              </li>
            ))}
          </ul>

          {source && (
            <p className="text-[0.65rem] text-cvforge-muted">
              Source : {source === 'anthropic' ? 'Claude' : 'analyse locale'}
            </p>
          )}
        </div>
      )}

      {!loading && grammarIssues.length === 0 && source && (
        <p className="text-xs text-emerald-300">Aucune correction nécessaire détectée.</p>
      )}
    </div>
  );
}
