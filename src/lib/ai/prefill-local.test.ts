import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { buildLocalPrefill, hasPrefillChanges } from './prefill-local';

const SAMPLE_OFFER = `
Développeur Full Stack React / Next.js
Nous recherchons un profil maîtrisant TypeScript, Node.js, Docker et les méthodes Agile.
Missions : concevoir des APIs REST, piloter la CI/CD, améliorer les performances.
`.trim();

describe('prefill-local', () => {
  it('propose des modifications alignées sur l’offre', () => {
    const proposal = buildLocalPrefill(defaultCV(), SAMPLE_OFFER);
    expect(hasPrefillChanges(proposal)).toBe(true);
    expect(proposal.summary.after.length).toBeGreaterThan(proposal.summary.before.length);
    expect(proposal.matchedKeywords.length).toBeGreaterThan(0);
    expect(proposal.source).toBe('local');
  });
});
