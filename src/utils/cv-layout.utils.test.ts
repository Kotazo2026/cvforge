import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import {
  buildLayoutCssVars,
  createDefaultLayout,
  formatDateRangeForLayout,
} from './cv-layout.utils';

describe('cv-layout.utils', () => {
  it('crée des options par défaut', () => {
    const colors = defaultCV().colors;
    const layout = createDefaultLayout(colors);
    expect(layout.typography.bodyFont).toBe('dm-sans');
    expect(layout.spacing.blockGapPx).toBe(20);
  });

  it('expose les variables CSS de mise en page', () => {
    const doc = defaultCV();
    const vars = buildLayoutCssVars(doc);
    expect(vars['--cv-color-name']).toBeTruthy();
    expect(vars['--cv-font-body']).toContain('DM Sans');
  });

  it('formate les dates selon le format choisi', () => {
    expect(formatDateRangeForLayout('2022-03', '2024-01', false, 'mm-yyyy')).toBe(
      '03/2022 – 01/2024',
    );
    expect(formatDateRangeForLayout('2022-03', undefined, true, 'yyyy')).toBe('2022 – Présent');
  });
});
