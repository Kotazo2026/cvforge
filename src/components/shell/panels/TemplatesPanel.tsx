'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CV_TEMPLATES } from '@/config/cv-templates';
import { TemplateThumbnail } from '@/components/toolbar/TemplateThumbnail';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';

export function TemplatesPanel() {
  const [query, setQuery] = useState('');
  const templateId = useCVStore((state) => state.document.templateId);
  const primary = useCVStore((state) => state.document.colors.primary);
  const setTemplate = useCVStore((state) => state.setTemplate);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CV_TEMPLATES;
    return CV_TEMPLATES.filter((t) => t.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Modèles</h2>
        <p className="mt-1 text-xs text-cvforge-muted">
          Choisissez un design — {CV_TEMPLATES.length} modèles disponibles
        </p>
        <label className="relative mt-3 flex items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-cvforge-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un modèle…"
            className={cn(
              'w-full rounded-lg border border-cvforge-border bg-cvforge-raised py-2 pl-9 pr-3 text-sm text-cvforge-text',
              'placeholder:text-cvforge-muted focus:border-cvforge-accent-blue focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue/40',
            )}
            aria-label="Rechercher un modèle"
          />
        </label>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4"
        role="radiogroup"
        aria-label="Grille de modèles de CV"
      >
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-cvforge-muted">Aucun modèle trouvé.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((template) => (
              <button
                key={template.id}
                type="button"
                role="radio"
                aria-checked={templateId === template.id}
                aria-label={`Modèle ${template.label}`}
                onClick={() => setTemplate(template.id)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-2 transition-all',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue',
                  templateId === template.id
                    ? 'border-cvforge-accent bg-cvforge-accent/10 shadow-[0_0_0_1px_var(--cvforge-accent)]'
                    : 'border-cvforge-border bg-cvforge-raised hover:border-cvforge-muted hover:bg-cvforge-surface',
                )}
              >
                <TemplateThumbnail
                  templateId={template.id}
                  active={templateId === template.id}
                  primaryColor={primary}
                />
                <span className="text-xs font-medium text-cvforge-text">{template.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
