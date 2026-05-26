'use client';

import { useEffect, useRef } from 'react';
import { EditorWorkspace } from '@/components/editor/EditorWorkspace';
import { Toolbar } from '@/components/toolbar/Toolbar';
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <div data-cvforge-chrome className="shrink-0">
        <Toolbar previewRef={previewRef} />
      </div>
      <EditorWorkspace previewRef={previewRef} />
    </div>
  );
}
