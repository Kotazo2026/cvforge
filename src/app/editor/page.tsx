'use client';

import { useEffect, useState } from 'react';
import { CVEditor } from '@/components/editor/CVEditor';
import { EditorLivePreview } from '@/components/preview/EditorLivePreview';
import { useCVStore } from '@/store/cv.store';

export default function EditorPage() {
  const [hydrated, setHydrated] = useState(false);

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
    <main className="flex h-screen overflow-hidden bg-slate-100">
      <CVEditor />
      <div className="flex-1 overflow-y-auto p-6">
        <EditorLivePreview />
      </div>
    </main>
  );
}
