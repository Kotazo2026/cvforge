'use client';

import { useEffect, useState } from 'react';
import { useCVStore } from '@/store/cv.store';

const MAX_WAIT_MS = 1500;

/**
 * Attend la réhydratation Zustand persist (localStorage), avec délai max.
 * L’UI s’affiche toujours après MAX_WAIT_MS même si le stockage est corrompu.
 */
export function useCvHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const settle = () => {
      if (active) setHydrated(true);
    };

    if (useCVStore.persist.hasHydrated()) {
      settle();
      return () => {
        active = false;
      };
    }

    const unsubFinish = useCVStore.persist.onFinishHydration(settle);

    const run = async () => {
      try {
        await useCVStore.persist.rehydrate();
      } catch {
        try {
          useCVStore.persist.clearStorage();
          await useCVStore.persist.rehydrate();
        } catch {
          // Données illisibles : l’éditeur part sur le CV par défaut en mémoire
        }
      } finally {
        settle();
      }
    };

    void run();

    const timeoutId = window.setTimeout(settle, MAX_WAIT_MS);

    return () => {
      active = false;
      unsubFinish();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return hydrated;
}
