import { describe, expect, it } from 'vitest';
import { extractKeywords, inferJobTitleFromOffer } from './keywords';

describe('keywords', () => {
  it('extrait les mots-clés d’une offre', () => {
    const keywords = extractKeywords(
      'Développeur React TypeScript senior. Next.js, Node.js, Docker. Agile.',
    );
    expect(keywords).toContain('react');
    expect(keywords).toContain('typescript');
  });

  it('déduit un titre depuis la première ligne', () => {
    const title = inferJobTitleFromOffer(
      'Développeur Full Stack\nNous recherchons un profil expérimenté…',
      'Développeur',
    );
    expect(title.toLowerCase()).toContain('développeur');
  });
});
