import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import {
  buildCvProgressChecklist,
  computeCategoryPercent,
  computeCvProgressPercent,
  computeCvProgressScore,
  groupProgressItemsByCategory,
} from './cv-progress';

describe('cv-progress', () => {
  it('calcule un score pondéré pour le CV par défaut', () => {
    const items = buildCvProgressChecklist(defaultCV());
    const score = computeCvProgressScore(items);

    expect(score.percent).toBeGreaterThan(50);
    expect(score.percent).toBeLessThanOrEqual(100);
    expect(score.completeness).toBeGreaterThan(0);
    expect(score.quality).toBeGreaterThan(0);
    expect(score.ats).toBeGreaterThan(0);
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
        jobTitle: '',
        location: '',
        summary: '',
        photo: undefined,
        linkedin: undefined,
        website: undefined,
      },
      sections: [],
    };
    const score = computeCvProgressScore(buildCvProgressChecklist(empty));
    expect(score.percent).toBe(0);
    expect(computeCvProgressPercent(buildCvProgressChecklist(empty))).toBe(0);
  });

  it('détecte les verbes d’action et les métriques ATS', () => {
    const items = buildCvProgressChecklist(defaultCV());
    const action = items.find((item) => item.id === 'action-verbs');
    const metrics = items.find((item) => item.id === 'metrics');
    const twoExp = items.find((item) => item.id === 'two-experiences');

    expect(action?.completed).toBe(true);
    expect(metrics?.completed).toBe(true);
    expect(twoExp?.completed).toBe(true);
  });

  it('groupe les items par catégorie', () => {
    const items = buildCvProgressChecklist(defaultCV());
    const grouped = groupProgressItemsByCategory(items);

    expect(grouped.completeness.length).toBeGreaterThan(0);
    expect(grouped.quality.length).toBeGreaterThan(0);
    expect(grouped.ats.length).toBeGreaterThan(0);
    expect(
      grouped.completeness.length + grouped.quality.length + grouped.ats.length,
    ).toBe(items.length);
  });

  it('calcule le pourcentage par catégorie', () => {
    const items = buildCvProgressChecklist(defaultCV());
    const completeness = computeCategoryPercent(items, 'completeness');
    expect(completeness).toBeGreaterThan(0);
    expect(completeness).toBeLessThanOrEqual(100);
  });

  it('met à jour le score quand une description riche est ajoutée', () => {
    const base = defaultCV();
    const poor = {
      ...base,
      sections: base.sections.map((section) =>
        section.type === 'experience'
          ? {
              ...section,
              entries: section.entries.map((entry) => ({ ...entry, description: '' })),
            }
          : section,
      ),
    };
    const rich = defaultCV();

    const poorScore = computeCvProgressScore(buildCvProgressChecklist(poor)).percent;
    const richScore = computeCvProgressScore(buildCvProgressChecklist(rich)).percent;

    expect(richScore).toBeGreaterThan(poorScore);
  });
});
