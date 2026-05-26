'use client';

import { useEffect } from 'react';
import { useCVStore } from '@/store/cv.store';
import { getLayoutGoogleFontFamilies } from '@/utils/cv-layout.utils';

const LOADED = new Set<string>();

export function LayoutFontLoader() {
  const document = useCVStore((state) => state.document);

  useEffect(() => {
    const families = getLayoutGoogleFontFamilies(document);
    families.forEach((family) => {
      if (LOADED.has(family)) return;
      LOADED.add(family);
      const link = window.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;600;700&display=swap`;
      window.document.head.appendChild(link);
    });
  }, [document.layout, document]);

  return null;
}
