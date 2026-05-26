'use client';

import { useEffect, useRef } from 'react';
import { EditorShell } from '@/components/shell/EditorShell';
import { useCVStore } from '@/store/cv.store';

function rehydrateCvStore(): void {
  if (useCVStore.persist.hasHydrated()) return;

  void (async () => {
    try {
      await useCVStore.persist.rehydrate();
    } catch {
      useCVStore.persist.clearStorage();
      await useCVStore.persist.rehydrate();
    }
  })();
}

export default function EditorApp() {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rehydrateCvStore();
  }, []);

  return <EditorShell previewRef={previewRef} />;
}
