import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { buildLocalGrammarCheck } from './grammar-local';

describe('grammar-local', () => {
  it('détecte les espaces doubles', () => {
    const doc = defaultCV();
    const exp = doc.sections.find((s) => s.type === 'experience');
    if (exp?.entries[0]) {
      exp.entries[0].description = 'Mission  avec  double espaces.';
    }
    const result = buildLocalGrammarCheck(doc);
    expect(result.issues.length).toBeGreaterThan(0);
  });
});
