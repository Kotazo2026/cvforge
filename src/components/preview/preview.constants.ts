import type { CSSProperties } from 'react';
import type { CVDocument } from '@/types/cv.types';
import { buildLayoutCssVars } from '@/utils/cv-layout.utils';

export const CV_PAGE_WIDTH_PX = 794;
export const CV_PAGE_MIN_HEIGHT_PX = 1123;

export const FONT_SCALE: Record<CVDocument['fontSize'], number> = {
  small: 0.9,
  medium: 1,
  large: 1.1,
};

export const DEFAULT_PREVIEW_ZOOM = 90;
export const MIN_PREVIEW_ZOOM = 50;
export const MAX_PREVIEW_ZOOM = 150;

export function buildTemplateCssVars(document: CVDocument): CSSProperties {
  return buildLayoutCssVars(document);
}
