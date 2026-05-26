'use client';

import type { RefObject } from 'react';
import { EditorLivePreview } from '@/components/preview/EditorLivePreview';
import { LinkedInPreview } from '@/components/preview/LinkedInPreview';
import { MobilePreview } from '@/components/preview/MobilePreview';
import { useEditorUIStore } from '@/store/editor-ui.store';
import { cn } from '@/utils/cv.utils';

interface CenterPreviewProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

const VIEW_MODES = [
  { id: 'cv' as const, label: 'Vue CV' },
  { id: 'mobile' as const, label: 'Vue Mobile' },
  { id: 'linkedin' as const, label: 'Vue LinkedIn' },
];

export function CenterPreview({ previewRef }: CenterPreviewProps) {
  const previewView = useEditorUIStore((state) => state.previewView);
  const setPreviewView = useEditorUIStore((state) => state.setPreviewView);

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#2a2a32]" aria-label="Aperçu du CV">
      <div
        className="flex shrink-0 items-center justify-between gap-3 border-b border-cvforge-border/50 bg-cvforge-bg/80 px-3 py-2 backdrop-blur-sm sm:px-4"
        data-cvforge-chrome
      >
        <div
          className="inline-flex rounded-lg border border-cvforge-border bg-cvforge-surface p-0.5"
          role="tablist"
          aria-label="Mode d'aperçu"
        >
          {VIEW_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={previewView === mode.id}
              onClick={() => setPreviewView(mode.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent-blue',
                previewView === mode.id
                  ? 'bg-cvforge-accent-blue text-white'
                  : 'text-cvforge-muted hover:text-cvforge-text',
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {/* CV A4 visible ou masqué — le ref reste monté pour l’export PDF */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col',
            previewView !== 'cv' && 'pointer-events-none invisible',
          )}
          aria-hidden={previewView !== 'cv'}
        >
          <EditorLivePreview previewRef={previewRef} variant="studio" />
        </div>

        {previewView === 'mobile' && <MobilePreview />}
        {previewView === 'linkedin' && <LinkedInPreview />}
      </div>
    </main>
  );
}
