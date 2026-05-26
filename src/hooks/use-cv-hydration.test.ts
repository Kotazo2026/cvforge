import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useCVStore } from '@/store/cv.store';
import { useCvHydration } from './use-cv-hydration';

function resetPersist() {
  localStorage.clear();
  useCVStore.persist.clearStorage();
  useCVStore.getState().resetDocument();
}

describe('useCvHydration', () => {
  beforeEach(() => {
    resetPersist();
  });

  afterEach(() => {
    resetPersist();
  });

  it('passe à true après réhydratation', async () => {
    useCVStore.getState().updateHeader({ firstName: 'Hydrate' });

    const { result } = renderHook(() => useCvHydration());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('passe à true même si localStorage est corrompu', async () => {
    localStorage.setItem('cvforge_document', '{not-json');

    const { result } = renderHook(() => useCvHydration());

    await waitFor(
      () => {
        expect(result.current).toBe(true);
      },
      { timeout: 2500 },
    );
  });
});
