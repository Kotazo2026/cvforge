'use client';

import { useRef } from 'react';
import type { TemplateId } from '@/types/cv.types';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import { CVPreview } from './CVPreview';

const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: 'Classic',
  modern: 'Modern',
  minimal: 'Minimal',
  creative: 'Creative',
  executive: 'Executive',
};

/** Bandeau de sélection template (toolbar complète au Bloc 8) + aperçu CVPreview. */
export function EditorLivePreview() {
  const document = useCVStore((state) => state.document);
  const setTemplate = useCVStore((state) => state.setTemplate);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div
        className="flex shrink-0 flex-wrap justify-center gap-2 border-b border-slate-200 bg-white px-4 py-2"
        role="tablist"
        aria-label="Choisir un template"
      >
        {(Object.keys(TEMPLATE_LABELS) as TemplateId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={document.templateId === id}
            onClick={() => setTemplate(id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              document.templateId === id
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {TEMPLATE_LABELS[id]}
          </button>
        ))}
      </div>

      <CVPreview ref={previewRef} className="min-h-0 flex-1" />
    </div>
  );
}
