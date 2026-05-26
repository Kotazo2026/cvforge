import type { StateStorage } from 'zustand/middleware';

/** Stockage localStorage sûr côté client uniquement (compatible Next.js SSR). */
export const cvPersistStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Quota dépassé ou mode privé — ignorer silencieusement
    }
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};
