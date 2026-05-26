'use client';

import { useState } from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import {
  TRANSLATION_LANGUAGE_LABELS,
  TRANSLATION_LANGUAGE_FLAGS,
  type TranslationResult,
  type TranslationTargetLanguage,
} from '@/types/ai.types';

const TARGET_LANGUAGES = Object.keys(TRANSLATION_LANGUAGE_LABELS) as TranslationTargetLanguage[];

export function TranslatePanel() {
  const document = useCVStore((state) => state.document);
  const primarySnapshot = useCVStore((state) => state.primarySnapshot);
  const activeTranslationLang = useCVStore((state) => state.activeTranslationLang);
  const translationCopies = useCVStore((state) => state.translationCopies);
  const loadTranslation = useCVStore((state) => state.loadTranslation);
  const switchToPrimaryDocument = useCVStore((state) => state.switchToPrimaryDocument);
  const switchToTranslation = useCVStore((state) => state.switchToTranslation);

  const [targetLanguage, setTargetLanguage] = useState<TranslationTargetLanguage>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<TranslationResult | null>(null);

  const sourceDocument = primarySnapshot ?? document;

  const runTranslate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ document: sourceDocument, targetLanguage }),
      });
      const data = (await response.json()) as { result?: TranslationResult; error?: string };
      if (!response.ok || !data.result) {
        throw new Error(data.error ?? 'Traduction impossible');
      }
      loadTranslation(targetLanguage, data.result.document);
      setLastResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-cvforge-muted">
        Crée une copie traduite sans écraser l&apos;original. Basculez via « Voir en [langue] » dans
        la barre supérieure.
      </p>

      {activeTranslationLang && (
        <p className="rounded-lg border border-cvforge-accent-blue/40 bg-cvforge-accent-blue/10 px-3 py-2 text-xs text-cvforge-text">
          Vous consultez la version{' '}
          <strong>{TRANSLATION_LANGUAGE_LABELS[activeTranslationLang as TranslationTargetLanguage]}</strong>.
          <button
            type="button"
            className="ml-2 font-semibold text-cvforge-accent-blue hover:underline"
            onClick={() => switchToPrimaryDocument()}
          >
            Revenir à l&apos;original
          </button>
        </p>
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-cvforge-text">Langue cible</span>
        <select
          value={targetLanguage}
          onChange={(event) => setTargetLanguage(event.target.value as TranslationTargetLanguage)}
          className="w-full rounded-lg border border-cvforge-border bg-cvforge-raised px-3 py-2 text-sm text-cvforge-text focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue"
        >
          {TARGET_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {TRANSLATION_LANGUAGE_FLAGS[lang]} {TRANSLATION_LANGUAGE_LABELS[lang]}
            </option>
          ))}
        </select>
      </label>

      <Button
        variant="primary"
        size="md"
        onClick={runTranslate}
        loading={loading}
        icon={<Languages className="h-4 w-4" aria-hidden />}
        className="w-full"
      >
        Traduire le CV
      </Button>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      {lastResult && (
        <p className="text-xs text-emerald-300">
          Copie {TRANSLATION_LANGUAGE_LABELS[lastResult.targetLanguage]} créée (
          {lastResult.source === 'anthropic' ? 'Claude' : 'traduction locale'}).
        </p>
      )}

      {Object.keys(translationCopies).length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-cvforge-muted">Versions disponibles</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => switchToPrimaryDocument()}
              className="rounded-full border border-cvforge-border px-3 py-1 text-xs text-cvforge-text hover:bg-cvforge-raised"
            >
              🇫🇷 Original
            </button>
            {Object.keys(translationCopies).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => switchToTranslation(lang)}
                className="rounded-full border border-cvforge-accent-blue/50 px-3 py-1 text-xs text-cvforge-text hover:bg-cvforge-accent-blue/20"
              >
                {TRANSLATION_LANGUAGE_FLAGS[lang as TranslationTargetLanguage] ?? '🌐'} Voir en{' '}
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
