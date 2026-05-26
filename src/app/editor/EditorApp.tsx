'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { EditorLoading } from '@/components/shell/EditorLoading';
import { useCVStore } from '@/store/cv.store';

const EditorShell = dynamic(
  () => import('@/components/shell/EditorShell').then((m) => m.EditorShell),
  { loading: () => <EditorLoading />, ssr: false },
);

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
