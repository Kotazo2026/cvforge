import { beforeEach, describe, expect, it } from 'vitest';
import { useCVStore } from './cv.store';

describe('cv.store applyPrefill', () => {
  beforeEach(() => {
    localStorage.clear();
    useCVStore.persist.clearStorage();
    useCVStore.getState().resetDocument();
  });

  it('applique titre et accroche', () => {
    useCVStore.getState().applyPrefill({
      jobTitle: 'Lead Developer',
      summary: 'Nouvelle accroche orientée produit.',
    });

    const { header } = useCVStore.getState().document;
    expect(header.jobTitle).toBe('Lead Developer');
    expect(header.summary).toBe('Nouvelle accroche orientée produit.');
  });
});
