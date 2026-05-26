'use client';

import type { CSSProperties } from 'react';
import { useCVStore } from '@/store/cv.store';
import { TemplateRenderer } from './templates/TemplateRenderer';

const FONT_SCALE: Record<'small' | 'medium' | 'large', number> = {
  small: 0.9,
  medium: 1,
  large: 1.1,
};

/** Conteneur prévisualisation — zoom et print au Bloc 7. */
export function CVPreview() {
  const document = useCVStore((state) => state.document);

  const cssVars = {
    '--cv-primary': document.colors.primary,
    '--cv-secondary': document.colors.secondary,
    '--cv-text': document.colors.text,
    '--cv-background': document.colors.background,
    '--cv-font-scale': String(FONT_SCALE[document.fontSize]),
  } as CSSProperties;

  return (
    <div style={cssVars} className="cv-template-print-wrapper">
      <TemplateRenderer document={document} />
    </div>
  );
}
