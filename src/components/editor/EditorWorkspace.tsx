'use client';

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import { CVEditor } from '@/components/editor/CVEditor';
import { EditorLivePreview } from '@/components/preview/EditorLivePreview';
import { cn } from '@/utils/cv.utils';

type MobilePanel = 'edit' | 'preview';

interface EditorWorkspaceProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

const MOBILE_BREAKPOINT_PX = 1024;

export function EditorWorkspace({ previewRef }: EditorWorkspaceProps) {
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('edit');
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);

    const update = () => setIsNarrow(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isNarrow && (
        <div
          className="flex shrink-0 border-b border-slate-200 bg-white p-2"
          role="tablist"
          aria-label="Basculer entre édition et aperçu"
          data-cvforge-chrome
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobilePanel === 'edit'}
            onClick={() => setMobilePanel('edit')}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              mobilePanel === 'edit'
                ? 'bg-[#2563EB] text-white'
                : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            Éditer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobilePanel === 'preview'}
            onClick={() => setMobilePanel('preview')}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              mobilePanel === 'preview'
                ? 'bg-[#2563EB] text-white'
                : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            Aperçu
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            'h-full min-h-0 shrink-0',
            isNarrow
              ? mobilePanel === 'edit'
                ? 'flex w-full min-w-0'
                : 'hidden'
              : 'flex w-[400px]',
          )}
        >
          <CVEditor className={isNarrow ? 'w-full' : undefined} />
        </div>

        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col',
            isNarrow && mobilePanel !== 'preview' && 'hidden',
          )}
        >
          <EditorLivePreview previewRef={previewRef} />
        </div>
      </div>
    </div>
  );
}
