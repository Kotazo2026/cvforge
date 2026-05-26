'use client';

import type { ReactNode } from 'react';
import {
  CV_DATE_FORMAT_OPTIONS,
  CV_FONT_OPTIONS,
  CV_FONT_STYLE_OPTIONS,
} from '@/config/cv-layout';
import { ColorPicker } from '@/components/toolbar/ColorPicker';
import { useCVStore } from '@/store/cv.store';
import { cn } from '@/utils/cv.utils';
import { LayoutColorField } from './layout/LayoutColorField';
import { LayoutSlider } from './layout/LayoutSlider';
import { LayoutToggle } from './layout/LayoutToggle';

const FONT_SIZES = [
  { id: 'small' as const, label: 'S' },
  { id: 'medium' as const, label: 'M' },
  { id: 'large' as const, label: 'L' },
];

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cvforge-muted">
      {children}
    </h3>
  );
}

export function LayoutPanel() {
  const layout = useCVStore((state) => state.document.layout);
  const fontSize = useCVStore((state) => state.document.fontSize);
  const setLayout = useCVStore((state) => state.setLayout);
  const setFontSize = useCVStore((state) => state.setFontSize);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-cvforge-border px-4 py-4">
        <h2 className="text-sm font-semibold text-cvforge-text">Mise en page</h2>
        <p className="mt-1 text-xs text-cvforge-muted">
          Couleurs, typographie, marges et options d&apos;affichage
        </p>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-4">
        <section>
          <SectionHeading>Palettes rapides</SectionHeading>
          <ColorPicker />
        </section>

        <section>
          <SectionHeading>Couleurs détaillées</SectionHeading>
          <div className="space-y-2">
            <LayoutColorField
              label="Nom"
              value={layout.colors.name}
              onChange={(name) => setLayout({ colors: { name } })}
            />
            <LayoutColorField
              label="Poste recherché"
              value={layout.colors.jobTitle}
              onChange={(jobTitle) => setLayout({ colors: { jobTitle } })}
            />
            <LayoutColorField
              label="Titres de section (colonne principale)"
              value={layout.colors.sectionTitleMain}
              onChange={(sectionTitleMain) => setLayout({ colors: { sectionTitleMain } })}
            />
            <LayoutColorField
              label="Titres de section (colonne latérale)"
              value={layout.colors.sectionTitleSidebar}
              onChange={(sectionTitleSidebar) => setLayout({ colors: { sectionTitleSidebar } })}
            />
            <LayoutColorField
              label="Établissements / entreprises"
              value={layout.colors.organization}
              onChange={(organization) => setLayout({ colors: { organization } })}
            />
            <LayoutColorField
              label="Barres de niveau"
              value={layout.colors.skillBar}
              onChange={(skillBar) => setLayout({ colors: { skillBar } })}
            />
            <LayoutColorField
              label="Fond colonne gauche"
              value={layout.colors.sidebarBackground}
              onChange={(sidebarBackground) => setLayout({ colors: { sidebarBackground } })}
            />
          </div>
        </section>

        <section>
          <SectionHeading>Typographie</SectionHeading>
          <div className="space-y-3">
            <label className="block text-xs text-cvforge-muted">
              Police du texte
              <select
                value={layout.typography.bodyFont}
                onChange={(event) =>
                  setLayout({
                    typography: {
                      bodyFont: event.target.value as typeof layout.typography.bodyFont,
                    },
                  })
                }
                className="mt-1 w-full rounded-lg border border-cvforge-border bg-cvforge-raised px-2 py-2 text-sm text-cvforge-text focus:border-cvforge-accent-blue focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue/40"
              >
                {CV_FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs text-cvforge-muted">
              Style du texte
              <select
                value={layout.typography.bodyStyle}
                onChange={(event) =>
                  setLayout({
                    typography: {
                      bodyStyle: event.target.value as typeof layout.typography.bodyStyle,
                    },
                  })
                }
                className="mt-1 w-full rounded-lg border border-cvforge-border bg-cvforge-raised px-2 py-2 text-sm text-cvforge-text focus:border-cvforge-accent-blue focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue/40"
              >
                {CV_FONT_STYLE_OPTIONS.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs text-cvforge-muted">
              Police des titres
              <select
                value={layout.typography.titleFont}
                onChange={(event) =>
                  setLayout({
                    typography: {
                      titleFont: event.target.value as typeof layout.typography.titleFont,
                    },
                  })
                }
                className="mt-1 w-full rounded-lg border border-cvforge-border bg-cvforge-raised px-2 py-2 text-sm text-cvforge-text focus:border-cvforge-accent-blue focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue/40"
              >
                {CV_FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>

            <LayoutSlider
              label="Taille des textes"
              value={layout.typography.bodySizePx}
              min={8}
              max={14}
              onChange={(bodySizePx) => setLayout({ typography: { bodySizePx } })}
            />
            <LayoutSlider
              label="Taille du nom"
              value={layout.typography.nameSizePx}
              min={18}
              max={36}
              onChange={(nameSizePx) => setLayout({ typography: { nameSizePx } })}
            />
            <LayoutSlider
              label="Taille des titres de section"
              value={layout.typography.sectionTitleSizePx}
              min={10}
              max={16}
              onChange={(sectionTitleSizePx) => setLayout({ typography: { sectionTitleSizePx } })}
            />

            <div>
              <span className="text-xs text-cvforge-muted">Échelle globale (aperçu)</span>
              <div
                className="mt-2 inline-flex rounded-lg border border-cvforge-border p-0.5"
                role="group"
                aria-label="Taille globale"
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
                      fontSize === size.id
                        ? 'bg-cvforge-accent-blue text-white'
                        : 'text-cvforge-muted hover:bg-cvforge-raised',
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading>Marges & espacement</SectionHeading>
          <div className="space-y-3">
            <LayoutSlider
              label="Marges entre blocs"
              value={layout.spacing.blockGapPx}
              min={8}
              max={48}
              onChange={(blockGapPx) => setLayout({ spacing: { blockGapPx } })}
            />
            <LayoutSlider
              label="Marges intérieures verticales"
              value={layout.spacing.paddingVerticalPx}
              min={12}
              max={56}
              onChange={(paddingVerticalPx) => setLayout({ spacing: { paddingVerticalPx } })}
            />
            <LayoutSlider
              label="Marges intérieures horizontales"
              value={layout.spacing.paddingHorizontalPx}
              min={12}
              max={56}
              onChange={(paddingHorizontalPx) => setLayout({ spacing: { paddingHorizontalPx } })}
            />
          </div>
        </section>

        <section>
          <SectionHeading>Options d&apos;affichage</SectionHeading>
          <div className="space-y-2">
            <LayoutToggle
              label="Photo arrondie"
              checked={layout.roundedPhoto}
              onChange={(roundedPhoto) => setLayout({ roundedPhoto })}
            />
            <LayoutToggle
              label="Afficher la timeline"
              checked={layout.showTimeline}
              onChange={(showTimeline) => setLayout({ showTimeline })}
            />
            <LayoutToggle
              label="Nom en majuscules"
              checked={layout.nameUppercase}
              onChange={(nameUppercase) => setLayout({ nameUppercase })}
            />
            <LayoutToggle
              label="Accroche justifiée"
              checked={layout.summaryJustified}
              onChange={(summaryJustified) => setLayout({ summaryJustified })}
            />
            <label className="block rounded-lg border border-cvforge-border bg-cvforge-raised/40 px-3 py-2.5 text-xs text-cvforge-text">
              Format de la date
              <select
                value={layout.dateFormat}
                onChange={(event) =>
                  setLayout({
                    dateFormat: event.target.value as typeof layout.dateFormat,
                  })
                }
                className="mt-1.5 w-full rounded-md border border-cvforge-border bg-cvforge-surface px-2 py-1.5 text-sm focus:border-cvforge-accent-blue focus:outline-none"
              >
                {CV_DATE_FORMAT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
