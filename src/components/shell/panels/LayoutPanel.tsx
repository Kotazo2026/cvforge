'use client';

import { ColorPicker } from '@/components/toolbar/ColorPicker';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';

const FONT_SIZES = [
  { id: 'small' as const, label: 'S' },
  { id: 'medium' as const, label: 'M' },
  { id: 'large' as const, label: 'L' },
];

/** Panneau mise en page — options complètes au Bloc 12 ; raccourcis conservés ici. */
export function LayoutPanel() {
  const fontSize = useCVStore((state) => state.document.fontSize);
  const setFontSize = useCVStore((state) => state.setFontSize);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Mise en page</h2>
        <p className="mt-1 text-xs text-cvforge-muted">
          Couleurs, polices et marges avancées — Bloc 12
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-cvforge-muted">
            Couleur principale
          </h3>
          <ColorPicker />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-cvforge-muted">
            Taille globale
          </h3>
          <div
            className="inline-flex rounded-lg border border-cvforge-border p-0.5"
            role="group"
            aria-label="Taille de police"
          >
            {FONT_SIZES.map((size) => (
              <button
                key={size.id}
                type="button"
                aria-pressed={fontSize === size.id}
                aria-label={`Taille ${size.label}`}
                onClick={() => setFontSize(size.id)}
                className={cn(
                  'h-8 w-8 rounded-md text-xs font-semibold transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue',
                  fontSize === size.id
                    ? 'bg-cvforge-accent-blue text-white'
                    : 'text-cvforge-muted hover:bg-cvforge-raised hover:text-cvforge-text',
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-dashed border-cvforge-border bg-cvforge-raised/50 p-4">
          <p className="text-sm text-cvforge-muted">
            Bientôt : pipettes par zone, polices Google, marges, timeline, format de date et plus
            encore.
          </p>
        </section>
      </div>
    </div>
  );
}
