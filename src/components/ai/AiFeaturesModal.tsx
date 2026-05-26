'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { cn } from '@/utils/cv.utils';
import { AtsScorePanel } from './AtsScorePanel';
import { PrefillPanel } from './PrefillPanel';

const TABS = [
  { id: 'prefill' as const, label: 'Pré-remplir' },
  { id: 'ats' as const, label: 'Score ATS' },
];

export function AiFeaturesModal() {
  const open = useEditorUIStore((state) => state.aiModalOpen);
  const tab = useEditorUIStore((state) => state.aiModalTab);
  const setAiModalTab = useEditorUIStore((state) => state.setAiModalTab);
  const closeAiModal = useEditorUIStore((state) => state.closeAiModal);

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAiModal();
    };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeAiModal]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={closeAiModal}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex max-h-[min(92vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-cvforge-border bg-cvforge-surface shadow-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        data-cvforge-chrome
      >
        <header className="flex shrink-0 items-center justify-between border-b border-cvforge-border px-4 py-3">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-cvforge-text">
              Fonctionnalités IA
            </h2>
            <p className="text-xs text-cvforge-muted">
              Pré-remplissage depuis une offre · Score ATS avec recommandations
            </p>
          </div>
          <button
            type="button"
            onClick={closeAiModal}
            className="rounded-lg p-2 text-cvforge-muted hover:bg-cvforge-raised hover:text-cvforge-text focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div
          className="flex shrink-0 gap-1 border-b border-cvforge-border px-4 py-2"
          role="tablist"
          aria-label="Outils IA"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setAiModalTab(item.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                tab === item.id
                  ? 'bg-cvforge-accent-blue text-white'
                  : 'text-cvforge-muted hover:text-cvforge-text',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {tab === 'prefill' ? <PrefillPanel /> : <AtsScorePanel />}
        </div>
      </div>
    </div>
  );
}
