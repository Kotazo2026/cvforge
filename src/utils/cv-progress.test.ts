import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { buildCvProgressChecklist, computeCvProgressPercent } from './cv-progress';

describe('cv-progress', () => {
  it('calcule un pourcentage pour le CV par défaut', () => {
    const items = buildCvProgressChecklist(defaultCV());
    const percent = computeCvProgressPercent(items);
    expect(percent).toBeGreaterThan(0);
    expect(percent).toBeLessThanOrEqual(100);
  });

  it('retourne 0% pour un CV vide', () => {
    const empty = {
      ...defaultCV(),
      header: {
        ...defaultCV().header,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        summary: '',
        photo: undefined,
      },
      sections: [],
    };
    const items = buildCvProgressChecklist(empty);
    expect(computeCvProgressPercent(items)).toBe(0);
  });
});
