'use client';

import { useEffect } from 'react';
import { useCVStore } from '@/store/cv.store';

/** Lance la réhydratation dès le layout éditeur (avant la page). */
export function CvPersistBootstrap() {
  useEffect(() => {
    if (useCVStore.persist.hasHydrated()) return;

    void (async () => {
      try {
        await useCVStore.persist.rehydrate();
      } catch {
        useCVStore.persist.clearStorage();
        await useCVStore.persist.rehydrate();
      }
    })();
  }, []);

  return null;
}
