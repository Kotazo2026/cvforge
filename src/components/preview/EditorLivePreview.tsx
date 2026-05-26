'use client';

import type { CSSProperties } from 'react';
import type { TemplateId } from '@/types/cv.types';
import { useCVStore } from '@/store/cv.store';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { cn } from '@/utils/cv.utils';

const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: 'Classic',
  modern: 'Modern',
  minimal: 'Minimal',
  creative: 'Creative',
  executive: 'Executive',
};

const FONT_SCALE: Record<'small' | 'medium' | 'large', number> = {
  small: 0.9,
  medium: 1,
  large: 1.1,
};

/** Aperçu live avec templates CV (zoom complet au Bloc 7). */
export function EditorLivePreview() {
  const document = useCVStore((state) => state.document);
  const setTemplate = useCVStore((state) => state.setTemplate);

  const cssVars = {
    '--cv-primary': document.colors.primary,
    '--cv-secondary': document.colors.secondary,
    '--cv-text': document.colors.text,
    '--cv-background': document.colors.background,
    '--cv-font-scale': String(FONT_SCALE[document.fontSize]),
  } as CSSProperties;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="flex flex-wrap justify-center gap-2 rounded-xl bg-white/80 p-2 shadow-sm"
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

      <div className="overflow-auto rounded-lg bg-slate-200/60 p-4 shadow-inner">
        <div style={cssVars}>
          <TemplateRenderer document={document} />
        </div>
      </div>
    </div>
  );
}
