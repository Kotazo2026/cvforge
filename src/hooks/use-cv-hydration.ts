'use client';

import { useEffect, useState } from 'react';
import { useCVStore } from '@/store/cv.store';

const HYDRATION_TIMEOUT_MS = 3000;

/**
 * Attend la réhydratation Zustand persist (localStorage) avant d'afficher l'éditeur.
 * Évite l'écran « Chargement… » infini sous Next.js.
 */
export function useCvHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setHydrated(true);
    };

    if (useCVStore.persist.hasHydrated()) {
      markReady();
      return;
    }

    const unsubFinish = useCVStore.persist.onFinishHydration(markReady);

    const runRehydrate = async () => {
      try {
        await useCVStore.persist.rehydrate();
      } catch {
        useCVStore.persist.clearStorage();
        await useCVStore.persist.rehydrate();
      } finally {
        markReady();
      }
    };

    void runRehydrate();

    const timeout = window.setTimeout(markReady, HYDRATION_TIMEOUT_MS);

    return () => {
      cancelled = true;
      unsubFinish();
      clearTimeout(timeout);
    };
  }, []);

  return hydrated;
}
