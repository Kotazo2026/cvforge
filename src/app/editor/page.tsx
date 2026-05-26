'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorWorkspace } from '@/components/editor/EditorWorkspace';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { useCVStore } from '@/store/cv.store';

export default function EditorPage() {
  const [hydrated, setHydrated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finish = () => setHydrated(true);
    if (useCVStore.persist.hasHydrated()) {
      finish();
      return;
    }
    return useCVStore.persist.onFinishHydration(finish);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Chargement de votre CV…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <div data-cvforge-chrome className="shrink-0">
        <Toolbar previewRef={previewRef} />
      </div>
      <EditorWorkspace previewRef={previewRef} />
    </div>
  );
}
