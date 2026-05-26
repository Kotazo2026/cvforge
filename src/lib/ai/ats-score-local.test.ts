import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { buildLocalAtsScore } from './ats-score-local';

describe('ats-score-local', () => {
  it('retourne un score et des recommandations', () => {
    const result = buildLocalAtsScore(defaultCV(), 'React TypeScript Next.js Agile Docker');
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
    expect(result.sectionDensity.length).toBeGreaterThan(0);
  });

  it('détecte des mots-clés manquants', () => {
    const result = buildLocalAtsScore(defaultCV(), 'Rust Kubernetes Terraform');
    expect(result.missingKeywords.length).toBeGreaterThan(0);
  });
});
