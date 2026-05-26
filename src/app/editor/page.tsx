'use client';

import { useEffect, useRef, useState } from 'react';
import { CVEditor } from '@/components/editor/CVEditor';
import { EditorLivePreview } from '@/components/preview/EditorLivePreview';
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
      <main className="flex h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">Chargement de votre CV…</p>
      </main>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <Toolbar previewRef={previewRef} />
      <main className="flex min-h-0 flex-1">
        <CVEditor />
        <div
          className="flex min-w-0 flex-col"
          style={{ width: 'calc(100% - 400px)' }}
        >
          <EditorLivePreview previewRef={previewRef} />
        </div>
      </main>
    </div>
  );
}
